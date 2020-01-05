const mongoose = require('mongoose');


const locationSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: "Point"
    },
    coordinates: {
        type: [Number],
    }
});


const geoUserSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true
    },
    status: Boolean,
    user_location: {
        type: locationSchema,
        index: '2dsphere'
    }
}, { versionKey: false });
module.exports = mongoose.model('GeoUser', geoUserSchema);
