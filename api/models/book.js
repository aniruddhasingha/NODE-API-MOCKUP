const mongoose = require('mongoose');
const BookSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: [{ type: String, required: true }],
    pages: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Book', BookSchema);