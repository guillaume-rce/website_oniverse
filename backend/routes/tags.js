const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Database configuration
const content = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'content',
});

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: API to manage tags
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the tag
 *         name:
 *           type: string
 *           description: Name of the tag
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Retrieve a list of tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
    const query = 'SELECT id, name FROM tags';
    content.query(query, (error, results) => {
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
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the tag
 *     responses:
 *       201:
 *         description: Tag successfully created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input. Name is required and must be a string.' });
    }

    const query = 'INSERT INTO tags (name) VALUES (?)';
    content.query(query, [name], (error, results) => {
        if (error) {
            console.error('Error during INSERT query:', error);
            res.status(500).json({ error: 'Server error during INSERT query.' });
        } else {
            res.status(201).json({ message: 'Tag successfully created.', id: results.insertId });
        }
    });
});

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Update a tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the tag to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the tag
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.put('/:id', (req, res) => {
    const tagId = req.params.id;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input. Name is required and must be a string.' });
    }

    const query = 'UPDATE tags SET name = ? WHERE id = ?';
    content.query(query, [name, tagId], (error, results) => {
        if (error) {
            console.error('Error during UPDATE query:', error);
            res.status(500).json({ error: 'Server error during UPDATE query.' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Tag not found.' });
        } else {
            res.status(200).json({ message: 'Tag updated successfully.' });
        }
    });
});

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag and its associations
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', (req, res) => {
    const tagId = req.params.id;

    content.beginTransaction(async (err) => {
        if (err) {
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            const deleteAssociationsQuery = 'DELETE FROM tags_association WHERE idTag = ?';
            await content.promise().query(deleteAssociationsQuery, [tagId]);

            const deleteTagQuery = 'DELETE FROM tags WHERE id = ?';
            const [results] = await content.promise().query(deleteTagQuery, [tagId]);

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Tag not found.' });
            }

            content.commit((err) => {
                if (err) {
                    console.error('Error during transaction commit:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(200).json({ message: 'Tag deleted successfully.' });
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
