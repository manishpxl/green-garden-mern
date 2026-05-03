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

const allowedOrigins = [
  'http://localhost:3000',
  'https://green-garden-mern.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Green Garden backend is running');
});

app.use('/api/fs/users', userRoutes_fs);
app.use('/api/fs/plants', plantRoutes_fs);

app.use('/api/db/users', userRoutes);
app.use('/api/db/plants', plantRoutes);
app.use('/api/db/orders', orderRoutes);
app.use('/api/db/reviews', reviewRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });