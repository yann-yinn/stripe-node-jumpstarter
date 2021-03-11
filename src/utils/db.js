const { MongoClient } = require("mongodb");

let db;

const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  async connect(mongoUri) {
    // Connect the client to the server
    await client.connect();
    // get databasename from mongo url
    const urlSplit = mongoUri.split("/");
    const databaseName = urlSplit[urlSplit.length - 1].split("?")[0];
    // Establish and verify connection to database
    db = await client.db(databaseName);
    console.log("Connected successfully to database " + databaseName);
  },

  db() {
    return db;
  },
};
