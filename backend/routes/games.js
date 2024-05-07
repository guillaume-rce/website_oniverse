// routes/games.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');

// Configuration de la base de données
const content = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'content',
});

// Configuration du stockage de fichiers
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
 * /games:
 *   get:
 *     summary: Retrieve a list of games
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The game ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the game
 *                     example: Chess
 *                   description:
 *                     type: string
 *                     description: The description of the game
 *                     example: A classic strategy board game
 *                   image:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The image ID
 *                         example: 1
 *                       path:
 *                         type: string
 *                         description: The path to the image
 *                         example: /img/1622483492-chess.jpg
 *                       isLight:
 *                         type: boolean
 *                         description: Indicates if the image is a light version
 *                         example: true
 *                       uploadDateTime:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the image was uploaded
 *                         example: 2024-05-07T10:00:00Z
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the game
 *                     example: 19.99
 *                   url:
 *                     type: string
 *                     description: The URL to the game
 *                     example: "http://example.com/chess"
 */
router.get('/', (req, res, next) => {
    const query = `
        SELECT 
            games.id, games.name, games.description, games.price, games.url,
            images.id AS image_id, images.path AS image_path, 
            images.isLight AS image_isLight, images.uploadDateTime AS image_uploadDateTime
        FROM games
        JOIN images ON games.image = images.id`;

    content.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur requête SELECT.' });
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
 *     summary: Retrieve a single game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the game
 *     responses:
 *       200:
 *         description: A single game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The game ID
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the game
 *                   example: Chess
 *                 description:
 *                   type: string
 *                   description: The description of the game
 *                   example: A classic strategy board game
 *                 image:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The image ID
 *                       example: 1
 *                     path:
 *                       type: string
 *                       description: The path to the image
 *                       example: /img/1622483492-chess.jpg
 *                     isLight:
 *                       type: boolean
 *                       description: Indicates if the image is a light version
 *                       example: true
 *                     uploadDateTime:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the image was uploaded
 *                       example: 2024-05-07T10:00:00Z
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: The price of the game
 *                   example: 19.99
 *                 url:
 *                   type: string
 *                   description: The URL to the game
 *                   example: "http://example.com/chess"
 *       404:
 *         description: Game not found
 */
router.get('/:id', (req, res, next) => {
    const gameId = req.params.id;
    const query = `
        SELECT games.*, images.id as image_id, images.path as image_path, 
               images.isLight as image_isLight, images.uploadDateTime as image_uploadDateTime
        FROM games
        LEFT JOIN images ON games.image = images.id
        WHERE games.id = ?`;

    content.query(query, [gameId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            if (results.length > 0) {
                const game = results[0];
                const formattedResult = {
                    id: game.id,
                    name: game.name,
                    description: game.description,
                    image: {
                        id: game.image_id,
                        path: game.image_path,
                        isLight: game.isLight,
                        uploadDateTime: game.image_uploadDateTime
                    },
                    price: game.price,
                    url: game.url
                };
                res.status(200).json(formattedResult);
            } else {
                res.status(404).json({ error: 'Aucun jeu trouvé avec cet ID.' });
            }
        }
    });
});

/**
 * @swagger
 * /games/upload:
 *   post:
 *     summary: Upload an image for a game
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file
 *               gameId:
 *                 type: integer
 *                 description: The ID of the game
 *                 example: 1
 *               isLight:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 description: Indicates if the image is a light version
 *                 example: "true"
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: The URL of the uploaded image
 *                   example: "http://localhost:3001/img/1622483492-chess.jpg"
 *                 imageId:
 *                   type: integer
 *                   description: The ID of the uploaded image
 *                   example: 1
 *       400:
 *         description: No file uploaded
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
    }

    const imageUrl = `http://localhost:3001/img/${req.file.filename}`;
    const gameId = req.body.gameId;
    const isLight = req.body.isLight === 'true' ? 1 : 0;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Erreur lors de l\'initialisation de la transaction :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de la transaction.' });
        }

        try {
            const insertImageQuery = 'INSERT INTO images (path, isLight) VALUES (?, ?)';
            const [imageResults] = await content.promise().query(insertImageQuery, [imageUrl, isLight]);

            const imageId = imageResults.insertId;
            const updateGameQuery = 'UPDATE games SET image = ? WHERE id = ?';
            await content.promise().query(updateGameQuery, [imageId, gameId]);

            content.commit((err) => {
                if (err) {
                    console.error('Erreur lors de la validation de la transaction :', err);
                    return res.status(500).json({ error: 'Erreur serveur lors de la validation de la transaction.' });
                }
                res.status(200).json({ imageUrl: imageUrl, imageId: imageId });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Erreur lors de la mise à jour des données :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des données.' });
            });
        }
    });
});

module.exports = router;
