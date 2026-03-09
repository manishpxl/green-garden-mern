require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes_fs = require('./routes/userRoutes_fs');
const plantRoutes_fs = require('./routes/plantRoutes_fs');

const userRoutes = require('./routes/userRoutes');
const plantRoutes = require('./routes/plantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/fs/users', userRoutes_fs);
app.use('/api/fs/plants', plantRoutes_fs);

app.use('/api/db/users', userRoutes);
app.use('/api/db/plants', plantRoutes);
app.use('/api/db/orders', orderRoutes);
app.use('/api/db/reviews', reviewRoutes);

mongoose.connect(process.env.MONGO_URI || `${process.env.PORT}/greengarden`)
    .then(() => {
        console.log("Connected to MongoDB.");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
