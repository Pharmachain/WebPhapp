let fs = require("fs");
let Web3 = require("web3");
let net = require("net");

const conn = require('../backend/connections.js');
// establish a connection to the remote MySQL DB
if(conn.MySQL) {
    var connection = require('mysql2').createConnection(conn.MySQL);
    var mysql = require('../backend/mysql_helper.js');
}

/* 
 * Loads 10,000 prescriptions to the blockchain for stress test purposes. (w/ MySQL index update)
 * PatientID is random integer in [1, 50].
 * Use to run benchmark speed tests for route /api/v1/prescriptions/:patientID.
 * Usage: sudo node loadStressData.js
 */
async function loadStressData(){
    // start by reseting the mysql index
    // await mysql.PrescriptionIDsByPatientIndex.reset(connection);
    console.log('index table reset.');

    // Connecting to the node 1. Will want to change to IPC connection eventually. 
	let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));

    // Get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // Sets up contract requirements.
    let source = fs.readFileSync('./build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi
    let Patient = new web3.eth.Contract(abi, null,{
        data: code,
    });
    Patient.options.address = fs.readFileSync("./patient_contract_address.txt").toString('ascii');    
    
    var numToAdd = 20000;
    var startTime = new Date().toLocaleTimeString();
    console.log("Start: " + startTime);
    console.log("Adding " + numToAdd.toString() + " prescriptions to the blockchain.");
    var p;
    var currentChainLength = await Patient.methods.getDrugChainLength().call({from: account});
    currentChainLength = parseInt(currentChainLength);
	for(var j = 0; j < numToAdd; j++) {
        p = {
            "prescriptionID": 1,
            "patientID": Math.floor(Math.random() * 50) + 1, // patientID: int in [1, 50]
            "drugID": 12,
            "fillDates": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            "writtenDate": 1537574400000,
            "quantity": "1mg",
            "daysFor": 7,
            "refillsLeft": 1,
            "prescriberID": Math.floor(Math.random() * 50) + 1, // p.prescriberID: int in [1, 50]
            "dispenserID": Math.floor(Math.random() * 50) + 1, // p.dispenserID: int in [1, 50]
            "cancelDate": 0,
            "isCancelled": false
        };
	    let transaction = await Patient.methods.addPrescription(
            p.patientID,
            p.prescriberID,
            p.dispenserID,
            p.drugID,
            p.quantity,
            p.fillDates,
            p.writtenDate,
            p.daysFor,
            p.refillsLeft,
            p.isCancelled,
            p.cancelDate
	    );
	
	    let encoded_transaction = transaction.encodeABI();
	    let block = await web3.eth.sendTransaction({
		data: encoded_transaction,
		from: account,
		to: Patient.options.address,
		gas: 50000000
        });
        
        // add index
        await mysql.PrescriptionIDsByPatientIndex.add(p.patientID, currentChainLength, connection);
        currentChainLength += 1;
        if(j % 10 === 0) console.log("added " + j.toString() + " prescriptions.");
    }
    
    console.log("Done adding prescriptions.");
    console.log("Started at " + startTime + ". Ended at " + new Date().toLocaleTimeString());
}

loadStressData();
