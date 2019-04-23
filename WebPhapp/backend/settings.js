
var settings = {
    // test, dev and proc.
    // test will remove all auth checks.
    env: 'test',

    // true: try to use MySQL for prescripton indexing by patientID
    // false: just search blockchcain linearly
    indexPrescriptions: false
};

module.exports = settings;
