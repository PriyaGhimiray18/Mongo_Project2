import { MongoClient } from 'mongodb';

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.DATABASE_URL;
console.log('Attempting to connect to MongoDB...');

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
});

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    console.log('Connecting to MongoDB...');
    cachedClient = await client.connect();
    console.log('Successfully connected to MongoDB');
    
    cachedDb = cachedClient.db();
    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    if (error.message.includes('bad auth')) {
      console.error('Authentication failed. Please check your username and password in the connection string.');
    }
    throw error;
  }
}
