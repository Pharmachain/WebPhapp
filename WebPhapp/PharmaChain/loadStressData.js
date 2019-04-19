let fs = require("fs");
let Web3 = require("web3");
let net = require("net");


/* 
 * Loads 10,000 prescriptions to the blockchain for stress test purposes.
 * PatientID is random integer in [1, 50].
 * Use to run benchmark speed tests for route /api/v1/prescriptions/:patientID.
 * Usage: sudo node loadStressData.js
 */
async function loadStressData(){

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
    
    var numToAdd = 10000;
    var startTime = new Date().toLocaleTimeString();
    console.log("Start: " + startTime);
    console.log("Adding " + numToAdd.toString() + " prescriptions to the blockchain.");
    var p = {
        "prescriptionID": 1,
        "patientID": 1,
        "drugID": 12,
        "fillDates": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "writtenDate": 1537574400000,
        "quantity": "1mg",
        "daysFor": 7,
        "refillsLeft": 1,
        "prescriberID": 1,
        "dispenserID": 4,
        "cancelDate": 0,
        "isCancelled": false
    };
	for(var j = 0; j < numToAdd; j++) {
	    let transaction = await Patient.methods.addPrescription(
            Math.floor(Math.random() * 50) + 1, // patientID: int in [1, 50]
            Math.floor(Math.random() * 50) + 1, // p.prescriberID: int in [1, 50]
            Math.floor(Math.random() * 50) + 1, // p.dispenserID: int in [1, 50]
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
        
        if(j % 1000 === 0) console.log("added " + j.toString() + " prescriptions.");
    }
    
    console.log("Done adding prescriptions.");
    console.log("Started at " + startTime + ". Ended at " + new Date().toLocaleTimeString());
}

loadStressData();
