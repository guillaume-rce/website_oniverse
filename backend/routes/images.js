// routes/images.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuration de la base de données
const content = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'content',
});

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Retrieve a list of images
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The image ID
 *                     example: 1
 *                   path:
 *                     type: string
 *                     description: The path to the image
 *                     example: /img/1622483492-chess.jpg
 *                   isLight:
 *                     type: boolean
 *                     description: Indicates if the image is a light version
 *                     example: true
 *                   uploadDateTime:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the image was uploaded
 *                     example: 2024-05-07T10:00:00Z
 */
router.get('/', (req, res, next) => {
    content.query('SELECT * FROM images', (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur requête SELECT.' });
        } else {
            res.status(200).json(results);
        }
    });
});

/**
 * @swagger
 * /images/{id}:
 *   get:
 *     summary: Retrieve a single image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the image
 *     responses:
 *       200:
 *         description: A single image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The image ID
 *                   example: 1
 *                 path:
 *                   type: string
 *                   description: The path to the image
 *                   example: /img/1622483492-chess.jpg
 *                 isLight:
 *                   type: boolean
 *                   description: Indicates if the image is a light version
 *                   example: true
 *                 uploadDateTime:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the image was uploaded
 *                   example: 2024-05-07T10:00:00Z
 *       404:
 *         description: Image not found
 */
router.get('/:id', (req, res, next) => {
    const imageId = req.params.id;
    content.query('SELECT * FROM images WHERE id = ?', [imageId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Aucune image trouvée avec cet ID.' });
            }
        }
    });
});

module.exports = router;
