const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Plant', plantSchema);
