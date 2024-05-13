// routes/games.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');

// Database configuration
const content = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'content',
});

// File storage configuration
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
 * tags:
 *   name: Games
 *   description: API to manage game inventory, including images and logos.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - image
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the game
 *         name:
 *           type: string
 *           description: Name of the game
 *         description:
 *           type: string
 *           description: Detailed description of the game
 *         image:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Image identifier
 *             path:
 *               type: string
 *               description: URL path to the image
 *             isLight:
 *               type: boolean
 *               description: Flag indicating if the image is a light version
 *             uploadDateTime:
 *               type: string
 *               format: date-time
 *               description: Timestamp of when the image was uploaded
 *         logo:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Logo identifier
 *             path:
 *               type: string
 *               description: URL path to the logo
 *             isLight:
 *               type: boolean
 *               description: Flag indicating if the logo is a light version
 *             uploadDateTime:
 *               type: string
 *               format: date-time
 *               description: Timestamp of when the logo was uploaded
 *         price:
 *           type: number
 *           format: float
 *           description: Selling price of the game
 *         url:
 *           type: string
 *           description: Official URL for the game
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retrieve a list of games with their images and logos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
    const query = `
        SELECT 
            games.id, games.name, games.description, games.price, games.url,
            mainImages.id AS image_id, mainImages.path AS image_path,
            mainImages.isLight AS image_isLight, mainImages.uploadDateTime AS image_uploadDateTime,
            logoImages.id AS logo_id, logoImages.path AS logo_path,
            logoImages.isLight AS logo_isLight, logoImages.uploadDateTime AS logo_uploadDateTime
        FROM games
        LEFT JOIN images AS mainImages ON games.image = mainImages.id
        LEFT JOIN images AS logoImages ON games.logo = logoImages.id`;

    content.query(query, (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            const formattedResults = results.map(game => ({
                id: game.id,
                name: game.name,
                description: game.description,
                image: {
                    id: game.image_id,
                    path: game.image_path,
                    isLight: game.image_isLight,
                    uploadDateTime: game.image_uploadDateTime
                },
                logo: game.logo_id ? {
                    id: game.logo_id,
                    path: game.logo_path,
                    isLight: game.logo_isLight,
                    uploadDateTime: game.logo_uploadDateTime
                } : null,
                price: game.price,
                url: game.url
            }));
            res.status(200).json(formattedResults);
        }
    });
});

/**
 * @swagger
 * /games/upload:
 *   post:
 *     summary: Upload a new game and its main image
 *     tags: [Games]
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
 *                 description: Main image for the game
 *               name:
 *                 type: string
 *                 description: Name of the game
 *               description:
 *                 type: string
 *                 description: Description of the game
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the game
 *               url:
 *                 type: string
 *                 description: Official URL for the game
 *     responses:
 *       201:
 *         description: Game successfully uploaded
 *       400:
 *         description: Bad request, possibly due to missing image or fields
 *       500:
 *         description: Server error during database operation
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { name, description, price, url } = req.body;
    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            const insertImageQuery = 'INSERT INTO images (path, isLight) VALUES (?, ?)';
            const [imageResult] = await content.promise().query(insertImageQuery, [imageUrl, 0]);

            const imageId = imageResult.insertId;
            const insertGameQuery = 'INSERT INTO games (name, description, price, url, image) VALUES (?, ?, ?, ?, ?)';
            await content.promise().query(insertGameQuery, [name, description, price, url, imageId]);

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(201).json({ message: 'Game uploaded successfully.', gameId: imageId });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Error updating data:', error);
                res.status(500).json({ error: 'Server error updating data.' });
            });
        }
    });
});

/**
 * @swagger
 * /games/update-image/{id}:
 *   put:
 *     summary: Update the main image of a specified game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the game to update
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
 *                 description: New main image for the game
 *     responses:
 *       200:
 *         description: Main image updated successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error during database operation
 */
router.put('/update-image/:id', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const gameId = req.params.id;
    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            const insertImageQuery = 'INSERT INTO images (path, isLight) VALUES (?, ?)';
            const [imageResult] = await content.promise().query(insertImageQuery, [imageUrl, 0]);

            const imageId = imageResult.insertId;
            const updateGameQuery = 'UPDATE games SET image = ? WHERE id = ?';
            await content.promise().query(updateGameQuery, [imageId, gameId]);

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(200).json({ message: 'Game image updated successfully.', imageUrl: imageUrl });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Error updating data:', error);
                res.status(500).json({ error: 'Server error updating data.' });
            });
        }
    });
});

/**
 * @swagger
 * /games/update-logo/{id}:
 *   put:
 *     summary: Update the logo of a specified game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the game to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: New logo for the game
 *     responses:
 *       200:
 *         description: Game logo updated successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error during database operation
 */
router.put('/update-logo/:id', upload.single('logo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const gameId = req.params.id;
    const logoUrl = `http://localhost:3001/img/${req.file.filename}`;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            const insertLogoQuery = 'INSERT INTO images (path, isLight) VALUES (?, ?)';
            const [logoResult] = await content.promise().query(insertLogoQuery, [logoUrl, 0]);

            const logoId = logoResult.insertId;
            const updateGameQuery = 'UPDATE games SET logo = ? WHERE id = ?';
            await content.promise().query(updateGameQuery, [logoId, gameId]);

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(200).json({ message: 'Game logo updated successfully.', logoUrl: logoUrl });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Error updating data:', error);
                res.status(500).json({ error: 'Server error updating data.' });
            });
        }
    });
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Retrieve a single game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the game to retrieve
 *     responses:
 *       200:
 *         description: Detailed information about the game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.get('/:id', (req, res) => {
    const gameId = req.params.id;
    const query = `
        SELECT 
            games.id, games.name, games.description, games.price, games.url,
            mainImages.id AS image_id, mainImages.path AS image_path,
            mainImages.isLight AS image_isLight, mainImages.uploadDateTime AS image_uploadDateTime,
            logoImages.id AS logo_id, logoImages.path AS logo_path,
            logoImages.isLight AS logo_isLight, logoImages.uploadDateTime AS logo_uploadDateTime
        FROM games
        LEFT JOIN images AS mainImages ON games.image = mainImages.id
        LEFT JOIN images AS logoImages ON games.logo = logoImages.id
        WHERE games.id = ?;
    `;

    content.query(query, [gameId], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Game not found.' });
        } else {
            const game = results[0];
            const formattedGame = {
                id: game.id,
                name: game.name,
                description: game.description,
                image: {
                    id: game.image_id,
                    path: game.image_path,
                    isLight: game.isLight,
                    uploadDateTime: game.uploadDateTime
                },
                logo: game.logo_id ? {
                    id: game.logo_id,
                    path: game.logo_path,
                    isLight: game.logo_isLight,
                    uploadDateTime: game.logo_uploadDateTime
                } : null,
                price: game.price,
                url: game.url
            };
            res.status(200).json(formattedGame);
        }
    });
});

module.exports = router;
