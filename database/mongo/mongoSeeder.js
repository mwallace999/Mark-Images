/* mongoSeeder.js */
// Run by typing command: node database/mongo/mongoSeeder.js from project folder

const faker = require('faker');
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database & Collection Names & Parameters
const dbName = 'test'; //*** Change to Database name
const collectionName = 'productData'; //*** Change to Collection name
const quantity = 10000000; //*** Total number of data instances to add to db
const dataBlockSize = 1000; //*** Size of each Array that is pushed to db

let counter = 1;

// Create data instances
const seed = (collect, client) => {
  let products = [];
  for (let i = counter; i < counter + dataBlockSize; i++) {
    const productName = faker.commerce.productName();
    const newProduct = {
      _id: i,
      productName,
      image: 'https://picsum.photos/640/480',
    };
    products.push(newProduct);
    // console.log(newProduct.productId, newProduct.productName, newProduct.image);
  }
  client.db(dbName).collection(collect).insertMany(products)
    .then(products = [])
    .then(console.log(`Partial seed completed ${Math.ceil(counter / dataBlockSize)} of ${Math.floor(quantity / dataBlockSize)}`))
    .then(() => {
      if (counter + dataBlockSize <= quantity) {
        counter += dataBlockSize;
        seed(collect, client);
      } else {
        console.log('Database seeded!');
        client.close();
      }
    })
    .catch(console.log);
};

// Delete database and/or run seed
const mongoSeeder = (collection, overwrite) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.log(err);
      return;
    }
    if (overwrite) {
      client.db(dbName).collection(collection).drop((error, del) => {
        if (error) throw error;
        if (del) console.log('Collection deleted');
        seed(collection, client);
      });
    } else {
      seed(collection, client);
    }
  });
};

mongoSeeder(collectionName, true);
