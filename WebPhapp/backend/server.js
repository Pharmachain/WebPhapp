const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");
var conn = require('./connections.js') // private file not under VC.

const app = express();
app.use(bodyParser.json() );        // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// establish a connection to the remote MySQL DB
if(conn.MySQL) {
    var connection = require('mysql2').createConnection(conn.MySQL);
    var mysql = require('./mysql_helper.js');
}

// use functions for interacting with Blockchain
if(conn.Blockchain) {
    var block_helper = require('./block_helper.js')
}

// JSON reader to read in dummy data
function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

/*
    given a prescription, replaces all date integers with strings.
    Returns updated prescription.
    Assumes that all fields are properly filled.
*/
function convertDatesToString(prescription){
    prescription.writtenDate = new Date(prescription.writtenDate).toString();
    prescription.fillDates = prescription.fillDates.filter(dateInt => dateInt > 0);
    prescription.fillDates = prescription.fillDates.map(dateInt => new Date(dateInt).toString());
    return prescription;
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

/*
About:
Attempts to add a prescription for a user, while also doing validation.
Status of 200 if successful, 400 otherwise.
Expects an object with all integer fields:
{
    patientID,
    drugID,
    quantity,
    daysValid,
    refills,
    prescriberID,
    dispensorID
}
    Directly in terminal:
        >>> curl 'http://localhost:5000/api/v1/prescriptions/add' -H 'Accept: application/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"patientID":0,"drugID":0,"quantity":1,"daysValid":0,"refills":0,"prescriberID":0,"dispenserID":0}'
    To be used in Axois call:
        .post("/api/v1/prescription/add",{
            patientID: 0,
            ....
        }
*/
app.post('/api/v1/prescriptions/add',(req,res) => {    
    const prescription = req.body;

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
        return;
    }

    // validate fields exist that should
    fields = [
        prescription.patientID,
        prescription.drugID,
        prescription.quantity,
        prescription.daysValid,
        prescription.refills,
        prescription.prescriberID,
        prescription.dispenserID
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        return finish("Required prescription field(s) are null or undefined.", false)
    }

    // validate fields are of proper type
    for (var key in prescription){
        if(key === "quantity"){
            if(typeof prescription[key] !== "string"){
                return finish("Prescription field '" + key + "' should be of type String.", false);
            }
        } else if( !Number.isInteger(prescription[key]) ){
            return finish("Prescription field '" + key + "' should be of type Integer.", false);
        }
    }

    // validate there are no extraneous fields
    if(Object.keys(prescription).length > fields.length){
        return finish("Prescription input has too many fields.", false);
    }

    // other validation here should include:
    //  - When sessions are created, validate the prescriber based upon the session cookie, not the ID itself.
    //  - Validate the drugID, dispensorID, patient all exist.
    // we are ignoring this for now and will come back to it.

    // Add derived fields to the prescription
    prescription.fillDates = []; // array of integer dates filled by the dispenser.
    prescription.writtenDate = new Date().getTime(); // time is in milliseconds since 1970 epoch.
    prescription.cancelDate = -1; // -1 means no date- not cancelled.

    // TODO: query blockchain to get current highest prescriptionID
    prescription.prescriptionID = -1;

    // Add the prescription to the blockchain and index this prescription in MySQL.
    return finish("TODO: build prescription add to blockchain", true);
});

/*
An api endpoint that returns all of the prescriptions associated with a patient ID
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/1"
    To be used in Axois call:
        .get("api/v1/prescriptions/1")
Returns:
    A list of prescription objects each with fields: [
        prescriptionID, patientID, drugID, fillDates,
        writtenDate, quantity, daysFor, refillsLeft,
        prescriberID, dispenserID, cancelDate, drugName
    ]
*/
app.get('/api/v1/prescriptions/:patientID', (req,res) => {
    var patientID = parseInt(req.params.patientID);
    var handlePrescriptionsCallback = function(prescriptions) {
        var msg = 'Sent ' + prescriptions.length.toString() +
                    ' prescription(s) for patient ID ' + patientID.toString();

        // if no prescriptions for a patient ID, return early
        if (prescriptions.length === 0) {
            console.log(msg);
            res.json([]);
            return;
        }

        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            for (var i = 0; i < prescriptions.length; i++){
                prescriptions[i].drugName = "drugName";
            }
            res.json(prescriptions);
            return;
        }

        // Look up the drug names given the list of drugIDs in MySQL
        var drugIDs = prescriptions.map((prescription) => {
            return prescription.drugID;
        })

        mysql.getDrugNamesFromIDs(drugIDs, connection)
        .then((answer) => {
            for (var i = 0; i < prescriptions.length; i++){
                var drug = answer.rows.filter((row) => {
                    return (row.ID === prescriptions[i].drugID);
                });

                // Could be undefined on return
                if(drug.length !== 0)
                prescriptions[i].drugName = drug[0].NAME;
            }

            console.log(msg);
            res.json(prescriptions);
        })
        .catch((error) => {
            console.log("/api/v1/prescriptions: error: ", error);
            res.status(400).send({});
        });
    };

    if(conn.Blockchain){
        var field_patientID = 0;
        block_helper.read_by_value(field_patientID, patientID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        }).catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching patientID.');
        });
    }
    else { // search prescriptions from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
    
        var toSend = [];
        prescriptions.forEach(prescription => {
            if (prescription.patientID === patientID) toSend.push(prescription);
        });
        handlePrescriptionsCallback(toSend);
    }
});

/*
An api endpoint that returns a single prescription given a prescription ID
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/single/1"
    To be used in Axois call:
        .get("api/v1/prescriptions/single/1")
Returns:
    A prescription object each with fields: [
        prescriptionID,
        patientID,
        drugID,
        fillDates,
        writtenDate,
        quantity,
        daysFor,
        refillsLeft,
        prescriberID,
        dispenserID,
        cancelDate,
        drugName
    ]
Warning:
    no validation exists for blockchain index yet. See Issue #32 on GitHub.
*/
app.get('/api/v1/prescriptions/single/:prescriptionID', (req,res) => {
    var prescriptionID = parseInt(req.params.prescriptionID);
    var handlePrescriptionCallback = function(prescription) {
        // '==' catches both null and undefined
        if (prescription == null) {
            console.log('/api/v1/prescriptions/single: No ID match');
            res.status(400).send({});
            return;
        }

        // Convert date integers to strings
        prescription = convertDatesToString(prescription);

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            prescription.drugName = "drugName";
            console.log("/api/v1/prescriptions/single: Sent prescription with ID " + prescriptionID);
            res.json(prescription);
            return;
        }

        // Look up the drug name given the ID in MySQL
        mysql.getDrugNamesFromIDs([prescription.drugID], connection) // prescription.drugID
        .then((answer) => {
            if (answer.rows.length === 0) {
                prescription.drugName = 'drugName not found in Pharmacopoeia';
            } else {
                prescription.drugName = answer.rows[0].NAME;
            }

            console.log("/api/v1/prescriptions/single: Sent prescription with ID " + prescriptionID);
            res.json(prescription);
        })
        .catch((error) => {
            console.log("/api/v1/prescriptions/single: error: ", error);
            res.json({});
        });
    };

    if(conn.Blockchain){
        block_helper.read(prescriptionID)
        .then((answer) => {
            handlePrescriptionCallback(answer.prescription);
        }).catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Prescription not found.');
        });
    }
    else { // load prescription from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
    
        var prescription = prescriptions.find( function(elem) {
            return elem.prescriptionID === prescriptionID;
        });
        handlePrescriptionCallback(prescription);
    }
});

/*
About:
    An api endpoint that returns a list of patients given a first and
    last name. Patient data temporarily includes date of birth,
    first and last name, and patient ID. Names are converted to all lowercase.
    You can request patients by first name, last name, or both.
    TODO: restrict query to a single prescriber.
Examples:
    Directly in terminal:
        By both first and last name:
            >>> curl "http://localhost:5000/api/v1/patients?first=jacob&last=krantz"
        By just first name:
            >>> curl "http://localhost:5000/api/v1/patients?first=jacob"
        By just last name:
            >>> curl "http://localhost:5000/api/v1/patients?last=krantz"
    To be used in Axois call:
        .get("/api/v1/patients?first=jacob&last=krantz")
        .get("/api/v1/patients?first=jacob")
        .get("/api/v1/patients?last=krantz")

Returns:
    List of patients with all personal information:
    [
        {
            "first": "jacob",
            "last": "krantz",
            "patientID": 1,
            "dob": "10-05-1996"
        },
        ...
    ]

Relevant Express Docs:
    https://expressjs.com/en/api.html#req.query
*/
app.get('/api/v1/patients', (req,res) => {
    var first = req.query.first;
    var last = req.query.last;

    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    // Searching for substrings
    var matchingPatients = all_patients.filter(function(elem) {
        if( first === undefined && last === undefined ){
            // if no query given, return all patients
            return true;
        } else if( last === undefined ){
            return (elem.first.includes(first.toLowerCase()));
        }
        else if( first === undefined ){
            return (elem.last.includes(last.toLowerCase()));
        }
        return (elem.first.includes(first.toLowerCase()))
                && (elem.last.includes(last.toLowerCase()));
    });

    // log the backend process to the terminal
    var msg = '/api/v1/patients: returning ' + matchingPatients.length.toString() + ' patient match(es) for';
    if(first !== undefined) msg += ' [first name: ' + first.toLowerCase() + ']';
    if(last !== undefined) msg += ' [last name: ' + last.toLowerCase() + ']';
    console.log(msg);

    res.json(matchingPatients);
});

/*
About:
    An api endpoint that returns the info about a patient given a specific
    patient ID. Patient data temporarily includes date of birth, first and
    last name, and patient ID.
    TODO: restrict query to a single prescriber.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/patients/1"
    To be used in Axois call:
        .get("/api/v1/patients/1")
Returns:
    Patient info object with all personal information:
    {
        "first": "jacob",
        "last": "krantz",
        "patientID": 1,
        "dob": "10-05-1996"
    }
*/
app.get('/api/v1/patients/:patientID', (req,res) => {
    var patientID = parseInt(req.params.patientID);

    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    var matchingPatient = all_patients.find(function(patient){
        return patient.patientID === patientID;
    })

    // log the backend process to the terminal
    var msg = '/api/v1/patients/:patientID: ';
    if(matchingPatient === undefined){
        msg += 'Returning no patient. No patientID matching \'' + patientID.toString() + '\'';
        matchingPatient = {};
    } else {
        msg += 'Returning patient info for patientID \'' + patientID.toString() + '\'';
    }

    console.log(msg);
    res.json(matchingPatient);
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
    res.status(404).send('Not found');
})

// use the environment variable if set, otherwise use port 5000
var server = app.listen(process.env.PORT || 5000, function () {
        var port = server.address().port;
        console.log('App is listening on port ' + port);
    });

module.exports = server;
