import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import type {
  User,
  UpsertUser,
  Tenant,
  InsertTenant,
  Lead,
  InsertLead,
  Property,
  InsertProperty,
  Deal,
  InsertDeal,
  ExchangeRate,
  InsertExchangeRate,
  Activity,
  InsertActivity,
} from '@shared/schema';
import type { IStorage } from './storage';

export class MongoStorage implements IStorage {
  private db: Db | null = null;
  private client: MongoClient | null = null;

  private async getDb(): Promise<Db> {
    if (!this.db) {
      const MONGODB_URI = 'mongodb+srv://addis:a1e2y3t4@cluster0.qa1qptk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
      
      this.client = new MongoClient(MONGODB_URI, {
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        minPoolSize: 2
      });
      
      await this.client.connect();
      await this.client.db('admin').command({ ping: 1 });
      this.db = this.client.db('realEstateCRM');
      console.log('Connected to MongoDB successfully');
    }
    return this.db;
  }

  private generateId(): string {
    return new ObjectId().toString();
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const db = await this.getDb();
    const user = await db.collection('users').findOne({ id });
    return user ? this.convertFromMongo(user) : undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const db = await this.getDb();
    const userId = userData.id || this.generateId();
    
    const user = {
      ...userData,
      id: userId,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').replaceOne(
      { id: userId },
      user,
      { upsert: true }
    );

    return this.convertFromMongo(user);
  }

  // Tenant operations
  async getTenant(id: string): Promise<Tenant | undefined> {
    const db = await this.getDb();
    const tenant = await db.collection('tenants').findOne({ id });
    return tenant ? this.convertFromMongo(tenant) : undefined;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    const db = await this.getDb();
    const tenant = await db.collection('tenants').findOne({ subdomain });
    return tenant ? this.convertFromMongo(tenant) : undefined;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const db = await this.getDb();
    const newTenant = {
      ...tenant,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('tenants').insertOne(newTenant);
    return this.convertFromMongo(newTenant);
  }

  async updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant> {
    const db = await this.getDb();
    const updatedTenant = {
      ...tenant,
      updatedAt: new Date(),
    };

    const result = await db.collection('tenants').findOneAndUpdate(
      { id },
      { $set: updatedTenant },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Tenant not found');
    }

    return this.convertFromMongo(result);
  }

  // Lead operations
  async getLeads(tenantId: string, filters?: { status?: string; assignedTo?: string }): Promise<Lead[]> {
    const db = await this.getDb();
    const query: any = { tenantId };

    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }

    const leads = await db.collection('leads')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return leads.map(lead => this.convertFromMongo(lead));
  }

  async getLead(id: string, tenantId: string): Promise<Lead | undefined> {
    const db = await this.getDb();
    const lead = await db.collection('leads').findOne({ id, tenantId });
    return lead ? this.convertFromMongo(lead) : undefined;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const db = await this.getDb();
    const newLead = {
      ...lead,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('leads').insertOne(newLead);
    return this.convertFromMongo(newLead);
  }

  async updateLead(id: string, tenantId: string, lead: Partial<InsertLead>): Promise<Lead> {
    const db = await this.getDb();
    const updatedLead = {
      ...lead,
      updatedAt: new Date(),
    };

    const result = await db.collection('leads').findOneAndUpdate(
      { id, tenantId },
      { $set: updatedLead },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Lead not found');
    }

    return this.convertFromMongo(result);
  }

  async deleteLead(id: string, tenantId: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('leads').deleteOne({ id, tenantId });
  }

  // Property operations
  async getProperties(tenantId: string, filters?: { type?: string; location?: string; status?: string }): Promise<Property[]> {
    const db = await this.getDb();
    const query: any = { tenantId };

    if (filters?.type) {
      query.type = filters.type;
    }
    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    const properties = await db.collection('properties')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return properties.map(property => this.convertFromMongo(property));
  }

  async getProperty(id: string, tenantId: string): Promise<Property | undefined> {
    const db = await this.getDb();
    const property = await db.collection('properties').findOne({ id, tenantId });
    return property ? this.convertFromMongo(property) : undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const db = await this.getDb();
    const newProperty = {
      ...property,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('properties').insertOne(newProperty);
    return this.convertFromMongo(newProperty);
  }

  async updateProperty(id: string, tenantId: string, property: Partial<InsertProperty>): Promise<Property> {
    const db = await this.getDb();
    const updatedProperty = {
      ...property,
      updatedAt: new Date(),
    };

    const result = await db.collection('properties').findOneAndUpdate(
      { id, tenantId },
      { $set: updatedProperty },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Property not found');
    }

    return this.convertFromMongo(result);
  }

  async deleteProperty(id: string, tenantId: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('properties').deleteOne({ id, tenantId });
  }

  // Deal operations
  async getDeals(tenantId: string, filters?: { status?: string; agentId?: string }): Promise<Deal[]> {
    const db = await this.getDb();
    const query: any = { tenantId };

    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.agentId) {
      query.agentId = filters.agentId;
    }

    const deals = await db.collection('deals')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return deals.map(deal => this.convertFromMongo(deal));
  }

  async getDeal(id: string, tenantId: string): Promise<Deal | undefined> {
    const db = await this.getDb();
    const deal = await db.collection('deals').findOne({ id, tenantId });
    return deal ? this.convertFromMongo(deal) : undefined;
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const db = await this.getDb();
    const newDeal = {
      ...deal,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('deals').insertOne(newDeal);
    return this.convertFromMongo(newDeal);
  }

  async updateDeal(id: string, tenantId: string, deal: Partial<InsertDeal>): Promise<Deal> {
    const db = await this.getDb();
    const updatedDeal = {
      ...deal,
      updatedAt: new Date(),
    };

    const result = await db.collection('deals').findOneAndUpdate(
      { id, tenantId },
      { $set: updatedDeal },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Deal not found');
    }

    return this.convertFromMongo(result);
  }

  // Exchange rate operations
  async getExchangeRate(tenantId: string): Promise<ExchangeRate | undefined> {
    const db = await this.getDb();
    const rate = await db.collection('exchangeRates')
      .findOne({ tenantId }, { sort: { updatedAt: -1 } });
    return rate ? this.convertFromMongo(rate) : undefined;
  }

  async updateExchangeRate(tenantId: string, rates: InsertExchangeRate): Promise<ExchangeRate> {
    const db = await this.getDb();
    const newRate = {
      ...rates,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('exchangeRates').replaceOne(
      { tenantId },
      newRate,
      { upsert: true }
    );

    return this.convertFromMongo(newRate);
  }

  // Activity operations
  async getActivities(tenantId: string, limit: number = 10): Promise<Activity[]> {
    const db = await this.getDb();
    const activities = await db.collection('activities')
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return activities.map(activity => this.convertFromMongo(activity));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const db = await this.getDb();
    const newActivity = {
      ...activity,
      id: this.generateId(),
      createdAt: new Date(),
    };

    await db.collection('activities').insertOne(newActivity);
    return this.convertFromMongo(newActivity);
  }

  // Dashboard stats
  async getDashboardStats(tenantId: string): Promise<{
    totalLeads: number;
    activeProperties: number;
    closedDeals: number;
    totalCommission: number;
  }> {
    const db = await this.getDb();

    const [
      totalLeads,
      activeProperties,
      closedDeals,
      commissionResult
    ] = await Promise.all([
      db.collection('leads').countDocuments({ tenantId }),
      db.collection('properties').countDocuments({ tenantId, status: 'available' }),
      db.collection('deals').countDocuments({ tenantId, status: 'closed' }),
      db.collection('deals').aggregate([
        { $match: { tenantId, status: 'closed' } },
        { $group: { _id: null, total: { $sum: { $toDecimal: '$agentCommission' } } } }
      ]).toArray()
    ]);

    const totalCommission = commissionResult.length > 0 ? Number(commissionResult[0].total) : 0;

    return {
      totalLeads,
      activeProperties,
      closedDeals,
      totalCommission,
    };
  }

  // Helper method to convert MongoDB documents
  private convertFromMongo(doc: any): any {
    if (!doc) return doc;
    
    // Remove MongoDB's _id field and ensure proper typing
    const { _id, ...result } = doc;
    
    // Convert date strings back to Date objects if needed
    if (result.createdAt && typeof result.createdAt === 'string') {
      result.createdAt = new Date(result.createdAt);
    }
    if (result.updatedAt && typeof result.updatedAt === 'string') {
      result.updatedAt = new Date(result.updatedAt);
    }
    if (result.dealDate && typeof result.dealDate === 'string') {
      result.dealDate = new Date(result.dealDate);
    }
    
    return result;
  }
}