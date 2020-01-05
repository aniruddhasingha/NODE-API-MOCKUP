const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/book');
// Using regex for searching titles
router.get('/', (req, res, next) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Book.find({ "title": regex }).exec()
            .then(docs => {
                console.log(docs);
                res.status(200).json(docs)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(
                    {
                        error: err
                    });
                res.json(res.paginatedResults)
            });
    } else {
        Book.find()
            .exec()
            .then(docs => {
                console.log(docs);
                res.status(200).json(docs)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(
                    {
                        error: err
                    });
            });
        res.json(res.paginatedResults)
    }
});

router.post('/', (req, res, next) => {
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        language: req.body.language
    });
    return book.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;