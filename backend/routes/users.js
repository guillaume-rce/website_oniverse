// routes/users.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const multer = require('multer');

// Setup for database
const internal = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_data',
});

// Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = './img';
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        callback(null, fileName);
    }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 *  tags:
 *   name: Users
 *   description: Manage users, get user information, update user information.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users excluding sensitive data
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
    // SQL query to select non-sensitive data
    const query = 'SELECT id, pseudo, image, banner, bio, role, registrationDateTime FROM users';

    internal.query(query, (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            // Map results to exclude any potentially sensitive fields that might be accidentally included
            const users = results.map(user => ({
                id: user.id,
                pseudo: user.pseudo,
                image: user.image,
                banner: user.banner,
                bio: user.bio,
                role: user.role,
                registrationDateTime: user.registrationDateTime
            }));
            res.status(200).json(users);
        }
    });
});

module.exports = router;
