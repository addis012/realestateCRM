import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://addis:a1e2y3t4@cluster0.qa1qptk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let client: MongoClient;
let db: Db;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('realEstateCRM');
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
  }
}

export { db };