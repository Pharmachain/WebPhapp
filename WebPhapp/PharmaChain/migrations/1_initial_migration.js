var Migrations = artifacts.require("./Migrations.sol");
var PrescriptionData = artifacts.require("./PrescriptionData.sol");
var PrescriptionBase = artifacts.require("./PrescriptionBase.sol");
var PrescriptionAccessControl = artifacts.require("./PrescriptionAccessControl.sol")
var Patient = artifacts.require("./Patient.sol");

module.exports = function(deployer){
    deployer.deploy(Migrations, {gas: 5000000});
    deployer.deploy(PrescriptionBase, {gas: 5000000});
    deployer.deploy(PrescriptionData, {gas: 5000000});
    deployer.deploy(PrescriptionAccessControl, {gas: 500000});
    deployer.deploy(Patient, {gas: 5000000});
};
