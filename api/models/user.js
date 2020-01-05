const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    book: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});
module.exports = mongoose.model('User', userSchema);



