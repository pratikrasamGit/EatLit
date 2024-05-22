const mongoose = require('mongoose')
// const mongoDbClient = require("mongodb").MongoClient

const mongoURI = 'mongodb+srv://foodapp:bpaKP9TS3gNBfo88@cluster0.ldmy2hh.mongodb.net/bringItApp?retryWrites=true&w=majority&appName=Cluster0';

// let options = {    
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true

//   }
  var options = { 
    connectTimeoutMS: 50000,
    socketTimeoutMS: 50000,
    useUnifiedTopology: true
   };
// mongodb://<username>:<password>@merncluster-shard-00-00.d1d4z.mongodb.net:27017,merncluster-shard-00-01.d1d4z.mongodb.net:27017,merncluster-shard-00-02.d1d4z.mongodb.net:27017/?ssl=true&replicaSet=atlas-eusy5p-shard-0&authSource=admin&retryWrites=true&w=majority
module.exports = function (callback) {
    mongoose.connect(mongoURI, options, async (err, result) => {
        // mongoDbClient.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
        if (err) console.log("---" + err)
        else {
            // var database =
            console.log("connected to mongo")
            const foodCollection = await mongoose.connection.db.collection("food_items");
            foodCollection.find({}).toArray(async function (err, data) {
                const categoryCollection = await mongoose.connection.db.collection("food_category");
                categoryCollection.find({}).toArray(async function (err, Catdata) {
                    callback(err, data, Catdata);

                })
            });
            // listCollections({name: 'food_items'}).toArray(function (err, database) {
            // });
            //     module.exports.Collection = database;
            // });
        }
    })
};
