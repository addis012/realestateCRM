import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["superadmin", "admin", "supervisor", "sales"]);

// Lead status enum
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "lost", "closed"]);

// Property status enum
export const propertyStatusEnum = pgEnum("property_status", ["available", "pending", "sold", "inactive"]);

// Property type enum
export const propertyTypeEnum = pgEnum("property_type", ["house", "condo", "apartment", "commercial", "land"]);

// Deal status enum
export const dealStatusEnum = pgEnum("deal_status", ["pending", "closed", "cancelled"]);

// Tenants table (SaaS multi-tenancy)
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subdomain: varchar("subdomain").unique(),
  customDomain: varchar("custom_domain"),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color").default("#2563EB"),
  secondaryColor: varchar("secondary_color").default("#64748B"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("sales"),
  tenantId: varchar("tenant_id").references(() => tenants.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exchange rates table
export const exchangeRates = pgTable("exchange_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  buyRate: decimal("buy_rate", { precision: 10, scale: 2 }).notNull(), // Company buys USD
  sellRate: decimal("sell_rate", { precision: 10, scale: 2 }).notNull(), // Company sells USD
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  location: text("location"),
  propertyType: propertyTypeEnum("property_type"),
  status: leadStatusEnum("status").default("new"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  notes: text("notes"),
  source: text("source"), // Website, Referral, etc.
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description"),
  type: propertyTypeEnum("type").notNull(),
  location: text("location").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  squareFeet: integer("square_feet"),
  imageUrl: text("image_url"),
  status: propertyStatusEnum("status").default("available"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deals table
export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(),
  commissionPercentage: decimal("commission_percentage", { precision: 5, scale: 2 }).notNull(),
  agentCommission: decimal("agent_commission", { precision: 12, scale: 2 }).notNull(),
  companyCommission: decimal("company_commission", { precision: 12, scale: 2 }).notNull(),
  status: dealStatusEnum("status").default("pending"),
  dealDate: timestamp("deal_date"),
  agentId: varchar("agent_id").references(() => users.id),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity log table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  userId: varchar("user_id").references(() => users.id),
  entityType: varchar("entity_type").notNull(), // 'lead', 'property', 'deal'
  entityId: varchar("entity_id").notNull(),
  action: text("action").notNull(), // 'created', 'updated', 'called', 'emailed'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  leads: many(leads),
  properties: many(properties),
  deals: many(deals),
  exchangeRates: many(exchangeRates),
  activities: many(activities),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  assignedLeads: many(leads, { relationName: "assignedLeads" }),
  createdLeads: many(leads, { relationName: "createdLeads" }),
  createdProperties: many(properties),
  createdDeals: many(deals),
  agentDeals: many(deals, { relationName: "agentDeals" }),
  activities: many(activities),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [leads.tenantId],
    references: [tenants.id],
  }),
  assignedTo: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
    relationName: "assignedLeads",
  }),
  createdBy: one(users, {
    fields: [leads.createdBy],
    references: [users.id],
    relationName: "createdLeads",
  }),
  deals: many(deals),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [properties.tenantId],
    references: [tenants.id],
  }),
  createdBy: one(users, {
    fields: [properties.createdBy],
    references: [users.id],
  }),
  deals: many(deals),
}));

export const dealsRelations = relations(deals, ({ one }) => ({
  tenant: one(tenants, {
    fields: [deals.tenantId],
    references: [tenants.id],
  }),
  property: one(properties, {
    fields: [deals.propertyId],
    references: [properties.id],
  }),
  lead: one(leads, {
    fields: [deals.leadId],
    references: [leads.id],
  }),
  agent: one(users, {
    fields: [deals.agentId],
    references: [users.id],
    relationName: "agentDeals",
  }),
  createdBy: one(users, {
    fields: [deals.createdBy],
    references: [users.id],
  }),
}));

export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
  tenant: one(tenants, {
    fields: [exchangeRates.tenantId],
    references: [tenants.id],
  }),
  updatedBy: one(users, {
    fields: [exchangeRates.updatedBy],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  tenant: one(tenants, {
    fields: [activities.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  budget: z.union([
    z.string().optional(),
    z.number().transform(n => n.toString()).optional()
  ]).optional(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  price: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
  bedrooms: z.union([
    z.number().optional(),
    z.string().transform(s => parseInt(s)).optional()
  ]).optional(),
  bathrooms: z.union([
    z.number().optional(),
    z.string().transform(s => parseInt(s)).optional()
  ]).optional(),
  squareFeet: z.union([
    z.number().optional(),
    z.string().transform(s => parseInt(s)).optional()
  ]).optional(),
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  salePrice: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
  commissionPercentage: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
  agentCommission: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
  companyCommission: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  buyRate: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
  sellRate: z.union([
    z.string(),
    z.number().transform(n => n.toString())
  ]),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
