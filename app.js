
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('body-parser');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000
const dotenv = require('dotenv');
dotenv.config();
const geoUsersRoutes = require('./api/routes/geoUsers');
const userRoutes = require('./api/routes/users');
const booksRoutes = require('./api/routes/books');
const pageRoutes = require('./api/routes/pages');
const clientRoutes = require('./api/routes/clients');


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
mongoose.connect('mongodb://127.0.0.1:27017/Geo_Co-ordinate', {
    useNewUrlParser: true, useUnifiedTopology: true
})


app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/books', booksRoutes);
app.use('/users', userRoutes);
app.use('/pages', pageRoutes);
app.use('/client', clientRoutes);
app.use('/geoUsers', geoUsersRoutes);
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;



