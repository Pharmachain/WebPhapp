const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");
const crypto = require('crypto');
const app = express();
const cookieParser = require('cookie-parser');
const pbkdf2 = require('pbkdf2');

const conn = require('./connections.js') // private file not under VC.
const auth = require('./auth_helper.js');
const Role = require("./role.js");
const settings = require('./settings.js');

app.use(bodyParser.json());        // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cookieParser());
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

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

    // if cancelDate is -1 or 0, then there is no cancel date.
    // if a cancelDate exists, then convert it to a string representation.
    if(prescription.cancelDate > 0){
        prescription.cancelDate = new Date(prescription.cancelDate).toString();
    }
    return prescription;
}

/*
    Given a list of prescriptions, organize them in decreasing, chronological order.
    prescriptions: An array of prescription objects
    attribute: A value to determine the mode of the function.
        1 for the written date to organize, anything else for fillDates
    returns an array of organized prescriptions
*/
function orderPrescriptions(prescriptions, attribute){
    return prescriptions.sort((pres1, pres2) => {
        if(attribute === 1){
            return  pres2.writtenDate - pres1.writtenDate;
        }

        if(pres1.fillDates.length === 0 ){
            return 1;
        }
        else if(pres2.fillDates.length === 0){
            return -1;
        }
        else{
            return pres2.fillDates[pres2.fillDates.length-1] - pres1.fillDates[pres1.fillDates.length-1];
        }
    });
}

/*
An api endpoint that cancels a prescription associated with a given prescriptionID.
Example:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/cancel/0"
    To be used in Axois call:
        .get("api/v1/prescriptions/cancel/0")
*/
app.get('/api/v1/prescriptions/cancel/:prescriptionID', auth.checkAuth([Role.Prescriber, Role.Dispenser]), (req,res) => {
    var prescriptionID = parseInt(req.params.prescriptionID);
    var date = new Date().getTime();

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
        return;
    }

    if(conn.Blockchain) {
        // check length of blockchain to see if prescriptionID is valid (prescriptions are indexed by ID)
         block_helper.verifyChainIndex(prescriptionID)
         .then((_) => {
            block_helper.cancel(prescriptionID, date)
            .then((answer) => {
                return finish(answer.toString(), true);
            })
            .catch((error) => {
                return finish('/api/v1/prescriptions/cancel: error: ' + error.toString(), false);
            });
        })
        .catch((error) => {
            return finish('/api/v1/prescriptions/cancel: error: ' + error.toString(), false);
        });
    } else { // cancel prescription from dummy data
        return finish('/api/v1/prescriptions/cancel: tmp: dummy data not changed', true);
    }
});

/*
Edits a prescription for a given prescriptionID. The prescriptionID indexes the prescription on the blockchain.
Editable fields: quantity (string), daysValid (int), refillsLeft (int), dispenserID (int)
Takes an object of shape:
    {
        prescriptionID,
        quantity,
        daysValid,
        refillsLeft,
        dispenserID
    }
Examples:
    Directly in terminal:
        >>> curl 'http://localhost:5000/api/v1/prescriptions/edit' -H 'Acceptapplication/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"prescriptionID": 0,"quantity":"99mg","daysValid":98,"refillsLeft":97,"dispenserID":96}'
    To be used in an axios call:
        .post("/api/v1/prescription/edit",{
            prescriptionID: 0,
            ....
        }
Returns:
    true (and status code 200) if prescription edited, false (and status code 400) otherwise.
*/

app.post('/api/v1/prescriptions/edit', auth.checkAuth([Role.Prescriber, Role.Dispenser]), (req,res) => {

    const changedPrescription = req.body;

    // Should become actuall, non-static data
    var prescriptions = readJsonFileSync(
        __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

    var prescription = prescriptions.find( function(elem) {
        return elem.prescriptionID === changedPrescription.prescriptionID;
    });

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
        return;
    }

    // Ensure mandatory fields are all provided
    fields = new Set([
        changedPrescription.prescriptionID,
        changedPrescription.quantity,
        changedPrescription.daysValid,
        changedPrescription.refillsLeft,
        changedPrescription.dispenserID
    ]);
    if(fields.has(undefined) || fields.has(null)) {
        return finish('/api/v1/prescriptions/edit: One of the mandatory prescription fields is null or undefined.', false);
    }

    if(conn.Blockchain){
         // check length of blockchain to see if prescriptionID is valid (prescriptions are indexed by ID)
         block_helper.verifyChainIndex(changedPrescription.prescriptionID)
         .then((_) => {
            // Filled or cancelled prescriptions cannot be altered: a check is performed in block_helper.update()
            block_helper.update(
                changedPrescription.prescriptionID,
                changedPrescription.dispenserID,
                changedPrescription.quantity,
                changedPrescription.daysValid,
                changedPrescription.refillsLeft
            ).then((_) => {
                return finish('/api/v1/prescriptions/edit: edited prescription with ID ' + changedPrescription.prescriptionID.toString(), true);
            })
            .catch((error) => {
                return finish('/api/v1/prescriptions/edit: error: ' + error.toString(), false);
            });
        })
        .catch((error) => {
            return finish('/api/v1/prescriptions/edit: error: ' + error.toString(), false);
        });
    } else { // cancel prescription from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/dummy_data/prescriptions.json').prescriptions;

        var prescription = prescriptions.find( function(elem) {
            return elem.prescriptionID === changedPrescription.prescriptionID;
        });
        return finish('edit tmp: dummy data not changed', true);
    }
});

/*
About:
    Attempts to add a prescription for a user, while also doing validation.
    Status of 200 if successful, 400 otherwise.
    Expects an object with all integer fields:
    {
        patientID,
        drugID,
        quantity,
        daysFor,
        refillsLeft,
        prescriberID,
        dispenserID
    }
Examples:
    Directly in terminal:
        >>> curl 'http://localhost:5000/api/v1/prescriptions/add' -H 'Accept: application/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"patientID":0,"drugID":13,"quantity":"1mg","daysValid":0,"refills":0,"prescriberID":0,"dispenserID":0}'
    To be used in Axois call:
        .post("/api/v1/prescription/add",{
            patientID: 0,
            ....
        }
Returns:
    true if prescription is added, false if not.
Note on daysValid field:
    https://github.com/Pharmachain/WebPhapp/pull/40/files#r259635589
*/
app.post('/api/v1/prescriptions/add', auth.checkAuth([Role.Prescriber]),(req,res) => {
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
        prescription.daysFor,
        prescription.refillsLeft,
        prescription.prescriberID,
        prescription.dispenserID
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        return finish('Required prescription field(s) are null or undefined.', false)
    }

    // cast int fields to int
    try {
        prescription.patientID = parseInt(prescription.patientID);
        prescription.drugID = parseInt(prescription.drugID);
        prescription.daysFor = parseInt(prescription.daysFor);
        prescription.refillsLeft = parseInt(prescription.refillsLeft);
        prescription.prescriberID = parseInt(prescription.prescriberID);
        prescription.dispenserID = parseInt(prescription.dispenserID);
    } catch(error) {
        finish("Error casting fields to int: " + error.toString(), false);
    }

    // validate fields are of proper type
    for (var key in prescription){
        if(key === 'quantity'){
            if(typeof prescription[key] !== 'string'){
                return finish("Prescription field '" + key + "' should be of type String.", false);
            }
        } else if( !Number.isInteger(prescription[key]) ){
            return finish("Prescription field '" + key + "' should be of type Integer.", false);
        }
    }

    // validate there are no extraneous fields
    if(Object.keys(prescription).length > fields.length){
        return finish('Prescription input has too many fields.', false);
    }

    // other validation here should include:
    //  - When sessions are created, validate the prescriber based upon the session cookie, not the ID itself.
    //  - Validate the drugID, dispenserID, patient all exist.
    // we are ignoring this for now and will come back to it.

    // Add derived fields to the prescription
    prescription.fillDates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    prescription.writtenDate = new Date().getTime(); // time is in milliseconds since 1970 epoch.
    prescription.isCancelled = false;
    prescription.cancelDate = 0; // 0 means no date- not cancelled.

    // TODO: index this prescription in MySQL.
    console.log('Adding prescription to chain for patientID ' + prescription.patientID.toString() + '...');
    if(conn.Blockchain) {
        block_helper.write(
            prescription.patientID,
            prescription.prescriberID,
            prescription.dispenserID,
            prescription.drugID,
            prescription.quantity,
            prescription.fillDates,
            prescription.writtenDate,
            prescription.daysFor,
            prescription.refillsLeft,
            prescription.isCancelled,
            prescription.cancelDate
        ).then((_) => {
            return finish('Added prescription to chain.', true);
        }).catch((error) => {
            // Error in adding prescription to blockchain
            return finish('Error: ' + error.toString(), false);
        });
    }
    else {
        return finish('do nothing for add prescription with dummy data', true);
    }
});

/*
An api endpoint that returns all of the prescriptions associated with a patient ID
Roles:
    TODO: Role.Patient needs to be restricted further to one's own patientID only.
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
app.get('/api/v1/prescriptions/:patientID', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Dispenser, Role.Government]), (req,res) => {

    var patientID = parseInt(req.params.patientID);
    var token = req.token;
    if((token.role === Role.Patient && patientID != token.sub) && settings.env !== "test"){
        console.log("PatientIDs do not match...")
        res.status(400).send(false);
        return;
    }
    var handlePrescriptionsCallback = function(prescriptions) {
        var msg = 'Sent ' + prescriptions.length.toString() +
                    ' prescription(s) for patient ID ' + patientID.toString();

        // if no prescriptions for a patient ID, return early
        if (prescriptions.length === 0) {
            console.log(msg);
            res.json([]);
            return;
        }

        prescriptions = orderPrescriptions(prescriptions,1);
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
                if(drug.length !== 0) {
                    prescriptions[i].drugName = drug[0].NAME;
                }
                else {
                    prescriptions[i].drugName = "drugName";
                }
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
An api endpoint that returns all of the prescriptions associated with a prescriber ID
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/prescriber/1"
    To be used in Axois call:
        .get("api/v1/prescriptions/prescriber/1")
Returns:
    A list of prescription objects each with fields: [
        prescriptionID, patientID, drugID, fillDates,
        writtenDate, quantity, daysFor, refillsLeft,
        prescriberID, dispenserID, cancelDate, drugName
    ]
*/
app.get('/api/v1/prescriptions/prescriber/:prescriberID', (req,res) => {
    var prescriberID = parseInt(req.params.prescriberID);
    var handlePrescriptionsCallback = function(prescriptions) {
        var msg = '/api/v1/prescriptions/prescriber: Sent ' + prescriptions.length.toString() +
                    ' prescription(s) for prescriberID ' + prescriberID.toString();

        // if no prescriptions for a prescriber ID, return early
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
                if(drug.length !== 0) {
                    prescriptions[i].drugName = drug[0].NAME;
                }
                else {
                    prescriptions[i].drugName = "drugName";
                }
            }

            console.log(msg);
            res.json(prescriptions);
        })
        .catch((error) => {
            console.log("/api/v1/prescriptions/prescriber: error: ", error);
            res.status(400).send({});
        });
    };

    if(conn.Blockchain){
        var field_prescriberID = 0;
        block_helper.read_by_value(field_prescriberID, prescriberID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        }).catch((error) => {
            console.log('/api/v1/prescriptions/prescriber: error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching prescriberID.');
        });
    }
    else { // search prescriptions from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
    
        var toSend = [];
        prescriptions.forEach(prescription => {
            if (prescription.prescriberID === prescriberID) toSend.push(prescription);
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
app.get('/api/v1/prescriptions/single/:prescriptionID', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Government, Role.Dispenser]), (req,res) => {

    // Need check for prescriptions
    var prescriptionID = parseInt(req.params.prescriptionID);
    // Ensures that the patientID is the same as the tokens ID.
    var token = req.token;

    if((token.role === Role.Patient && prescriptionID != token.sub) && settings.env !== "test"){
        console.log("PatientIDs do not match...")
        res.status(400).send(false);
        return;
    }
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
        // check length of blockchain to see if prescriptionID is valid (prescriptions are indexed by ID)
        block_helper.verifyChainIndex(prescriptionID)
        .then((_) => {
            block_helper.read(prescriptionID)
            .then((answer) => {
                handlePrescriptionCallback(answer.prescription);
            }).catch((error) => {
                console.log('error: ', error);
                res.status(400).send('Error searching for prescription by prescriptionID.');
            });
        }).catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error searching for prescription by prescriptionID.');
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

// ------------------------
//        patients
// ------------------------

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
app.get('/api/v1/patients', auth.checkAuth([Role.Prescriber, Role.Government, Role.Dispenser]), (req,res) => {
    var first = req.query.first;
    var last = req.query.last;

    // Need to check for the role of a patient here...
    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    // Searching for substrings
    var matchingPatients = all_patients.filter(function(elem) {
        if( first === undefined && last === undefined ){
            // if no query given, return all patients
            return true;
        } else if( last === undefined ){
            return (elem.first.toLowerCase().includes(first.toLowerCase()));
        }
        else if( first === undefined ){
            return (elem.last.toLowerCase().includes(last.toLowerCase()));
        }
        return (elem.first.toLowerCase().includes(first.toLowerCase()))
                && (elem.last.toLowerCase().includes(last.toLowerCase()));
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
app.get('/api/v1/patients/:patientID', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Dispenser, Role.Government]), function(req,res) {

    var patientID = parseInt(req.params.patientID);
    var token = req.token;

    // Ensures that the patientID is the same as the tokens ID.
    if(settings.env !== "test" || (token.role === Role.Patient && patientID != token.sub)){
        console.log("PatientIDs do not match...")
        res.status(400).send(false);
        return;
    }

    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    var matchingPatient = all_patients.find(function(patient){
        return patient.patientID === patientID;
    });

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

app.post('/api/v1/users/me', (req,res) => {
    const userInfo = req.body;
    console.log(userInfo);
    var token = auth.createToken(1, userInfo.role);
    console.log(token);
    res.json(token);
})

/*
About:
    The api endpoint to create a user.
    Expects a username, password and role.
Examples:
    curl 'http://localhost:5000/api/v1/users/add' -H 'Acceptapplication/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"username":"mdulin2","password":"jacob","role":"Patient"}'
Returns:
    Success or failure with message
Authentication:
    Admin only (Role.Admin)
*/
app.post('/api/v1/users/add', (req,res) => {
    const userInfo = req.body;

    // validate fields exist that should
    fields = [
        userInfo.username,
        userInfo.password,
        userInfo.role
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        console.log("/api/v1/users/add: error: Not all fields");
        res.status(400).send(false);
        return;
    }

    // Validates the role
    const checkRole = Object.keys(Role).filter(role => userInfo.role === role);
    if(checkRole.length === 0){
        console.log("/api/v1/users/add: Invalid role");
        res.status(400).send(false);
        return;
    }

    // Salts: Making the random table attack near impossible.
    var salt = crypto.randomBytes(64).toString('base64');

    // Hash the password
    var hashedPassword = pbkdf2.pbkdf2Sync(userInfo.password, salt, 1, 32, 'sha512').toString('base64');

    mysql.updateRoleCount(userInfo.role, connection).then(results => {
        // Grabs the query, not the insertion.
        const role_id = results.rows[1][0].id_number;
        return mysql.insertUser(userInfo.username, hashedPassword, userInfo.role, role_id, connection);
    }).then(result => {
        const id = result.rows[0].insertId;
        return mysql.insertSalt(id, salt, connection);
    }).then(() => {
        console.log("/api/v1/users/add: User created of role", userInfo.role, );
        res.status(200).send(true);
    }).catch((error) => {
        console.log("/api/v1/users/add: error: ", error);
        res.status(400).send(false);
    });
});

/*
About:
    The api endpoint to login as a user.
    Expects a username and password.
Examples:
    curl 'http://localhost:5000/api/v1/users/login' -H 'Acceptapplication/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"username":"mdulin2","password":"jacobispink"}'
Returns:
    A failure message or a auth to authenticate to the next page.
*/
app.post('/api/v1/users/login', (req, res) => {
    const userInfo = req.body;

    // validate fields exist that should
    fields = [
        userInfo.username,
        userInfo.password,
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        console.log("/api/v1/users/login: error: Missing Fields");
        res.status(403).send(false);
        return;
    }

    // Validate the logged in user
    mysql.getSaltByUsername(userInfo.username, connection)
    .then(salt => {

        if(salt.rows.length === 0){
            console.log("/api/v1/users/login: error: User not found.");
            res.status(403).send(false);
            return;
        }

        // Salt the password with the user specific salt
        salt = salt.rows[0].salt;
        var hashedPassword = pbkdf2.pbkdf2Sync(userInfo.password, salt, 1, 32, 'sha512').toString('base64');

        // See if the password matches
        return mysql.getUserValidation(userInfo.username, hashedPassword, connection);
    }).then(user => {
        if(user.rows.length === 0){
            console.log('/api/v1/users/login: Failed attempt');
            res.status(403).send(false);
            return;
        }

        // Login is complete. Send back a auth for the user to advance on.
        var token = auth.createToken(user.rows[0].role_id, user.rows[0].role);

        // Set the cookie AND send the token.
        const options = {
            httpOnly: true,
            sameSite: true
        }
        res.cookie('auth_token',token, options);
        res.json(token);

    }).catch(error => {
        console.log(error);
    });
});

/*
About:
    On the frontend, each time a web request is made for a webpage or api the  token needs to be verified. This reauth will verify the token, then send the user a new token.
Example: NOTE - The 'jwt' must be a valid jwt token for the user.
    curl "http://localhost:5000/api/v1/users/reauth" --cookie 'jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUGF0aWVudCIsInN1YiI6IjEyIiwiaWF0IjoxNTUxMzMzNTYwLCJleHAiOjE1NTEzMzcxNjB9.dR-JZF1VBQU7jEU9nROa_Ky8X7U5w5_H3m2ZpT61_eakRriHMPAQOANLbIVuXfZFeXAaBD0VYM2h4Dmj54WW-L7yn5PJqnlEOJzS1ut4-B1NkfgIXJEdUIFjIedNpkJ9nfN7G7_kSjJ3jpA-pqV8CZHtgINUQggbxp_UrAJd7iUN3Fa58hrQJ3_40ge7seLgI15LLIFUOQV0JQR3VbSPUL5wfZI6XKEXAeAIhuz7YXPxodPZVAxk6a0h4jmfnaxWD777vdiaW_7djYUlIwVD3OWcOGV4EojcIYvUyM8c9MrsRij1LNHEMBr5BuElYcV2ZqgxKE3ek9k1gyu3pMKpOQ'
Returns:
    jwt token or error
*/
app.get('/api/v1/users/reauth', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Dispenser, Role.Government]), (req,res) => {
    if(settings.env === 'test'){
        res.status(200);
        return;
    }

    var token = auth.createToken(req.token.sub, req.token.role);
    const options = {
        httpOnly: true,
        sameSite: true
    }
    res.cookie('auth_token',token, options);
    res.status(200).send(token);
});

/*
About:
    Users need to be able to logout. So, this request just clears the auth_token cookie for the user.
Returns:
    Nothing
*/
app.get('/api/v1/users/logout', (req,res) => {
    res.cookie('auth_token','');
    res.status(200);
});

// ------------------------
//       dispensers
// ------------------------
const FIELD_DISPENSER_ID_INT = 2; // blockchain index of the dispenserID field

/*
About:
    An api endpoint that redeems a prescription at a specific prescriptionID.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/redeem/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/redeem/1")
Returns:
    true if redeemed, false otherwise
*/
app.get('/api/v1/dispensers/redeem/:prescriptionID', auth.checkAuth([Role.Dispenser]), (req, res) => {
    var prescriptionID = parseInt(req.params.prescriptionID);
    var fillDate = new Date().getTime();

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
    }

    if(conn.Blockchain) {
        // check length of blockchain to see if prescriptionID is valid (prescriptions are indexed by ID)
        block_helper.verifyChainIndex(prescriptionID)
        .then((_) => {
            block_helper.redeem(prescriptionID, fillDate)
            .then((_) => {
                return finish('/api/v1/dispensers/redeem: redeemed prescription with ID ' + prescriptionID.toString(), true);
            })
            .catch((error) => {
                return finish('/api/v1/dispensers/redeem: error: ' + error.toString(), false);
            });
        })
        .catch((error) => {
            return finish('/api/v1/dispensers/redeem: error: ' + error.toString(), false);
        });
    } else { // redeem prescription from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/dummy_data/prescriptions.json').prescriptions;

        var prescription = prescriptions.find( function(elem) {
            return elem.prescriptionID === prescriptionID;
        });
        return finish('/api/v1/dispensers/redeem: tmp: dummy data not changed', true);
    }
});

/*
About:
    An api endpoint that returns all related prescriptions for a given dispenserID.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/prescriptions/all/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/prescriptions/1")
Returns:
    list<Prescription>
*/
app.get('/api/v1/dispensers/prescriptions/all/:dispenserID', auth.checkAuth([Role.Dispenser, Role.Government]), (req, res) => {
    var dispenserID = parseInt(req.params.dispenserID);
    const token = req.token;
    if((token.role === Role.Dispenser && dispenserID != token.sub) && settings.env !== "test"){
        console.log("Dispenser IDs do not match...")
        res.status(400).send(false);
        return;
    }

    var handlePrescriptionsCallback = function(prescriptions) {
        // take only prescriptions with matching dispenserID
        prescriptions = prescriptions.filter(
            prescription => prescription.dispenserID === dispenserID
        );

        var valid_return_msg = 'Sending all ' + prescriptions.length.toString()
                        + ' prescription(s) related to dispenserID ' + dispenserID.toString();

        // if no prescriptions, return early
        if(prescriptions.length === 0) {
            console.log(valid_return_msg);
            res.status(200).send(prescriptions);
            return;
        }

        prescriptions = orderPrescriptions(prescriptions,1);

        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            prescriptions = prescriptions.map(
                prescription => {
                    prescription.drugName = "drugName";
                    return prescription;
                }
            );

            console.log(valid_return_msg);
            res.status(200).send(prescriptions);
            return;
        }
        else {
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
                    if(drug.length !== 0) {
                        prescriptions[i].drugName = drug[0].NAME;
                    }
                    else {
                        prescriptions[i].drugName = "drugName";
                    }
                }

                console.log(valid_return_msg);
                res.status(200).send(prescriptions);
                return;
            })
            .catch((error) => {
                console.log("/api/v1/dispensers/prescriptions/all: error: ", error);
                res.status(400).send([]);
                return;
            });
        }
    }

    // Error if dispenser ID is null or undefined
    if(dispenserID == null) {
        console.log('/api/v1/dispensers/prescriptions/all: error: No ID match');
        res.status(400).send([]);
        return;
    }

    if(conn.Blockchain) {
        block_helper.read_by_value(FIELD_DISPENSER_ID_INT, dispenserID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        })
        .catch((error) => {
            console.log('/api/v1/dispensers/prescriptions/all: error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching dispenserID.');
            return;
        });
    }
    else { // search from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
        handlePrescriptionsCallback(prescriptions);
    }
});

/*
About:
    An api endpoint that returns all historical prescriptions for a given dispenserID.
    A prescription is historical if it is either cancelled or has no refills left.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/prescriptions/historical/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/prescriptions/historical/1")
Returns:
    list<Prescription>
*/
app.get('/api/v1/dispensers/prescriptions/historical/:dispenserID', auth.checkAuth([Role.Dispenser, Role.Government]), (req, res) => {
    var dispenserID = parseInt(req.params.dispenserID);
    const token = req.token;
    if((token.role === Role.Dispenser && dispenserID != token.sub) && settings.env !== "test"){
        console.log("Dispenser IDs do not match...")
        res.status(400).send(false);
        return;
    }

    var handlePrescriptionsCallback = function(prescriptions) {
        // only take historical prescriptions with dispenserID
        prescriptions = prescriptions.filter(
            prescription =>
                prescription.dispenserID === dispenserID &&
                (prescription.cancelDate > 0 || prescription.refillsLeft < 1) // there is no cancel date if cancelDate is 0 or -1
        );

        var valid_return_msg = 'Sending ' + prescriptions.length.toString()
                        + ' historical prescription(s) related to dispenserID ' + dispenserID.toString();

        // if no prescriptions, return early
        if(prescriptions.length === 0) {
            console.log(valid_return_msg);
            res.status(200).send(prescriptions);
            return;
        }

        prescriptions = orderPrescriptions(prescriptions,1);
        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            prescriptions = prescriptions.map(
                prescription => {
                    prescription.drugName = "drugName";
                    return prescription;
                }
            );

            console.log(valid_return_msg);
            res.status(200).send(prescriptions);
            return;
        }
        else {
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
                    if(drug.length !== 0) {
                        prescriptions[i].drugName = drug[0].NAME;
                    }
                    else {
                        prescriptions[i].drugName = "drugName";
                    }
                }

                console.log(valid_return_msg);
                res.status(200).send(prescriptions);
                return;
            })
            .catch((error) => {
                console.log("/api/v1/dispensers/prescriptions/historical: error: ", error);
                res.status(400).send([]);
                return;
            });
        }
    }

    // Error if dispenser ID is null or undefined
    if(dispenserID == null) {
        console.log('/api/v1/dispensers/prescriptions/historical: error: No ID match');
        res.status(400).send([]);
        return;
    }

    if(conn.Blockchain) {
        block_helper.read_by_value(FIELD_DISPENSER_ID_INT, dispenserID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        })
        .catch((error) => {
            console.log('/api/v1/dispensers/prescriptions/historical: error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching dispenserID.');
            return;
        });
    }
    else { // search from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
        handlePrescriptionsCallback(prescriptions);
    }
});

/*
About:
    An api endpoint that returns all open prescriptions for a given dispenserID.
    A prescription is open if it can be fulfilled (not cancelled and can be refilled).
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/prescriptions/open/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/prescriptions/open/1")
Returns:
    list<Prescription>
*/
app.get('/api/v1/dispensers/prescriptions/open/:dispenserID', auth.checkAuth([Role.Dispenser, Role.Government]), (req, res) => {
    var dispenserID = parseInt(req.params.dispenserID);
    const token = req.token;
    if((token.role === Role.Dispenser && dispenserID != token.sub) && settings.env !== "test"){
        console.log("Dispenser IDs do not match...");
        res.status(400).send(false);
        return;
    }

    var handlePrescriptionsCallback = function(prescriptions) {
        // only take open prescriptions with dispenserID
        prescriptions = prescriptions.filter(
            prescription =>
                prescription.dispenserID === dispenserID
                && prescription.refillsLeft > 0
                && prescription.cancelDate < 1 // there is no cancel date if cancelDate is 0 or -1
        );

        var valid_return_msg = 'Sending ' + prescriptions.length.toString()
                        + ' open prescription(s) related to dispenserID ' + dispenserID.toString();

        // if no prescriptions, return early
        if(prescriptions.length === 0) {
            console.log(valid_return_msg);
            res.status(200).send(prescriptions);
            return;
        }

        prescriptions = orderPrescriptions(prescriptions,0);
        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            prescriptions = prescriptions.map(
                prescription => {
                    prescription.drugName = "drugName";
                    return prescription;
                }
            );

            console.log(valid_return_msg);
            res.status(200).send(prescriptions);
            return;
        }
        else {
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
                    if(drug.length !== 0) {
                        prescriptions[i].drugName = drug[0].NAME;
                    }
                    else {
                        prescriptions[i].drugName = "drugName";
                    }
                }

                console.log(valid_return_msg);
                res.status(200).send(prescriptions);
                return;
            })
            .catch((error) => {
                console.log("/api/v1/dispensers/prescriptions/open: error: ", error);
                res.status(400).send([]);
                return;
            });
        }
    }

    // Error if dispenser ID is null or undefined
    if(dispenserID == null) {
        console.log('/api/v1/dispensers/prescriptions/open: error: No ID match');
        res.status(400).send([]);
        return;
    }

    if(conn.Blockchain) {
        block_helper.read_by_value(FIELD_DISPENSER_ID_INT, dispenserID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        })
        .catch((error) => {
            console.log('/api/v1/dispensers/prescriptions/open: error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching dispenserID.');
            return;
        });
    }
    else { // search from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
        handlePrescriptionsCallback(prescriptions);
    }
});

/*
About:
    An api endpoint that returns a single dispenser given a dispenserID.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/single/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/single/1")
Returns:
    {
        dispenserID (int),
        name (string),
        phone (int),
        location (string)
    }
*/
app.get('/api/v1/dispensers/single/:dispenserID', (req,res) => { // auth.checkAuth([Role.Government]),
    var dispenserID = parseInt(req.params.dispenserID);
    var finish = function(dispensers) {
        if(dispensers.length > 1) {
            console.log('/api/v1/dispensers/single/: error: too many dispenserID matches');
            res.status(400).send(false);
        }
        else if(dispensers.length === 0) {
            console.log('/api/v1/dispensers/single/: error: no dispenserID match');
            res.status(400).send(false);
        }
        else {
            dispenser = dispensers[0]
            console.log('/api/v1/dispensers/single/: returning dispenser with ID ' + dispenserID.toString());
            res.status(200).send(dispenser);
        }
    };

    if (!conn.MySQL) {
        var dispensers = readJsonFileSync(
            __dirname + '/' + "dummy_data/dispensers.json").dispensers;

        dispensers = dispensers.filter(function(elem) {
            return dispenserID === elem.dispenserID;
        });
        return finish(dispensers);
    }
    
    mysql.getDispenserByID(dispenserID, connection)
    .then((answer) => {
        var dispensers = answer.rows.map((dispenser) => {
            dispenser['dispenserID'] = dispenser['id'];
            delete dispenser['id'];
            return dispenser;
        });
        return finish(dispensers);
    })
    .catch((error) => {
        console.log('/api/v1/dispensers/single/: error: ', error);
        return res.status(400).send({});
    });
});

/*
About:
    An api endpoint that returns all dispensers.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/all"
    To be used in Axois call:
        .get("/api/v1/dispensers/all")
Returns:
    [
        {
            dispenserID (int),
            name (string),
            phone (int),
            location (string)
        },
        ...
    ]
*/
app.get('/api/v1/dispensers/all', (req,res) => { // auth.checkAuth([Role.Government]),    
    // if no connection string (Travis testing), grab dispensers from json files
    if (!conn.MySQL) {
        var dispensers = readJsonFileSync(
            __dirname + '/' + "dummy_data/dispensers.json").dispensers;

        console.log('/api/v1/dispensers/all: returning ' + dispensers.length + ' dispensers.');
        return res.status(200).send(dispensers);
    }

    mysql.getDispensers(connection)
    .then((answer) => {
        var dispensers = answer.rows.map((dispenser) => {
            dispenser['dispenserID'] = dispenser['id'];
            delete dispenser['id'];
            return dispenser;
        });
        console.log('/api/v1/dispensers/all: returning ' + dispensers.length + ' dispensers.');
        return res.status(200).send(dispensers);
    })
    .catch((error) => {
        console.log('/api/v1/dispensers/all: error: ', error);
        return res.status(400).send([]);
    });
});

/*
About:
    An api endpoint that returns a list of all dispensers given a name to match on.
    String matching is case insensitive.
    Returns all dispensers if no name is given.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers?name=walgreens"
    To be used in Axois call:
        .get("/api/v1/dispensers?name=walgreens")
Returns:
    [
        {
            dispenserID (int),
            name (string),
            phone (int),
            location (string)
        },
        ...
    ]
*/
app.get('/api/v1/dispensers', (req, res) => {
    var name = req.query.name; 
    var finish = function(success, dispensers, error='') {
        var msg;
        if(success) {
            msg = 'returning ' + dispensers.length.toString() + ' dispensers.';
        } else {
            msg = 'error: ' + error;
        }
        console.log('/api/v1/dispensers: ' + msg);
        res.status(success ? 200 : 400).send(dispensers);
    };

    // if no connection string (Travis testing), grab dispensers from json files
    if (!conn.MySQL) {
        var dispensers = readJsonFileSync(
            __dirname + '/' + "dummy_data/dispensers.json").dispensers;

        dispensers = dispensers.filter(function(elem) {
            // if no query given, return all dispensers
            if(name === undefined) return true;

            // case insensitive: match substrings in dispenser name
            return elem.name.toLowerCase().includes(name.toLowerCase());
        });
        return finish(true, dispensers);
    }

    // otherwise, grab dispensers from MySQL
    if (name == undefined)  name = '';
    mysql.getDispensersByName(name, connection)
    .then((answer) => {
        var dispensers = [];
        for (var i = 0; i < answer.rows.length; i++){
            dispensers.push({
                dispenserID: answer.rows[i].id,
                name: answer.rows[i].name,
                location: answer.rows[i].location,
                phone: answer.rows[i].phone
            });
        }
        return finish(true, dispensers);
    })
    .catch((error) => {
        return finish(false, [], error);
    });
});

// ------------------------
//        Prescriber
// ------------------------

/*
About:
    An api endpoint that returns all prescribers.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescribers/all"
    To be used in Axois call:
        .get("/api/v1/prescribers/all")
Returns:
    [
        {
            prescriberID (int),
            first (string),
            last (string),
            phone (int),
            location (string)
        },
        ...
    ]
*/
app.get('/api/v1/prescribers/all', (req,res) => { // auth.checkAuth([Role.Government]),
    // if no connection string (Travis testing), grab prescribers from json files
    if (!conn.MySQL) {
        var prescribers = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescribers.json").prescribers;

        console.log('/api/v1/prescribers/all: returning ' + prescribers.length + ' prescribers.');
        return res.status(200).send(prescribers);
    }

    mysql.getPrescribers(connection)
    .then((answer) => {
        var prescribers = answer.rows.map((prescriber) => {
            prescriber['prescriberID'] = prescriber['id'];
            delete prescriber['id'];
            return prescriber;
        });
        console.log('/api/v1/prescribers/all: returning ' + prescribers.length + ' prescribers.');
        return res.status(200).send(prescribers);
    })
    .catch((error) => {
        console.log('/api/v1/prescribers/all: error: ', error);
        return res.status(400).send([]);
    });
});

/*
About:
    An api endpoint that returns a single prescriber given a prescriberID.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescribers/single/1"
    To be used in Axois call:
        .get("/api/v1/prescribers/single/1")
Returns:
    {
        prescriberID (int),
        first (string),
        last (string),
        phone (int),
        location (string)
    }
*/
app.get('/api/v1/prescribers/single/:prescriberID',(req,res) => { // auth.checkAuth([Role.Government]),
    var prescriberID = parseInt(req.params.prescriberID);
    var finish = function(prescribers) {
        if(prescribers.length > 1) {
            console.log('/api/v1/prescribers/single/: error: too many prescriberID matches');
            res.status(400).send(false);
        }
        else if(prescribers.length === 0) {
            console.log('/api/v1/prescribers/single/: error: no prescriberID match');
            res.status(400).send(false);
        }
        else {
            var prescriber = prescribers[0]
            console.log('/api/v1/prescribers/single/: returning prescriber with ID ' + prescriberID.toString());
            res.status(200).send(prescriber);
        }
    }
    
    if(!conn.MySQL) {
        var prescribers = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescribers.json").prescribers;

        prescribers = prescribers.filter(function(elem) {
            return prescriberID === elem.prescriberID;
        });
        return finish(prescribers);
    }

    mysql.getPrescriberByID(prescriberID, connection)
    .then((answer) => {
        var prescribers = answer.rows.map((prescriber) => {
            prescriber['prescriberID'] = prescriber['id'];
            delete prescriber['id'];
            return prescriber;
        });
        return finish(prescribers);
    })
    .catch((error) => {
        console.log('/api/v1/prescribers/single/: error: ', error);
        return res.status(400).send({});
    });
});

/*
About:
    An api endpoint that returns a list of all prescribers given a name to match on.
    String matching is case insensitive.
    Examples:
        Directly in terminal:
            By both first and last name:
                >>> curl "http://localhost:5000/api/v1/prescribers?first=fred&last=beckey"
            By just first name:
                >>> curl "http://localhost:5000/api/v1/prescribers?first=fred"
            By just last name:
                >>> curl "http://localhost:5000/api/v1/prescribers?last=beckey"
        To be used in Axois call:
            .get("/api/v1/prescribers?first=fred&last=beckey")
Returns:
    [
        {
            prescriberID (int),
            first (string),
            last  (string),
            phone (int),
            location (string)
        },
        ...
    ]
*/
app.get('/api/v1/prescribers', (req, res) => { // auth.checkAuth([Role.Government]),
    var first = req.query.first;
    var last = req.query.last;
    var finish = function(success, prescribers, error='') {
        var msg;
        if(success) {
            msg = 'returning ' + prescribers.length.toString() + ' prescriber match(es) for';
            if(first !== undefined) msg += ' [first name: ' + first.toLowerCase() + ']';
            if(last !== undefined) msg += ' [last name: ' + last.toLowerCase() + ']';
        } else {
            msg = 'error: ' + error;
        }
        console.log('/api/v1/prescribers: ' + msg);
        res.status(success ? 200 : 400).send(prescribers);
    };

    // if no connection string (Travis testing), grab dispensers from json files
    if(!conn.MySQL) {
        var all_prescribers = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescribers.json").prescribers;

        // Searching for substrings
        var matchingPrescribers = all_prescribers.filter(function(elem) {
            if( first === undefined && last === undefined ){
                // if no query given, return all patients
                return true;
            } else if( last === undefined ){
                return (elem.first.toLowerCase().includes(first.toLowerCase()));
            }
            else if( first === undefined ){
                return (elem.last.toLowerCase().includes(last.toLowerCase()));
            }
            return (elem.first.toLowerCase().includes(first.toLowerCase()))
                    && (elem.last.toLowerCase().includes(last.toLowerCase()));
        });

        return finish(true, matchingPrescribers);
    }

    // otherwise, grab prescribers from MySQL
    mysql.getPrescribersByName(first, last, connection)
    .then((answer) => {
        var prescribers = [];
        for (var i = 0; i < answer.rows.length; i++){
            prescribers.push({
                prescriberID: answer.rows[i].id,
                first: answer.rows[i].first,
                last: answer.rows[i].last,
                location: answer.rows[i].location,
                phone: answer.rows[i].phone
            });
        }
        return finish(true, prescribers);
    })
    .catch((error) => {
        return finish(false, [], error);
    });
});

// ------------------------
//          Misc
// ------------------------

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
