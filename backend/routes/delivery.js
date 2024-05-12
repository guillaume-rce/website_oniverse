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
 * /delivery:
 *   get:
 *     summary: Retrieve a list of delivery methods
 *     responses:
 *       200:
 *         description: A list of delivery methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Standard Delivery
 *                   cost:
 *                     type: float
 *                     example: 5.00
 *                   available:
 *                     type: boolean
 *                     example: true
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
 * /delivery/{id}:
 *   get:
 *     summary: Retrieve a single delivery method by ID
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
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Standard Delivery
 *                 cost:
 *                   type: float
 *                   example: 5.00
 *                 available:
 *                   type: boolean
 *                   example: true
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
 *     summary: Delete a delivery method by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the delivery method
 *     responses:
 *       200:
 *         description: Delivery method deleted successfully
 *       404:
 *         description: Delivery method not found
 *       500:
 *         description: Server error during delivery method deletion
 */
router.delete('/:id', (req, res) => {
    const deliveryId = req.params.id;

    internal.query('DELETE FROM delivery_method WHERE id = ?', [deliveryId], (error) => {
        if (error) {
            console.error('Erreur lors de la requête DELETE :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête DELETE.' });
        } else {
            res.status(200).json({ message: 'Méthode de livraison supprimée avec succès.' });
        }
    });
});

module.exports = router;
