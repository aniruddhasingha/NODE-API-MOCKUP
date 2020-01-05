const express = require('express')
const mongo = require("./userData")
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Specifying the PORT address
app.use(express.json())
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
app.get('/', (req, res) => {
    res.sendStatus(200)
    res.json({ "message": "running User Database" })
})
//Read all notes
app.get('/users', (req, res) => {
    mongo.readAllUsers().then((result) => {
        res.send(result)
    })
})
//Read single note
app.get('/user/:refId', (req, res) => {
    mongo.readUser(req.params.refId).then((result) => {
        res.send(result)
    })
})
//Delete data
app.delete('/user/delete/:refId', (req, res) => {
    mongo.deleteUser(req.params.refId).then((result) => {
        res.send(result)
    })

})
//Create data
app.post('/user/createUser', (req, res) => {

    mongo.createNewUser(req.body.refId, req.body.userName).then((result) => {
        res.send(result)
    })

})
//Update data
app.put('/user/updateUser/:refId', (req, res) => {
    mongo.updateUser(req.body.refId, req.body.userName).then((result) => {
        res.send(result)
    })

})




