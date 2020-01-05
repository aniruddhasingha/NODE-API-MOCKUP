const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/client');
const privateKey = 'secret';
//SIGNUP ROUTES
router.post('/signup', (req, res, next) => {
    Client.find({ eamil: req.body.email }).exec().then(client => {
        if (client.length >= 1) {
            //  status(409) means conflict
            return res.status(409).json({
                message: "email already registered"
            })
        } else {
            // here 10 is the saltRounds
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const client = new Client({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
                    client.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                mesaage: "Client Created"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    });
});
// LOGIN ROUTES
router.post('/login', (req, res, next) => {
    Client.findOne({ email: req.body.email }).exec()
        .then(client => {
            if (client.length < 1) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            else {
                bcrypt.compare(req.body.password, client.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth Failed"
                        });
                    }
                    // IF AUTH. SUCCESSFUL WE CALL JWT SIGN METHOD
                    if (result) {
                        const token = jwt.sign({
                            name: client.name,
                            email: client.email,
                            clientId: client._id
                        },
                            // FOR PRIVATE KEY USED  require('crypto').randomBytes(64).toString('hex')
                            privateKey,
                            {
                                expiresIn: "1h"
                            });
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token
                        })
                    }

                    res.status(401).json({
                        message: "Auth Failed",
                    });

                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


// DELETE ROUTES
router.delete('/:clientId', (req, res, next) => {
    Client.remove({
        _id: req.params.clientId
    }).exec()
        .then(result => {
            res.status(200).json({
                message: "Client Deleted"
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});
module.exports = router;