const mysql = require('mysql2');

const content = mysql.createConnection({
    host: 'db',
    user: 'root',
    port: 3306,
    password: '8%sj9iAWtKL&c5ZyCQ78^9ET9LS8k27L',
    database: 'content',
});
console.log('content -- V1');
content.connect((err) => {
    if (err) {
        console.log('Error connecting to content database. ', err);
        throw new Error(err);
    }
    console.log('Connected to content database');
});

module.exports = content;

