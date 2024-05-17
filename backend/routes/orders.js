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
 * tags:
 *   - name: Orders
 *     description: Operations related to order management.
 *   - name: Items
 *     description: Operations related to items within orders.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - user
 *         - name
 *         - country
 *         - zipcode
 *         - address
 *         - paymentMode
 *         - state
 *         - deliveryMethod
 *         - total
 *         - creationDateTime
 *         - lastUpdateDateTime
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: The unique identifier for the order, automatically incremented.
 *         user:
 *           type: integer
 *           format: int32
 *           description: The user ID associated with the order.
 *         name:
 *           type: string
 *           description: The recipient's full name. Stored as text in the database.
 *         country:
 *           type: string
 *           description: The recipient's country. Stored as text in the database.
 *         zipcode:
 *           type: string
 *           description: The postal code for the delivery address. Stored as tinytext in the database.
 *         address:
 *           type: string
 *           description: The full delivery address. Stored as text in the database.
 *         paymentMode:
 *           type: string
 *           enum: [CB, PAYPAL]
 *           default: CB
 *           description: The payment method used. Defaults to 'CB' if not specified.
 *         state:
 *           type: string
 *           enum: ['CONFIRMED', 'IN_PREPARATION', 'SEND', 'RECEIVED', 'CLOSED', 'MITIGE']
 *           description: The current state of the order.
 *         deliveryMethod:
 *           type: integer
 *           format: int32
 *           description: The identifier for the delivery method used.
 *         total:
 *           type: integer
 *           description: The total cost of the order, stored as an integer.
 *         creationDateTime:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was created, defaults to the current timestamp.
 *         lastUpdateDateTime:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was last updated, defaults to the current timestamp.
 *     Item:
 *       type: object
 *       required:
 *         - id
 *         - order_id
 *         - item_id
 *         - quantity
 *         - isDigital
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the order item.
 *         order_id:
 *           type: integer
 *           description: The order ID associated with this item.
 *         item_id:
 *           type: integer
 *           description: The product ID of the item.
 *         quantity:
 *           type: integer
 *           description: Quantity of the item ordered.
 *         isDigital:
 *           type: boolean
 *           description: Indicates if the item is digital.
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders, with optional filters
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter orders by date (YYYY-MM-DD), returns orders on or after this date.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit the number of returned orders, retrieves only the most recent orders.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: Order the results ascendingly or descendingly by creation date. Default is descending.
 *     responses:
 *       200:
 *         description: A list of all orders, optionally filtered by date and/or limited by number, and sorted by specified order.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error occurred while fetching orders.
 */
router.get('/', (req, res) => {
    let query = 'SELECT * FROM `order`';
    const queryParams = [];
    const { date, limit, sortOrder } = req.query;

    if (date) {
        query += ' WHERE creationDateTime >= ?';
        queryParams.push(date);
    }

    // Set the default sort order to descending unless specified otherwise
    const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY creationDateTime ${orderDirection}`;

    if (limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(limit));
    }

    internal.query(query, queryParams, (error, results) => {
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
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => {
    const { user, name, country, zipcode, address, paymentMode, state, deliveryMethod, total, items } = req.body;
    internal.beginTransaction(async (err) => {
        if (err) {
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            const insertOrderQuery = `INSERT INTO \`order\` (user, name, country, zipcode, address, paymentMode, state, deliveryMethod, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            const [orderResult] = await internal.promise().query(insertOrderQuery, [user, name, country, zipcode, address, paymentMode, state, deliveryMethod, total]);
            const orderId = orderResult.insertId;

            const insertOrderItemQuery = `INSERT INTO order_item (order_id, item_id, quantity, isDigital) VALUES (?, ?, ?, ?);`;
            for (const item of items) {
                await internal.promise().query(insertOrderItemQuery, [orderId, item.item_id, item.quantity, item.isDigital]);
            }

            internal.commit((err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(201).json({ message: 'Order created successfully', orderId: orderId });
            });
        } catch (error) {
            internal.rollback(() => {
                console.error('Error during data update:', error);
                res.status(500).json({ error: 'Server error updating data.' });
            });
        }
    });
});

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Retrieve a list of orders by user ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           description: User ID to retrieve orders for.
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No orders found for this user
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    internal.query('SELECT * FROM \`order\` WHERE user = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error during the SELECT query:', error);
            res.status(500).json({ error: 'Server error during the SELECT query.' });
        } else if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ error: 'No orders found for this user.' });
        }
    });
});

/**
 * @swagger
 * /orders/items:
 *   get:
 *     summary: Retrieve all order items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: A list of all order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Server error occurred while fetching order items
 */
router.get('/items', (req, res) => {
    internal.query('SELECT * FROM order_item', (error, results) => {
        if (error) {
            console.error('Error during the SELECT query:', error);
            res.status(500).json({ error: 'Server error during the SELECT query.' });
        } else {
            res.status(200).json(results);
        }
    });
});

/**
 * @swagger
 * /orders/items/{id}:
 *   get:
 *     summary: Retrieve all items associated with a specific order ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Order ID to retrieve items for.
 *     responses:
 *       200:
 *         description: A list of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       404:
 *         description: No items found for this order
 *       500:
 *         description: Server error
 */
router.get('/items/:id', (req, res) => {
    const orderId = req.params.id;
    internal.query('SELECT * FROM order_item WHERE order_id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error during the SELECT query:', error);
            res.status(500).json({ error: 'Server error during the SELECT query.' });
        } else if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ error: 'No items found for this order.' });
        }
    });
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Order ID to retrieve.
 *     responses:
 *       200:
 *         description: Detailed information about an order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    internal.query('SELECT * FROM \`order\` WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error during the SELECT query:', error);
            res.status(500).json({ error: 'Server error during the SELECT query.' });
        } else if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: 'Order not found.' });
        }
    });
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Order ID to delete.
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
            console.error('Error initiating transaction:', err);
            return res.status(500).json({ error: 'Server error during transaction.' });
        }

        try {
            await internal.promise().query('DELETE FROM order_item WHERE order_id = ?', [orderId]);
            await internal.promise().query('DELETE FROM \`order\` WHERE id = ?', [orderId]);

            internal.commit((err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    return res.status(500).json({ error: 'Server error during transaction commit.' });
                }
                res.status(200).json({ message: 'Order deleted successfully.' });
            });
        } catch (error) {
            internal.rollback(() => {
                console.error('Error during data update:', error);
                res.status(500).json({ error: 'Server error updating data.' });
            });
        }
    });
});

/**
 * @swagger
 * /orders/{id}/advance-state:
 *   put:
 *     summary: Advance the state of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           description: The ID of the order to update.
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nextState:
 *                 type: string
 *                 description: The next state to set for the order. If not specified, it will automatically advance to the next logical state.
 *     responses:
 *       200:
 *         description: Order state updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request or state transition not allowed.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Server error during updating order state.
 */
router.put('/:id/advance-state', (req, res) => {
    const orderId = req.params.id;
    const { nextState } = req.body;

    const validStates = ['CONFIRMED', 'IN_PREPARATION', 'SEND', 'RECEIVED', 'CLOSED', 'MITIGE'];
    const stateTransition = {
        CONFIRMED: 'IN_PREPARATION',
        IN_PREPARATION: 'SEND',
        SEND: 'RECEIVED',
        RECEIVED: 'CLOSED'
    };

    internal.query('SELECT state FROM `order` WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error during the SELECT query:', error);
            return res.status(500).json({ error: 'Server error during the SELECT query.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const currentState = results[0].state;
        const newState = nextState || stateTransition[currentState];

        if (!newState || !validStates.includes(newState) || !stateTransition[currentState]) {
            return res.status(400).json({ error: 'Invalid state transition.' });
        }

        internal.query('UPDATE `order` SET state = ?, lastUpdateDateTime = NOW() WHERE id = ?', [newState, orderId], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error during the UPDATE query:', updateError);
                return res.status(500).json({ error: 'Server error during the UPDATE query.' });
            }
            if (updateResults.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found.' });
            }
            res.status(200).json({ message: 'Order state updated successfully.', orderId: orderId, newState: newState });
        });
    });
});

module.exports = router;
