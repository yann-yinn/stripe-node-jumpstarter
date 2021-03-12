const { MongoClient } = require("mongodb");

let db;

const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  async connect() {
    await client.connect();
    db = client.db();
    console.log("📡 Connected successfully to database " + db.databaseName);
  },

  db: () => db,
};
