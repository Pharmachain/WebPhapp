/*
Functions that leverage the MySQL DB connection
*/

module.exports = {

    /*
    Given a list of drugIDs, looks up drug names in the MySQL DB.
    Args:
        drugIDs list <(int or string)>
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row contains:
            row.ID (int)  the drugID in the pharmacopeia
            row.NAME (string) the name of the drug
    */
    getDrugNamesFromIDs: function(drugIDs, connection) {
        /*
        Example of a prepared statement.
        Use the question mark(?) to denote the values you want to replace.
        Then, as a second parameter, include an array of the values to replace.
        */
        var q = `
        SELECT ID, NAME
        FROM seniordesign1.pharmacopeia
        WHERE ID IN ( ? )
        `;

        return new Promise((resolve, reject) => {
            var values = [drugIDs.map(id => id.toString())];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    // Index for fast lookups of prescriptionIDs given a patientID
    PrescriptionIDsByPatientIndex = {
        /*
         *  Look up an array of prescriptionIDs given a patientID.
         *  Returns: Promise.
         *      Upon resolution, returns (answer) which is a list of rows.
         *      Answer can be unpacked in a call to .then((answer) => { ... })
         *      Each row contains:
         *          row.patient_id (int)
         *          row.prescription_id (int)
         */
        get: function(patientID, connection) {
            var q = `
            SELECT *
            FROM seniordesign1.patient_id_index
            WHERE patient_id = ( ? );
            `;

            return new Promise((resolve, reject) => {
                connection.query(q, patientID, (error, rows, fields) => {
                    if (error) reject(error);
                    resolve({rows, fields});
                });
            });
        },

        /*
         * Call when adding a prescription. Adds an entry to the index table.
         */
        add: function(patientID, prescriptionID, connection) {
            var q = `
            INSERT INTO seniordesign1.patient_id_index
                (patient_id, prescription_id)
            VALUES
                (?, ?);
            `;

            return new Promise((resolve, reject) => {
                connection.query(q, [patientID, prescriptionID], (error, rows, fields) => {
                    if (error) reject(error);
                    resolve({rows, fields});
                });
            });
        },

        /*
         * Resets the indexing table to hold indices for the values in the dummy data.
         * If the dummy data is updated, this query becomes outdated.
         */
        reset: function(connection) {
            var q = `
            TRUNCATE TABLE seniordesign1.patient_id_index;
            INSERT INTO seniordesign1.patient_id_index
                (patient_id, prescription_id)
            VALUES
                (1, 1),
                (1, 2),
                (1, 3),
                (1, 4),
                (1, 5),
                (1, 6),
                (2, 7);
            `;

            return new Promise((resolve, reject) => {
                connection.query(q, (error, rows, fields) => {
                    if (error) reject(error);
                    resolve({rows, fields});
                });
            });
        }
    }
}
