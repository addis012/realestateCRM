import {
  users,
  tenants,
  leads,
  properties,
  deals,
  exchangeRates,
  activities,
  type User,
  type UpsertUser,
  type Tenant,
  type InsertTenant,
  type Lead,
  type InsertLead,
  type Property,
  type InsertProperty,
  type Deal,
  type InsertDeal,
  type ExchangeRate,
  type InsertExchangeRate,
  type Activity,
  type InsertActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sum } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tenant operations
  getTenant(id: string): Promise<Tenant | undefined>;
  getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant>;
  
  // Lead operations
  getLeads(tenantId: string, filters?: { status?: string; assignedTo?: string }): Promise<Lead[]>;
  getLead(id: string, tenantId: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, tenantId: string, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string, tenantId: string): Promise<void>;
  
  // Property operations
  getProperties(tenantId: string, filters?: { type?: string; location?: string; status?: string }): Promise<Property[]>;
  getProperty(id: string, tenantId: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, tenantId: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string, tenantId: string): Promise<void>;
  
  // Deal operations
  getDeals(tenantId: string, filters?: { status?: string; agentId?: string }): Promise<Deal[]>;
  getDeal(id: string, tenantId: string): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, tenantId: string, deal: Partial<InsertDeal>): Promise<Deal>;
  
  // Exchange rate operations
  getExchangeRate(tenantId: string): Promise<ExchangeRate | undefined>;
  updateExchangeRate(tenantId: string, rates: InsertExchangeRate): Promise<ExchangeRate>;
  
  // Activity operations
  getActivities(tenantId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Dashboard stats
  getDashboardStats(tenantId: string): Promise<{
    totalLeads: number;
    activeProperties: number;
    closedDeals: number;
    totalCommission: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tenant operations
  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...tenant, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  // Lead operations
  async getLeads(tenantId: string, filters?: { status?: string; assignedTo?: string }): Promise<Lead[]> {
    const conditions = [eq(leads.tenantId, tenantId)];
    
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status as any));
    }
    
    if (filters?.assignedTo) {
      conditions.push(eq(leads.assignedTo, filters.assignedTo));
    }
    
    return await db.select().from(leads)
      .where(and(...conditions))
      .orderBy(desc(leads.createdAt));
  }

  async getLead(id: string, tenantId: string): Promise<Lead | undefined> {
    const [lead] = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLead(id: string, tenantId: string, lead: Partial<InsertLead>): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...lead, updatedAt: new Date() })
      .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)))
      .returning();
    return updatedLead;
  }

  async deleteLead(id: string, tenantId: string): Promise<void> {
    await db.delete(leads).where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)));
  }

  // Property operations
  async getProperties(tenantId: string, filters?: { type?: string; location?: string; status?: string }): Promise<Property[]> {
    const conditions = [eq(properties.tenantId, tenantId)];
    
    if (filters?.type) {
      conditions.push(eq(properties.type, filters.type as any));
    }
    
    if (filters?.status) {
      conditions.push(eq(properties.status, filters.status as any));
    }
    
    return await db.select().from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string, tenantId: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(and(eq(properties.id, id), eq(properties.tenantId, tenantId)));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: string, tenantId: string, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(and(eq(properties.id, id), eq(properties.tenantId, tenantId)))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string, tenantId: string): Promise<void> {
    await db.delete(properties).where(and(eq(properties.id, id), eq(properties.tenantId, tenantId)));
  }

  // Deal operations
  async getDeals(tenantId: string, filters?: { status?: string; agentId?: string }): Promise<Deal[]> {
    const conditions = [eq(deals.tenantId, tenantId)];
    
    if (filters?.status) {
      conditions.push(eq(deals.status, filters.status as any));
    }
    
    if (filters?.agentId) {
      conditions.push(eq(deals.agentId, filters.agentId));
    }
    
    return await db.select().from(deals)
      .where(and(...conditions))
      .orderBy(desc(deals.createdAt));
  }

  async getDeal(id: string, tenantId: string): Promise<Deal | undefined> {
    const [deal] = await db
      .select()
      .from(deals)
      .where(and(eq(deals.id, id), eq(deals.tenantId, tenantId)));
    return deal;
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [newDeal] = await db.insert(deals).values(deal).returning();
    return newDeal;
  }

  async updateDeal(id: string, tenantId: string, deal: Partial<InsertDeal>): Promise<Deal> {
    const [updatedDeal] = await db
      .update(deals)
      .set({ ...deal, updatedAt: new Date() })
      .where(and(eq(deals.id, id), eq(deals.tenantId, tenantId)))
      .returning();
    return updatedDeal;
  }

  // Exchange rate operations
  async getExchangeRate(tenantId: string): Promise<ExchangeRate | undefined> {
    const [rate] = await db
      .select()
      .from(exchangeRates)
      .where(eq(exchangeRates.tenantId, tenantId))
      .orderBy(desc(exchangeRates.updatedAt));
    return rate;
  }

  async updateExchangeRate(tenantId: string, rates: InsertExchangeRate): Promise<ExchangeRate> {
    const [updatedRate] = await db
      .insert(exchangeRates)
      .values(rates)
      .onConflictDoUpdate({
        target: exchangeRates.tenantId,
        set: { ...rates, updatedAt: new Date() },
      })
      .returning();
    return updatedRate;
  }

  // Activity operations
  async getActivities(tenantId: string, limit: number = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.tenantId, tenantId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Dashboard stats
  async getDashboardStats(tenantId: string): Promise<{
    totalLeads: number;
    activeProperties: number;
    closedDeals: number;
    totalCommission: number;
  }> {
    const [leadsCount] = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.tenantId, tenantId));

    const [propertiesCount] = await db
      .select({ count: count() })
      .from(properties)
      .where(and(eq(properties.tenantId, tenantId), eq(properties.status, "available")));

    const [dealsCount] = await db
      .select({ count: count() })
      .from(deals)
      .where(and(eq(deals.tenantId, tenantId), eq(deals.status, "closed")));

    const [commissionSum] = await db
      .select({ total: sum(deals.agentCommission) })
      .from(deals)
      .where(and(eq(deals.tenantId, tenantId), eq(deals.status, "closed")));

    return {
      totalLeads: leadsCount.count,
      activeProperties: propertiesCount.count,
      closedDeals: dealsCount.count,
      totalCommission: Number(commissionSum.total || 0),
    };
  }
}

export const storage = new DatabaseStorage();
