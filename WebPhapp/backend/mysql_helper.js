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
    }
}
