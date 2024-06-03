const express = require('express');
const router = express.Router();
const internal = require('../config/internal');

/**
 * @swagger
 * components:
 *   schemas:
 *     DiscountCode:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - value
 *         - usable
 *         - public
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the discount code, automatically incremented.
 *         name:
 *           type: string
 *           description: Name of the discount code.
 *         value:
 *           type: integer
 *           description: The discount value associated with the code.
 *         usable:
 *           type: boolean
 *           description: Indicates if the discount code is usable.
 *         public:
 *           type: boolean
 *           description: Indicates if the discount code is public.
 */

/**
 * @swagger
 * /discount-codes:
 *   get:
 *     summary: Retrieve a list of all discount codes
 *     tags: [DiscountCode]
 *     responses:
 *       200:
 *         description: An array of discount codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountCode'
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
    internal.query('SELECT * FROM discount_code', (error, results) => {
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
 * /discount-codes:
 *   post:
 *     summary: Create a new discount code
 *     tags: [DiscountCode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountCode'
 *     responses:
 *       201:
 *         description: Discount code created successfully
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => {
    const { name, value, usable, public } = req.body;
    const insertQuery = 'INSERT INTO discount_code (name, value, usable, public) VALUES (?, ?, ?, ?)';
    internal.query(insertQuery, [name, value, usable, public], (error, results) => {
        if (error) {
            console.error('Error during INSERT query:', error);
            res.status(500).json({ error: 'Server error during INSERT query.' });
        } else {
            res.status(201).json({ message: 'Discount code created successfully.', id: results.insertId });
        }
    });
});

/**
 * @swagger
 * /discount-codes/public:
 *   get:
 *     summary: Retrieve all public discount codes
 *     tags: [DiscountCode]
 *     responses:
 *       200:
 *         description: A list of all public discount codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountCode'
 *       500:
 *         description: Server error occurred while fetching public discount codes.
 */
router.get('/public', (req, res) => {
    internal.query('SELECT * FROM discount_code WHERE public = true', (error, results) => {
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
 * /discount-codes/name/{name}:
 *   get:
 *     summary: Retrieve discount code details by name
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           description: The name of the discount code to retrieve details for.
 *     responses:
 *       200:
 *         description: Details of the discount code.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCode'
 *       404:
 *         description: Discount code not found
 *       500:
 *         description: Server error
 */
router.get('/name/:name', (req, res) => {
    const name = req.params.name;
    internal.query('SELECT * FROM discount_code WHERE name = ?', [name], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else if (results.length > 0) {
            res.status(200).json(results[0]);  // Assuming name is unique and returning the first result
        } else {
            res.status(404).json({ error: 'Discount code not found.' });
        }
    });
});

/**
 * @swagger
 * /discount-codes/{id}/used:
 *   get:
 *     summary: Check if the discount code has been used
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the discount code to check.
 *     responses:
 *       200:
 *         description: Returns whether the discount code has been used.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 used:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Discount code not found
 *       500:
 *         description: Server error
 */
router.get('/:id/used', (req, res) => {
    const id = req.params.id;
    internal.query('SELECT 1 FROM `order` WHERE discountCode = ?', [id], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else {
            const used = results.length > 0;
            res.status(200).json({ used: used, message: used ? 'Discount code has been used.' : 'Discount code has not been used.' });
        }
    });
});

/**
 * @swagger
 * /discount-codes/{id}/public:
 *   put:
 *     summary: Update the public status of a discount code
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the discount code to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public:
 *                 type: boolean
 *                 description: New public status of the discount code.
 *     responses:
 *       200:
 *         description: Public status updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Discount code not found.
 *       500:
 *         description: Server error during updating discount code.
 */
router.put('/:id/public', (req, res) => {
    const { public } = req.body;
    const id = req.params.id;
    const updateQuery = 'UPDATE discount_code SET public = ? WHERE id = ?';
    internal.query(updateQuery, [public, id], (error, result) => {
        if (error) {
            console.error('Error during the UPDATE query:', error);
            res.status(500).json({ error: 'Server error during the UPDATE query.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Discount code not found.' });
        } else {
            res.status(200).json({ message: 'Public status updated successfully.' });
        }
    });
});

/**
 * @swagger
 * /discount-codes/{id}/usable:
 *   put:
 *     summary: Update the usability status of a discount code
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the discount code to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usable:
 *                 type: boolean
 *                 description: New usability status of the discount code.
 *     responses:
 *       200:
 *         description: Usability status updated successfully.
 *       404:
 *         description: Discount code not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id/usable', (req, res) => {
    const id = req.params.id;
    const { usable } = req.body;
    internal.query('UPDATE discount_code SET usable = ? WHERE id = ?', [usable, id], (error, result) => {
        if (error) {
            console.error('Error during UPDATE query:', error);
            res.status(500).json({ error: 'Server error during UPDATE query.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Discount code not found.' });
        } else {
            res.status(200).json({ message: 'Usability status updated successfully.' });
        }
    });
});

/**
 * @swagger
 * /discount-codes/{id}:
 *   get:
 *     summary: Retrieve a discount code by ID
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the discount code to retrieve.
 *     responses:
 *       200:
 *         description: Details of the discount code.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountCode'
 *       404:
 *         description: Discount code not found
 *       500:
 *         description: Server error
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    internal.query('SELECT * FROM discount_code WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            res.status(500).json({ error: 'Server error during SELECT query.' });
        } else if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Discount code not found.' });
        }
    });
});

/**
 * @swagger
 * /discount-codes/{id}:
 *   delete:
 *     summary: Delete a discount code by ID, if it has not been used
 *     tags: [DiscountCode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the discount code to delete.
 *     responses:
 *       200:
 *         description: Discount code deleted successfully
 *       400:
 *         description: Cannot delete a discount code that has been used.
 *       404:
 *         description: Discount code not found
 *       500:
 *         description: Server error during discount code deletion
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    internal.query('SELECT 1 FROM `order` WHERE discountCode = ?', [id], async (error, results) => {
        if (error) {
            console.error('Error during SELECT query:', error);
            return res.status(500).json({ error: 'Server error during SELECT query.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Cannot delete a discount code that has been used.' });
        } else {
            internal.query('DELETE FROM discount_code WHERE id = ?', [id], (deleteError, deleteResult) => {
                if (deleteError) {
                    console.error('Error during DELETE query:', deleteError);
                    return res.status(500).json({ error: 'Server error during DELETE query.' });
                } else if (deleteResult.affectedRows === 0) {
                    return res.status(404).json({ message: 'Discount code not found.' });
                } else {
                    return res.status(200).json({ message: 'Discount code deleted successfully.' });
                }
            });
        }
    });
});

module.exports = router;