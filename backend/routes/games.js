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
 *   description: Game management and retrieval
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
 *         - description
 *         - price
 *         - url
 *         - logo
 *         - image
 *       properties:
 *         id:
 *           type: integer
 *           description: The game ID
 *         name:
 *           type: string
 *           description: The name of the game
 *         description:
 *           type: string
 *           description: The description of the game
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the game
 *         url:
 *           type: string
 *           description: The URL to access the game
 *         logo:
 *           type: boolean
 *           description: Flag to indicate if the game image is used as a logo
 *         image:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The image ID
 *             path:
 *               type: string
 *               description: The path to the image file
 *             isLight:
 *               type: boolean
 *               description: Indicates if the image is a light version
 *             uploadDateTime:
 *               type: string
 *               format: date-time
 *               description: The date and time the image was uploaded
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retrieve a list of games with their associated images
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
            games.id, games.name, games.description, games.price, games.url, games.logo,
            images.id AS image_id, images.path AS image_path, 
            images.isLight AS image_isLight, images.uploadDateTime AS image_uploadDateTime
        FROM games
        JOIN images ON games.image = images.id`;

    content.query(query, (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            const formattedResults = results.map(game => ({
                id: game.id,
                name: game.name,
                description: game.description,
                logo: game.logo,
                image: {
                    id: game.image_id,
                    path: game.image_path,
                    isLight: game.isLight,
                    uploadDateTime: game.uploadDateTime
                },
                price: game.price,
                url: game.url
            }));
            res.status(200).json(formattedResults);
        }
    });
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Retrieve a single game by ID including its image
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 */
router.get('/:id', (req, res) => {
    const gameId = req.params.id;
    const query = `
        SELECT games.*, images.id as image_id, images.path as image_path, 
               images.isLight as image_isLight, images.uploadDateTime as image_uploadDateTime
        FROM games
        LEFT JOIN images ON games.image = images.id
        WHERE games.id = ?`;

    content.query(query, [gameId], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            if (results.length > 0) {
                const game = results[0];
                const formattedResult = {
                    id: game.id,
                    name: game.name,
                    description: game.description,
                    logo: game.logo,
                    image: {
                        id: game.image_id,
                        path: game.image_path,
                        isLight: game.isLight,
                        uploadDateTime: game.uploadDateTime
                    },
                    price: game.price,
                    url: game.url
                };
                res.status(200).json(formattedResult);
            } else {
                res.status(404).json({ error: 'No game found with this ID.' });
            }
        }
    });
});

/**
 * @swagger
 * /games/upload:
 *   post:
 *     summary: Upload a new game with its main image
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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
 *                 description: URL to access the game
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Main image of the game
 *               isLogo:
 *                 type: boolean
 *                 description: Flag to indicate if the image is also used as a logo
 *     responses:
 *       200:
 *         description: Game successfully uploaded
 *       400:
 *         description: Validation error (e.g., no file uploaded)
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { name, description, price, url, isLogo } = req.body;
    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;
    const logo = isLogo === 'true' ? 1 : 0;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Error during transaction initialization:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            const insertImageQuery = 'INSERT INTO images (path, isLight) VALUES (?, ?)';
            const [imageResults] = await content.promise().query(insertImageQuery, [imageUrl, logo]);

            const imageId = imageResults.insertId;
            const insertGameQuery = 'INSERT INTO games (name, description, price, url, image, logo) VALUES (?, ?, ?, ?, ?, ?)';
            await content.promise().query(insertGameQuery, [name, description, parseFloat(price), url, imageId, logo]);

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(200).json({ message: 'Game successfully uploaded.', imageUrl, gameId: imageId });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Error during data update:', error);
                res.status(500).json({ error: 'Server error during data update.' });
            });
        }
    });
});

/**
 * @swagger
 * /games/{id}/update-image:
 *   patch:
 *     summary: Update the main image of a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Game image updated successfully
 *       400:
 *         description: Validation error (e.g., no file uploaded)
 */
router.patch('/:id/update-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const gameId = req.params.id;
    const newImageUrl = `http://localhost:3001/img/${req.file.filename}`;

    try {
        const updateImageQuery = 'UPDATE images JOIN games ON games.image = images.id SET images.path = ? WHERE games.id = ?';
        await content.promise().query(updateImageQuery, [newImageUrl, gameId]);
        res.status(200).json({ message: 'Game image updated successfully.', newImageUrl });
    } catch (error) {
        console.error('Error updating game image:', error);
        res.status(500).json({ error: 'Failed to update game image.' });
    }
});

/**
 * @swagger
 * /games/{id}/update-logo:
 *   patch:
 *     summary: Update the logo flag of a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: boolean
 *                 description: New logo flag state
 *     responses:
 *       200:
 *         description: Game logo updated successfully
 *       500:
 *         description: Server error
 */
router.patch('/:id/update-logo', async (req, res) => {
    const gameId = req.params.id;
    const { logo } = req.body; // Assume logo is a boolean sent as 'true' or 'false'

    try {
        const updateLogoQuery = 'UPDATE games SET logo = ? WHERE id = ?';
        await content.promise().query(updateLogoQuery, [logo === 'true' ? 1 : 0, gameId]);
        res.status(200).json({ message: 'Game logo updated successfully.' });
    } catch (error) {
        console.error('Error updating game logo:', error);
        res.status(500).json({ error: 'Failed to update game logo.' });
    }
});

module.exports = router;
