// routes/delivery.js

const express = require('express');
const router = express.Router();
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
 *      name: Delivery
 *      description: Gestion des méthodes de livraison
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - cost
 *         - available
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the delivery method.
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the delivery method.
 *           example: Standard Delivery
 *         cost:
 *           type: number
 *           format: float
 *           description: The cost associated with the delivery method.
 *           example: 5.00
 *         available:
 *           type: boolean
 *           description: Indicates whether the delivery method is available.
 *           example: true
 */

/**
 * @swagger
 * /delivery:
 *   get:
 *     summary: Retrieve a list of delivery methods
 *     tags: [Delivery]
 *     responses:
 *       200:
 *         description: A list of delivery methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Delivery'
 */
router.get('/', (req, res) => {
    internal.query('SELECT * FROM delivery_method', (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            res.status(200).json(results);
        }
    });
});

/**
 * @swagger
 * /delivery:
 *   post:
 *     summary: Create a new delivery method
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cost
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the delivery method.
 *                 example: Express Shipping
 *               cost:
 *                 type: number
 *                 format: float
 *                 description: The cost associated with the delivery method.
 *                 example: 15.00
 *               available:
 *                 type: boolean
 *                 description: Indicates whether the delivery method is available.
 *                 example: false
 *     responses:
 *       201:
 *         description: Delivery method created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delivery method created successfully.
 *       400:
 *         description: Bad request, possibly due to missing required fields or invalid data format.
 *       500:
 *         description: Server error during the creation process
 */
router.post('/', (req, res) => {
    const { name, cost, available = false } = req.body;

    if (!name || cost === undefined) {
        return res.status(400).json({ error: 'Name and cost are required. Cost must be a number.' });
    }

    const query = 'INSERT INTO delivery_method (name, cost, available) VALUES (?, ?, ?)';
    internal.query(query, [name, parseFloat(cost), available], (error, results) => {
        if (error) {
            console.error('Error during INSERT query:', error);
            res.status(500).json({ error: 'Server error during the INSERT query.' });
        } else {
            res.status(201).json({ message: 'Delivery method created successfully.', methodId: results.insertId });
        }
    });
});

/**
 * @swagger
 * /delivery/{id}:
 *   get:
 *     summary: Retrieve a single delivery method by ID
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the delivery method
 *     responses:
 *       200:
 *         description: A single delivery method
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery method not found
 */
router.get('/:id', (req, res) => {
    const deliveryId = req.params.id;

    internal.query('SELECT * FROM delivery_method WHERE id = ?', [deliveryId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Aucune méthode de livraison trouvée avec cet ID.' });
            }
        }
    });
});

/**
 * @swagger
 * /delivery/{id}:
 *   delete:
 *     summary: Delete a delivery method by ID, ensuring it has not been used in any orders
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the delivery method to delete
 *     responses:
 *       200:
 *         description: Delivery method deleted successfully
 *       400:
 *         description: Delivery method cannot be deleted because it has been used in orders
 *       404:
 *         description: Delivery method not found
 *       500:
 *         description: Server error during the deletion process
 */
router.delete('/:id', async (req, res) => {
    const deliveryId = req.params.id;

    try {
        const [methodExists] = await internal.promise().query('SELECT 1 FROM delivery_method WHERE id = ?', [deliveryId]);
        if (methodExists.length === 0) {
            return res.status(404).json({ error: 'Delivery method not found.' });
        }

        const [used] = await internal.promise().query('SELECT 1 FROM `order` WHERE deliveryMethod = ? LIMIT 1', [deliveryId]);
        if (used.length > 0) {
            return res.status(400).json({ error: 'Delivery method cannot be deleted because it has been used in orders.' });
        }

        await internal.promise().query('DELETE FROM delivery_method WHERE id = ?', [deliveryId]);
        res.status(200).json({ message: 'Delivery method deleted successfully.' });
    } catch (error) {
        console.error('Error during the deletion process:', error);
        res.status(500).json({ error: 'Server error during the deletion process.' });
    }
});

/**
 * @swagger
 * /delivery/{id}/available:
 *   put:
 *     summary: Update the availability of a specific delivery method
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the delivery method to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *                 description: New availability status of the delivery method
 *                 example: true
 *     responses:
 *       200:
 *         description: Delivery method availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delivery method availability updated successfully.
 *       400:
 *         description: Invalid input, object invalid
 *       404:
 *         description: Delivery method not found
 *       500:
 *         description: Server error during the update process
 */
router.put('/:id/available', (req, res) => {
    const deliveryId = req.params.id;
    const { available } = req.body;

    if (typeof available !== 'boolean') {
        return res.status(400).json({ error: 'Invalid input. Available must be a boolean.' });
    }

    const query = 'UPDATE delivery_method SET available = ? WHERE id = ?';
    internal.query(query, [available, deliveryId], (error, results) => {
        if (error) {
            console.error('Error during the UPDATE query:', error);
            res.status(500).json({ error: 'Server error during the UPDATE query.' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Delivery method not found.' });
        } else {
            res.status(200).json({ message: 'Delivery method availability updated successfully.' });
        }
    });
});

/**
 * @swagger
 * /delivery/{id}/used:
 *   get:
 *     summary: Check if a delivery method has been used in any orders
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the delivery method to check
 *     responses:
 *       200:
 *         description: Indicates whether the delivery method has been used
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
 *         description: Delivery method not found
 *       500:
 *         description: Server error
 */
router.get('/:id/used', async (req, res) => {
    const deliveryId = req.params.id;

    try {
        const [methodExists] = await internal.promise().query('SELECT 1 FROM delivery_method WHERE id = ?', [deliveryId]);
        if (methodExists.length === 0) {
            return res.status(404).json({ error: 'Delivery method not found.' });
        }

        const [used] = await internal.promise().query('SELECT 1 FROM `order` WHERE deliveryMethod = ? LIMIT 1', [deliveryId]);
        if (used.length > 0) {
            res.status(200).json({ used: true, message: "This delivery method has been used in orders." });
        } else {
            res.status(200).json({ used: false, message: "This delivery method has not been used in any orders." });
        }
    } catch (error) {
        console.error('Error during the check:', error);
        res.status(500).json({ error: 'Server error checking if the delivery method has been used.' });
    }
});

module.exports = router;
