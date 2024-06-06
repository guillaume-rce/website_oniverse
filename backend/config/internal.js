const mysql = require('mysql2');

const internal = mysql.createConnection({
    host: 'db',
    port: 3306,
    user: 'root',
    password: '8%sj9iAWtKL&c5ZyCQ78^9ET9LS8k27L',
    database: 'internal_data',
});
console.log('internal -- V1');
internal.connect((err) => {
    if (err) {
        console.log('Error connecting to internal database. ', err);
        throw new Error(err);
    }
    console.log('Connected to internal database');
});

module.exports = internal;