const mysql = require('mysql2');

const content = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'content',
});

content.connect((err) => {
    if (err) {
        console.error('Error connecting to content database', err);
        return;
    }
    console.log('Connected to content database');
});

module.exports = content;

