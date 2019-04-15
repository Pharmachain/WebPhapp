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

    /*
    Search for all dispensers that have matching name substrings.
    Args:
        name: name substring to search for
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row contains:
            row.id (int)
            row.name (string)
            row.location (string)
            row.phone (int)
    */
    getDispensersByName: function(name, connection) {
        var q = `
        SELECT *
        FROM seniordesign1.dispensers
        WHERE name LIKE ?
        `;

        name = '%' + name + '%';
        return new Promise((resolve, reject) => {
            connection.query(q, name, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },
    
    /*
    Insert a user into the DB
    Args:
        username: Username to insert
        password: The salted and hashed password
        role: The type of user being inserted
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns the insertion ID of the row.
    */
    insertUser: function(username, password, role, role_id, connection) {
        var q = `
        INSERT INTO users (role, role_id, username, password)
        VALUES (?,?,?,?);
        SELECT LAST_INSERT_ID();
        `;

        return new Promise((resolve, reject) => {
            var values = [role.toString(), role_id, username, password];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get all dispensers.
    Args:
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row contains:
            row.id (int)
            row.name (string)
            row.location (string)
            row.phone (int)
    */
    getDispensers: function(connection) {
        var q = `
        SELECT *
        FROM seniordesign1.dispensers
        `;

        return new Promise((resolve, reject) => {
            connection.query(q, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get a single dispenser by ID.
    Args:
        dispenserID: ID to match on
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row (should only be one) contains:
            row.id (int)
            row.name (string)
            row.location (string)
            row.phone (int)
    */
    getDispenserByID: function(dispenserID, connection) {
        var q = `
        SELECT *
        FROM seniordesign1.dispensers
        WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            connection.query(q, dispenserID, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Insert the salt into the DB
    Args:
        userID: userID to insert
        salt: Salt value for the user
        connection: MySQL Connection object
    Returns: Promise.
        Nothing is inside of the promise.
    */
    insertSalt: function(userID, salt, connection){
        var q = `
        INSERT INTO salts
        VALUES (?,?);
        `;

        return new Promise((resolve, reject) => {
            var values = [userID,salt];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Search for all prescribers that have matching first and last name substrings.
    Args:
        first: first name substring to search for
        last: last name substring to search for
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row contains:
            row.id (int)
            row.name (string)
            row.location (string)
            row.phone (int)
    */
    getPrescribersByName: function(first, last, connection) {
        var q = `
        SELECT *
        FROM seniordesign1.prescribers
        WHERE
            first LIKE ?
            AND last LIKE ?
        `;

        if(first == undefined) first = '';
        first = '%' + first + '%';

        if(last == undefined) last = '';
        last = '%' + last + '%';

        return new Promise((resolve, reject) => {
            connection.query(q, [first, last], (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },
    
    /*
    Get the value of a salt, given the username
    Args:
        username: the username of the user
        connection: MySQL Connection object
    Returns: Promise
        Upon resolution the salt of a given user.
    */
    getSaltByUsername: function(username, connection){
        var q = `
        SELECT salt
        FROM salts s, users u
        WHERE s.id = u.id AND u.username = ?
        LIMIT 1;
        `;
        return new Promise((resolve, reject) => {
            var values = [username];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get a single prescriber by ID.
    Args:
        prescriberID: ID to match on
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row (should only be one) contains:
            row.id (int)
            row.first (string)
            row.last (string)
            row.location (string)
            row.phone (int)
    */
    getPrescriberByID: function(prescriberID, connection) {
        var q = `
        SELECT *
        FROM seniordesign1.prescribers
        WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            connection.query(q, prescriberID, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },
    
    /*
    Updates the count of the role index for the users
    Args:
        role: The type of user being addded to the system
        connection: MySQL Connection object
    Returns: Promise
        Upon resolution the Role id for the user. 
    */
    updateRoleCount: function(role, connection){
        var q = `
        UPDATE Role_Id_Count as R
        SET R.id_number = (R.id_number + 1)
        WHERE R.role = ?;

        SELECT id_number
        FROM Role_Id_Count
        WHERE role = ?;
        `;

        return new Promise((resolve, reject) => {
            var values = [role, role];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get all prescribers.
    Args:
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row contains:
            row.id (int)
            row.first (string)
            row.last (string)
            row.location (string)
            row.phone (int)
    */
    getPrescribers: function(connection) {
        var q = `
        SELECT *
        FROM seniordesign1.prescribers
        `;

        return new Promise((resolve, reject) => {
            connection.query(q, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get the username and password
    Args:
        username: the username of the user
        password: Password that has been salted and hashed
        connection: MySQL Connection object
    Returns: Promise
        Upon resolution the user with the username and password
    */
    getUserValidation: function(username, password, connection){
        var q = `
        SELECT role_id, role
        FROM users
        WHERE username = ? AND password = ?
        `;
        return new Promise((resolve, reject) => {
            var values = [username,password];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    // Index for fast lookups of prescriptionIDs given a patientID
    PrescriptionIDsByPatientIndex: {
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
                connection.query('TRUNCATE TABLE seniordesign1.patient_id_index;', (_) => {
                    connection.query(q, (error, rows, fields) => {
                        if (error) reject(error);
                        resolve({rows, fields});
                    });
                });
            });
        }
    }
}
