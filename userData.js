const {
    MongoClient,
    ObjectID
} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'user-data'
let db
MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database!")
    }
    db = client.db(databaseName)
})
//function to readAllUsers
function readAllUsers() {
    return db.collection('user').find({}).toArray().then((result) => {
        console.log('Showing All users', result);
        return result;
    }).catch((error) => {
        return error;
    });
}
//funtion to readUser
function readUser(refId) {
    let query = {
        refId: refId
    }
    return db.collection('user').find(query).toArray().then((result) => {
        console.log(`Showing users with refID ${refId}`);
        return result;
    }).catch((error) => {
        return error;
    });
}
//Function to delete user from user-data

function deleteUser(refId) {
    let query = {
        refId: refId
    }
    return db.collection('user').deleteOne(query).then((result) => {
        console.log(`deleted user with refId ${refId}`);
        return true;
    }).catch((error) => {
        return error;
    });
};

//Function to create note from dataBase

function createNewUser(refId, userName) {
    return db.collection('user').insertOne({
        refId: refId,
        userName: userName
    }).then((result) => {
        console.log(`created user with refId ${refId}`);
        return result.ops;
    }).catch((error) => {
        return error;
    });
}

//Funtion to update note from dataBase
function updateUser(refId, userName) {
    return db.collection('user').updateOne({
        refId: refId
    }, {
        $set: {
            refId: refId,
            userName: userName
        }
    }).then((result) => {
        return result
    })
}
//exporting function to server.js
module.exports = {
    readAllUsers, readUser, updateUser, deleteUser, createNewUser
}