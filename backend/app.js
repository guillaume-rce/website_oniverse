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
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const deliveryRoutes = require('./routes/delivery');
const tagsRoutes = require('./routes/tags');

app.use(cors());
app.use('/img', express.static('img'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Use routes
app.use('/games', gamesRoutes);
app.use('/images', imagesRoutes);
app.use('/auth', authRoutes);
app.use('/user', usersRoutes);

app.use('/orders', ordersRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/tags', tagsRoutes);

module.exports = app;
