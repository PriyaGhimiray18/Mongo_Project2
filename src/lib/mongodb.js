import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://02230143cst:JEFpSjVIoIFaokpx@cluster0.qrahbd1.mongodb.net/Hostel_booking"; // replace with your connection string

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  cachedClient = await client.connect();
  cachedDb = cachedClient.db();
  return { client: cachedClient, db: cachedDb };
}
