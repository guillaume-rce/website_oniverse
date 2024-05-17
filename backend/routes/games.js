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
 *         - logo
 *         - image
 *         - price
 *         - stock
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
 *         stock:
 *           type: integer
 *           description: Current stock quantity of the game
 *         url:
 *           type: string
 *           description: Official URL for the game
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *           description: List of tags associated with the game
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retrieve a list of games with their images, logos, and tags
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
            games.id, games.name, games.description, games.price, games.stock, games.url,
            mainImages.id AS image_id, mainImages.path AS image_path,
            mainImages.isLight AS image_isLight, mainImages.uploadDateTime AS image_uploadDateTime,
            logoImages.id AS logo_id, logoImages.path AS logo_path,
            logoImages.isLight AS logo_isLight, logoImages.uploadDateTime AS logo_uploadDateTime,
            tags.id AS tag_id, tags.name AS tag_name
        FROM games
        LEFT JOIN images AS mainImages ON games.image = mainImages.id
        LEFT JOIN images AS logoImages ON games.logo = logoImages.id
        LEFT JOIN tags_association ON games.id = tags_association.idGame
        LEFT JOIN tags ON tags_association.idTag = tags.id`;

    content.query(query, (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            const gamesMap = new Map();
            results.forEach(row => {
                if (!gamesMap.has(row.id)) {
                    gamesMap.set(row.id, {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        image: {
                            id: row.image_id,
                            path: row.image_path,
                            isLight: row.image_isLight,
                            uploadDateTime: row.image_uploadDateTime
                        },
                        logo: row.logo_id ? {
                            id: row.logo_id,
                            path: row.logo_path,
                            isLight: row.logo_isLight,
                            uploadDateTime: row.logo_uploadDateTime
                        } : null,
                        price: row.price,
                        stock: row.stock,
                        url: row.url,
                        tags: []
                    });
                }
                const game = gamesMap.get(row.id);
                if (row.tag_id) {
                    game.tags.push({
                        id: row.tag_id,
                        name: row.tag_name
                    });
                }
            });
            const formattedResults = Array.from(gamesMap.values());
            res.status(200).json(formattedResults);
        }
    });
});

/**
 * @swagger
 * /games:
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
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *     responses:
 *       201:
 *         description: Game successfully uploaded
 *       400:
 *         description: Bad request, possibly due to missing image or fields
 *       500:
 *         description: Server error during database operation
 */
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { name, description, price, tags } = req.body;
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
            const insertGameQuery = 'INSERT INTO games (name, description, price, image) VALUES (?, ?, ?, ?)';
            const [gameResult] = await content.promise().query(insertGameQuery, [name, description, price, imageId]);

            const gameId = gameResult.insertId;

            if (tags) {
                const tagList = tags.split(',').map(tag => tag.trim());
                for (const tagName of tagList) {
                    const [tagResult] = await content.promise().query('SELECT id FROM tags WHERE name = ?', [tagName]);
                    let tagId;
                    if (tagResult.length === 0) {
                        const [newTagResult] = await content.promise().query('INSERT INTO tags (name) VALUES (?)', [tagName]);
                        tagId = newTagResult.insertId;
                    } else {
                        tagId = tagResult[0].id;
                    }
                    await content.promise().query('INSERT INTO tags_association (idTag, idGame) VALUES (?, ?)', [tagId, gameId]);
                }
            }

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(201).json({ message: 'Game uploaded successfully.', gameId: gameId });
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
 *     summary: Retrieve a single game by ID including stock information
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
            games.id, games.name, games.description, games.price, games.url, games.stock,
            mainImages.id AS image_id, mainImages.path AS image_path,
            mainImages.isLight AS image_isLight, mainImages.uploadDateTime AS image_uploadDateTime,
            logoImages.id AS logo_id, logoImages.path AS logo_path,
            logoImages.isLight AS logo_isLight, logoImages.uploadDateTime AS logo_uploadDateTime,
            tags.id AS tag_id, tags.name AS tag_name
        FROM games
        LEFT JOIN images AS mainImages ON games.image = mainImages.id
        LEFT JOIN images AS logoImages ON games.logo = logoImages.id
        LEFT JOIN tags_association ON games.id = tags_association.idGame
        LEFT JOIN tags ON tags_association.idTag = tags.id
        WHERE games.id = ?`;

    content.query(query, [gameId], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Game not found.' });
        } else {
            const game = {
                id: results[0].id,
                name: results[0].name,
                description: results[0].description,
                image: {
                    id: results[0].image_id,
                    path: results[0].image_path,
                    isLight: results[0].image_isLight,
                    uploadDateTime: results[0].image_uploadDateTime
                },
                logo: results[0].logo_id ? {
                    id: results[0].logo_id,
                    path: results[0].logo_path,
                    isLight: results[0].logo_isLight,
                    uploadDateTime: results[0].logo_uploadDateTime
                } : null,
                price: results[0].price,
                url: results[0].url,
                stock: results[0].stock,
                tags: []
            };
            results.forEach(row => {
                if (row.tag_id) {
                    game.tags.push({
                        id: row.tag_id,
                        name: row.tag_name
                    });
                }
            });
            res.status(200).json(game);
        }
    });
});

/**
 * @swagger
 * /games/{id}/stock:
 *   put:
 *     summary: Update the stock for a specified game
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 description: New stock quantity
 *                 example: 50
 *     responses:
 *       200:
 *         description: Game stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game stock updated successfully.
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.put('/:id/stock', (req, res) => {
    const gameId = req.params.id;
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ error: 'Invalid stock value. Stock must be a non-negative integer.' });
    }

    const query = 'UPDATE games SET stock = ? WHERE id = ?';
    content.query(query, [stock, gameId], (error, result) => {
        if (error) {
            console.error('Error during UPDATE query:', error);
            res.status(500).json({ error: 'Server error during UPDATE query.' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Game not found.' });
            } else {
                res.status(200).json({ message: 'Game stock updated successfully.' });
            }
        }
    });
});

/**
 * @swagger
 * /games/{id}/price:
 *   put:
 *     summary: Update the price of a specific game
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 format: float
 *                 description: New price of the game
 *                 example: 59.99
 *     responses:
 *       200:
 *         description: Game price updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game price updated successfully.
 *       400:
 *         description: Invalid input, object invalid
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.put('/:id/price', (req, res) => {
    const gameId = req.params.id;
    const { price } = req.body;

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Invalid price. Price must be a positive number.' });
    }

    const query = 'UPDATE games SET price = ? WHERE id = ?';
    content.query(query, [price, gameId], (error, results) => {
        if (error) {
            console.error('Error during the UPDATE query:', error);
            res.status(500).json({ error: 'Server error during the UPDATE query.' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Game not found.' });
        } else {
            res.status(200).json({ message: 'Game price updated successfully.' });
        }
    });
});

/**
 * @swagger
 * /games/{id}/tags:
 *   post:
 *     summary: Associate tags with a specific game
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tags to associate with the game
 *     responses:
 *       200:
 *         description: Tags associated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/:id/tags', (req, res) => {
    const gameId = req.params.id;
    const { tags } = req.body;

    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
        return res.status(400).json({ error: 'Invalid tags. Tags must be an array of strings.' });
    }

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            for (const tagName of tags) {
                const [tagResult] = await content.promise().query('SELECT id, name FROM tags WHERE name = ?', [tagName]);
                let tagId;
                if (tagResult.length === 0) {
                    const [newTagResult] = await content.promise().query('INSERT INTO tags (name) VALUES (?)', [tagName]);
                    tagId = newTagResult.insertId;
                } else {
                    tagId = tagResult[0].id;
                }

                const [tagAssocResult] = await content.promise().query(
                    'SELECT * FROM tags_association WHERE idTag = ? AND idGame = ?', [tagId, gameId]
                );

                if (tagAssocResult.length === 0) {
                    await content.promise().query('INSERT INTO tags_association (idTag, idGame) VALUES (?, ?)', [tagId, gameId]);
                }
            }

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(200).json({ message: 'Tags associated successfully.' });
            });
        } catch (error) {
            content.rollback(() => {
                console.error('Error updating data:', error);
                res.status(500).json({ error: 'Server error updating data.' });
            });
        }
    });
});

module.exports = router;
