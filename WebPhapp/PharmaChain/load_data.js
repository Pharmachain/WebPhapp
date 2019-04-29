let fs = require("fs");
let Web3 = require("web3");
let net = require("net");

const conn = require('../backend/connections.js');
// establish a connection to the remote MySQL DB
if(conn.MySQL) {
    var connection = require('mysql2').createConnection(conn.MySQL);
    var mysql = require('../backend/mysql_helper.js');
}

/* Helper script to check if dummy data exists on the blockchain
 * If it exists do nothing, else upload json dummy data in ../backend/dummy_data/prescriptions.json
 * Usage: sudo node load_data.js
 */
async function loadPrescriptions(){
	if(conn.MySQL) {
		await mysql.PrescriptionIDsByPatientIndex.reset(connection);
		connection.close();
https://github.com/Pharmachain/WebPhapp/pull/77/conflict?name=WebPhapp%252Fbackend%252Fserver.js&ancestor_oid=a972ed704ef3d6f6d5c1ac4ea9fb33dde8c1cbdc&base_oid=c0f5b0338b06e7baa94dd472d3bf83c5ee079f34&head_oid=3216a244390e19f630b1dcc35eddaefb638fb92f		console.log('index table in MySQL reset.');
	}

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

    let length = await Patient.methods.getDrugChainLength().call({from: account});
    if(length > 0) {
		console.log("Existing prescriptions found, dummy data not loaded.");
		return;
	}

	console.log("No prescriptions found, adding dummy data.");
	var obj = JSON.parse(fs.readFileSync('../backend/dummy_data/prescriptions.json', 'utf8'));
	for (var j = 0; j < obj.prescriptions.length; j++) {
		p = obj.prescriptions[j];
			
		//Temp variable to store fillDates
		let fillDates = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		for (var i = 0; i < p.fillDates.length; i++) {
			if(p.fillDates[i] > 0) {
				fillDates[i] = p.fillDates[i]
			}
		}
		
		if(p.cancelDate <= 0){
			p.cancelDate = 0;
			p.isCancelled = false;
		}
		else {
			p.isCancelled = true;
		}

	    let transaction = await Patient.methods.addPrescription(
		p.patientID,
		p.prescriberID,
		p.dispenserID,
		p.drugID,
		p.quantity,
		fillDates,
		p.writtenDate,
		p.daysFor,
		p.refillsLeft,
		p.isCancelled,
		p.cancelDate,
		p.daysBetween
	    );
	
		let encoded_transaction = transaction.encodeABI();
		await web3.eth.sendTransaction({
			data: encoded_transaction,
			from: account,
			to: Patient.options.address,
			gas: 50000000
		});
	}
}

loadPrescriptions();
