// Initialize express app and use routes
const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");
const app = express();

// Routes
const gamesRoutes = require('./routes/games');
const imagesRoutes = require('./routes/images');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const deliveryRoutes = require('./routes/delivery');
const tagsRoutes = require('./routes/tags');
const discountCodeRoutes = require('./routes/discountCodes');

app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Use routes
app.use('/games', gamesRoutes);
app.use('/images', imagesRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/users', usersRoutes);

app.use('/orders', ordersRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/tags', tagsRoutes);
app.use('/discount-codes', discountCodeRoutes);

module.exports = app;
