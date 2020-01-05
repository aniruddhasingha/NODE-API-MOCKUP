const express = require('express');
const router = express.Router();
const Page = require('../models/page');
const mongoose = require('mongoose');
const db = mongoose.connection;

db.once('open', async () => {
    if (await Page.countDocuments().exec() > 0) return
    Promise.all([
        Page.create({ page: 'Page 1' }),
        Page.create({ page: 'Page 2' }),
        Page.create({ page: 'Page 3' }),
        Page.create({ page: 'Page 4' }),
        Page.create({ page: 'Page 5' }),
        Page.create({ page: 'Page 6' }),
        Page.create({ page: 'Page 7' }),
        Page.create({ page: 'Page 8' }),
        Page.create({ page: 'Page 9' }),
        Page.create({ page: 'Page 10' }),
        Page.create({ page: 'Page 11' }),
        Page.create({ page: 'Page 13' }),
    ]).then(() => {
        console.log('Added Pages')
    });
});
router.get('/', paginatedResults(Page), (req, res, next) => {
    res.json(res.paginatedResults)
});
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = (page) * limit;
        const results = {};
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        }
        catch (err) {
            res.status(500).json({
                error: err
            })
        }

    }
}


module.exports = router;