const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'headsOfStateDB';
const collName = 'headsOfState';

var headsOfStateDB;
var headsOfState;

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client) => {
        //store database
        headsOfStateDB = client.db(dbName)
        //store collection
        headsOfState = headsOfStateDB.collection(collName)
    })
    .catch((error) => {
        console.log(error)
    })

    var getHeadsOfState = function() {
        return new Promise((resolve, reject) => {
            var cursor = headsOfState.find()
            cursor.toArray()
                .then((documents) => {
                    resolve(documents)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    //function to add new head of state to database
    var addHeadOfState = function (_id, headOfState) {
         return new Promise((resolve, reject) => {
            headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    //function to delete  head of state from database
    var deleteHeadOfState = function (_id) {
        return new Promise((resolve, reject) => {
           headsOfState.deleteOne( { "_id": _id } )
               .then((result) => {
                   resolve(result)
               })
               .catch((error) => {
                   reject(error)
               })
       })
   }

    module.exports = {getHeadsOfState, addHeadOfState, deleteHeadOfState}