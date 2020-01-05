const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    MongoClient,
    ObjectID
} = require('mongodb');
const app = express();


// using the middleware of body parser
app.use(bodyParser.urlencoded({ extended: true }));


//intializing malter library
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})


//configuring mongodb
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'filesUploading'
let db
MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database!")
    }
    db = client.db(databaseName)
    app.listen(3000, () => {
        console.log(`MongoDB server listening at 3000`)
    })
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server is listening on Port 5000");
})



//configuring the home route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//configuring the '/uploadFile' route

app.post('/uploadFile', upload.single('myFile'), (req, res, next) => {


    //fetching the file
    const file = req.file;
    if (!file) {


        //creating constructor for error
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    //no error
    res.send(file);
})



//configuring the '/uploadMultiple' route
app.post('/uploadMultiple', upload.array('myFiles', 12), (req, res, next) => {


    //fetching multiple files
    const files = req.files;
    if (!files) {


        //creating constructor for error
        const error = new Error("Please choose a files");
        error.httpStatusCode = 400;
        return next(error);
    }

    //no error
    res.send(files);
})



//configuring the '/uploadPhoto' or image upload route
//configuring the image upload to the database

app.post('/uploadPhoto', upload.single('myImage'), (req, res) => {
    const img = fs.readFileSync(req.file.path);

    const encode_image = img.toString('base64');


    //definig a Object for the image
    const finalImage = {
        contentType: req.file.mimetype,
        path: req.file.path,
        image: new Buffer(encode_image, 'base64')
    };


    //insert the image to the database
    db.collection('image').insertOne(finalImage, (err, result) => {
        console.log(result);
        if (err) {
            return console.log(err);
        }
        console.log('Saved to DataBase');
        res.contentType(finalImage.contetType);
        res.send(finalImage.image);
    })
})
