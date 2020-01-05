const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const GeoUser = require('../models/geoUser');

router.post('/signup', (req, res, next) => {
    // console.log(JSON.stringify(req.body, null, 2))
    const geoUser = new GeoUser({

        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        place: req.body.place,
        status: req.body.status,
        user_location: {
            type: "Point",
            coordinates: [req.body.long, req.body.lat]
        }
    });
    return geoUser.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
//Router fo finding all users
router.get('/', (req, res, next) => {
    GeoUser.find()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Router to find all active users by providing a your location and range as query 

router.get('/activeGeoUsers', (req, res, next) => {
    const long = parseFloat(req.query.longitude);
    const lat = parseFloat(req.query.latitude);
    const range = parseFloat(req.query.range);
    GeoUser.find({ $and: [{ status: { $eq: true } }, { user_location: { $geoWithin: { $centerSphere: [[long, lat], range / 6378.1] } } }] })
        .exec()
        .then(doc => {
            // doc.shift();
            console.log(doc);
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})
module.exports = router;