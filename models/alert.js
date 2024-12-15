const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    pubDate: {
        type: Date,
        default: Date.now
    },
    source: String,
    isRelevant: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);