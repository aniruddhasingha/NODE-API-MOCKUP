const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const checkAuth = require('../middleware/auth');


router.get('/', checkAuth, (req, res, next) => {
    User.find()
        .populate('book')
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

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        book: req.body.bookId
    });
    return user.save().then(result => {
        console.log(result);
        res.status(200).json(result)
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;