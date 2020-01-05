const mongoose = require('mongoose');
const pageSchema = mongoose.Schema({
    page: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('Page', pageSchema);