// routes/user.js

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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - pseudo
 *         - email
 *         - password
 *         - role
 *         - registrationDateTime
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: The unique identifier for the user, automatically incremented.
 *         pseudo:
 *           type: string
 *           description: The nickname or username of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user, used for logging in and communication.
 *         password:
 *           type: string
 *           format: password
 *           description: The hashed password for the user's account.
 *         image:
 *           type: string
 *           nullable: true
 *           description: URL path to the user's profile image, can be null.
 *         banner:
 *           type: string
 *           nullable: true
 *           description: URL path to the user's banner image, can be null.
 *         bio:
 *           type: string
 *           format: textarea
 *           nullable: true
 *           description: A longer description or biography of the user, can be null.
 *         role:
 *           type: integer
 *           description: Numeric role identifier, where different numbers correspond to different roles within the system.
 *         registrationDateTime:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was registered.
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all users or filter users based on parameters
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter users by email address
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: A list of users, filtered by the specified parameters if any
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
    let query = 'SELECT * FROM users';
    const filterParams = [];
    const conditions = [];

    if (req.query.email) {
        conditions.push('email = ?');
        filterParams.push(req.query.email);
    }

    if (req.query.role) {
        conditions.push('role = ?');
        filterParams.push(req.query.role);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    internal.query(query, filterParams, (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            res.status(200).json(results);
        }
    });
});

/**
 * @swagger
 * /user/pseudo:
 *   post:
 *     summary: Update the user's pseudo
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: userid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *                 example: newpseudo
 *     responses:
 *       200:
 *         description: Pseudo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pseudo mis à jour avec succès.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error during pseudo update
 */
router.post('/pseudo', (req, res, next) => {
    const userId = req.headers.userid;
    const token = req.headers.token;
    const pseudo = req.body.pseudo;

    jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decodedToken) => {
        if (err || decodedToken.userId !== parseInt(userId)) {
            return res.status(401).json({ error: 'Requête non autorisée.' });
        }

        const query = 'UPDATE users SET pseudo = ? WHERE id = ?';
        internal.query(query, [pseudo, userId], (error) => {
            if (error) {
                console.error('Erreur lors de la mise à jour du pseudo :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du pseudo.' });
            } else {
                res.status(200).json({ message: 'Pseudo mis à jour avec succès.' });
            }
        });
    });
});

/**
 * @swagger
 * /user/bio:
 *   post:
 *     summary: Update the user's bio
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: userid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: This is my bio
 *     responses:
 *       200:
 *         description: Bio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bio mise à jour avec succès.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error during bio update
 */
router.post('/bio', (req, res, next) => {
    const userId = req.headers.userid;
    const token = req.headers.token;
    const bio = req.body.bio;

    jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decodedToken) => {
        if (err || decodedToken.userId !== parseInt(userId)) {
            return res.status(401).json({ error: 'Requête non autorisée.' });
        }

        const query = 'UPDATE users SET bio = ? WHERE id = ?';
        internal.query(query, [bio, userId], (error) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de la bio :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la bio.' });
            } else {
                res.status(200).json({ message: 'Bio mise à jour avec succès.' });
            }
        });
    });
});

/**
 * @swagger
 * /user/image/{type}:
 *   post:
 *     summary: Upload an image for the user's profile or banner
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum: [profile, banner]
 *         required: true
 *         description: The type of image (profile or banner)
 *       - in: header
 *         name: userid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileImage:
 *                   type: string
 *                   example: "http://localhost:3001/img/1622483492-profile.jpg"
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error during image upload
 */
router.post('/image/:type', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
    }

    const type = req.params.type;
    if (type !== 'profile' && type !== 'banner') {
        return res.status(400).json({ error: 'Type de fichier non pris en charge.' });
    }
    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;
    const userId = req.headers.userid;
    const token = req.headers.token;

    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
        if (err || decodedToken.userId !== parseInt(userId)) {
            return res.status(401).json({ error: 'Requête non autorisée.' });
        }

        const profileImageQuery = 'UPDATE users SET image = ? WHERE id = ?';
        const bannerImageQuery = 'UPDATE users SET banner = ? WHERE id = ?';
        const query = type === 'profile' ? profileImageQuery : bannerImageQuery;
        internal.query(query, [imageUrl, userId], (error) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de l\'image de profil :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'image de profil.' });
            } else {
                res.status(200).json({ profileImage: imageUrl });
            }
        });
    });
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', (req, res, next) => {
    const userId = req.params.id;
    internal.query('SELECT id, pseudo, email, banner, image, bio, role, registrationDateTime FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la recherche de l\'utilisateur.' });
        } else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet ID.' });
            }
        }
    });
});

/**
 * @swagger
 * /user/{id}/games:
 *   get:
 *     summary: Retrieve all unique games ordered by a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to retrieve ordered games for
 *     responses:
 *       200:
 *         description: List of unique games ordered by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       404:
 *         description: No games found for this user
 *       500:
 *         description: Server error
 */
router.get('/:id/games', (req, res) => {
    const userId = req.params.id;
    const query = `
        SELECT DISTINCT games.id, games.name, games.description, games.price, games.url, 
               mainImages.path AS image_path, mainImages.isLight AS image_isLight, 
               mainImages.uploadDateTime AS image_uploadDateTime,
               logoImages.path AS logo_path, logoImages.isLight AS logo_isLight, 
               logoImages.uploadDateTime AS logo_uploadDateTime
        FROM internal_data.order_item
        JOIN internal_data.order ON order_item.order_id = order.id
        JOIN content.games ON order_item.item_id = games.id
        LEFT JOIN content.images AS mainImages ON games.image = mainImages.id
        LEFT JOIN content.images AS logoImages ON games.logo = logoImages.id
        WHERE order.user = ?;
    `;

    internal.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'No games found for this user.' });
        } else {
            const formattedResults = results.map(game => ({
                id: game.id,
                name: game.name,
                description: game.description,
                image: {
                    path: game.image_path,
                    isLight: game.image_isLight,
                    uploadDateTime: game.image_uploadDateTime
                },
                logo: {
                    path: game.logo_path,
                    isLight: game.logo_isLight,
                    uploadDateTime: game.logo_uploadDateTime
                },
                price: game.price,
                url: game.url
            }));
            res.status(200).json(formattedResults);
        }
    });
});

module.exports = router;
