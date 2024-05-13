// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

// Setup for database
const internal = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internal_data',
});

/**
 * @swagger
 *  tags:
 *   name: Authentification
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               pseudo:
 *                 type: string
 *                 example: username
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès.
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error during user creation
 */
router.post('/signup', (req, res, next) => {
    const { email, password, pseudo } = req.body;
    if (email && password && pseudo) {
        bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) {
                console.error('Erreur lors du hachage du mot de passe :', hashError);
                res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur.' });
            } else {
                const query = 'INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)';
                const values = [pseudo, email, hashedPassword || null];
                internal.query(query, values, (error, results) => {
                    if (error) {
                        console.error('Erreur lors de l\'insertion de l\'utilisateur dans la base de données :', error);
                        res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur.' });
                    } else {
                        const userId = results.insertId;
                        res.status(201).json({
                            message: 'Utilisateur créé avec succès.',
                            userId: userId
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).json({ error: 'Email, mot de passe et pseudo sont requis pour l\'inscription.' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Incorrect credentials
 *       500:
 *         description: Server error during authentication
 */
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    internal.query('SELECT id, password FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', error);
            res.status(500).json({ error: 'Erreur serveur lors de l\'authentification.' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                const hashedPasswordFromDB = user.password;
                bcrypt.compare(password, hashedPasswordFromDB, (compareError, match) => {
                    if (compareError) {
                        console.error('Erreur lors de la comparaison des mots de passe :', compareError);
                        res.status(500).json({ error: 'Erreur serveur lors de l\'authentification.' });
                    } else if (match) {
                        const userId = user.id;
                        const token = jwt.sign({ userId }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                        res.status(200).json({ userId: userId, token: token });
                    } else {
                        res.status(401).json({ error: 'Identifiants incorrects.' });
                    }
                });
            } else {
                res.status(401).json({ error: 'Identifiants incorrects.' });
            }
        }
    });
});

module.exports = router;
