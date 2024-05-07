// routes/orders.js

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
 * /orders:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: John Doe
 *               contry:
 *                 type: string
 *                 example: USA
 *               zipcode:
 *                 type: string
 *                 example: 12345
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               paymentMode:
 *                 type: string
 *                 enum: [CB, PAYPAL]
 *                 example: CB
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item_id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     isDigital:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                   example: 1
 */
router.post('/', (req, res) => {
    const { user, name, contry, zipcode, address, paymentMode, items } = req.body;
    const state = 'CONFIRMED';

    internal.beginTransaction(async (err) => {
        if (err) {
            console.error('Erreur lors de l\'initialisation de la transaction :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de la transaction.' });
        }

        try {
            const insertOrderQuery = `
                INSERT INTO \`order\` (user, name, contry, zipcode, address, paymentMode, state)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [orderResult] = await internal.promise().query(insertOrderQuery, [user, name, contry, zipcode, address, paymentMode, state]);
            const orderId = orderResult.insertId;

            const insertOrderItemQuery = `
                INSERT INTO order_item (order_id, item_id, quantity, isDigital)
                VALUES (?, ?, ?, ?)
            `;
            for (const item of items) {
                await internal.promise().query(insertOrderItemQuery, [orderId, item.item_id, item.quantity, item.isDigital]);
            }

            internal.commit((err) => {
                if (err) {
                    console.error('Erreur lors de la validation de la transaction :', err);
                    return res.status(500).json({ error: 'Erreur serveur lors de la validation de la transaction.' });
                }
                res.status(201).json({ orderId });
            });
        } catch (error) {
            internal.rollback(() => {
                console.error('Erreur lors de la mise à jour des données :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des données.' });
            });
        }
    });
});

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Retrieve a list of orders by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of orders
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
 *                   user:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   contry:
 *                     type: string
 *                     example: USA
 *                   zipcode:
 *                     type: string
 *                     example: 12345
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *                   paymentMode:
 *                     type: string
 *                     example: CB
 *                   state:
 *                     type: string
 *                     example: CONFIRMED
 *                   creationDateTime:
 *                     type: string
 *                     example: 2024-05-07T10:00:00Z
 *                   lastUpdateDateTime:
 *                     type: string
 *                     example: 2024-05-07T10:00:00Z
 */
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;

    internal.query('SELECT * FROM `order` WHERE user = ?', [userId], (error, results) => {
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
 * /orders:
 *   get:
 *     summary: Retrieve a list of orders
 *     responses:
 *       200:
 *         description: A list of orders
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
 *                   user:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   contry:
 *                     type: string
 *                     example: USA
 *                   zipcode:
 *                     type: string
 *                     example: 12345
 *                   address:
 *                     type: string
 *                     example: 123 Main St
 *                   paymentMode:
 *                     type: string
 *                     example: CB
 *                   state:
 *                     type: string
 *                     example: CONFIRMED
 *                   creationDateTime:
 *                     type: string
 *                     example: 2024-05-07T10:00:00Z
 *                   lastUpdateDateTime:
 *                     type: string
 *                     example: 2024-05-07T10:00:00Z
 */
router.get('/', (req, res) => {
    internal.query('SELECT * FROM `order`', (error, results) => {
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
 * /orders/{id}:
 *   get:
 *     summary: Retrieve a single order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: A single order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 contry:
 *                   type: string
 *                   example: USA
 *                 zipcode:
 *                   type: string
 *                   example: 12345
 *                 address:
 *                   type: string
 *                   example: 123 Main St
 *                 paymentMode:
 *                   type: string
 *                   example: CB
 *                 state:
 *                   type: string
 *                   example: CONFIRMED
 *                 creationDateTime:
 *                   type: string
 *                   example: 2024-05-07T10:00:00Z
 *                 lastUpdateDateTime:
 *                   type: string
 *                   example: 2024-05-07T10:00:00Z
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       item_id:
 *                         type: integer
 *                         example: 1
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       isDigital:
 *                         type: boolean
 *                         example: true
 */
router.get('/:id', (req, res) => {
    const orderId = req.params.id;

    internal.query('SELECT * FROM `order` WHERE id = ?', [orderId], (error, orderResults) => {
        if (error) {
            console.error('Erreur lors de la requête SELECT :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
        } else {
            if (orderResults.length > 0) {
                internal.query('SELECT * FROM order_item WHERE order_id = ?', [orderId], (error, itemResults) => {
                    if (error) {
                        console.error('Erreur lors de la requête SELECT :', error);
                        res.status(500).json({ error: 'Erreur serveur lors de la requête SELECT.' });
                    } else {
                        const order = orderResults[0];
                        order.items = itemResults;
                        res.status(200).json(order);
                    }
                });
            } else {
                res.status(404).json({ error: 'Aucune commande trouvée avec cet ID.' });
            }
        }
    });
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error during order deletion
 */
router.delete('/:id', (req, res) => {
    const orderId = req.params.id;

    internal.beginTransaction(async (err) => {
        if (err) {
            console.error('Erreur lors de l\'initialisation de la transaction :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de la transaction.' });
        }

        try {
            await internal.promise().query('DELETE FROM order_item WHERE order_id = ?', [orderId]);
            await internal.promise().query('DELETE FROM `order` WHERE id = ?', [orderId]);

            internal.commit((err) => {
                if (err) {
                    console.error('Erreur lors de la validation de la transaction :', err);
                    return res.status(500).json({ error: 'Erreur serveur lors de la validation de la transaction.' });
                }
                res.status(200).json({ message: 'Commande supprimée avec succès.' });
            });
        } catch (error) {
            internal.rollback(() => {
                console.error('Erreur lors de la mise à jour des données :', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des données.' });
            });
        }
    });
});

module.exports = router;
