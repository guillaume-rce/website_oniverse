const mysql = require('mysql2');

const internal = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_data',
});

internal.connect((err) => {
    if (err) {
        console.error('Error connecting to internal database', err);
        return;
    }
    console.log('Connected to internal database');
});

module.exports = internal;