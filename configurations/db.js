const { MongoClient } = require('mongodb');
const uri = process.env.MONGOBD_URI
const dbconnection = (collection, cb) => {
    MongoClient.connect(uri)
        .then(async (client) => {
            const db = client.db(process.env.MONGODB_DB).collection(collection);
            await cb(db);
            client.close();
        })
        .catch((err) => {
            console.error("Connection error:", err);
        });
};


module.exports = dbconnection;

