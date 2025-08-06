import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

let client: MongoClient;
let db: Db;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    
    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    
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