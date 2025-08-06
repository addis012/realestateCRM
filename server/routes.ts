import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeadSchema, insertPropertySchema, insertDealSchema, insertExchangeRateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - temporarily disabled for demo
  // await setupAuth(app);

  // Auth routes - mock different users for demo based on query parameter
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Mock different user roles for demo
      const roleParam = req.query.role || 'admin';
      
      const mockUsers = {
        superadmin: {
          id: '1',
          firstName: 'Super',
          lastName: 'Admin',
          email: 'superadmin@primerealty.com',
          role: 'superadmin',
          profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        },
        admin: {
          id: '2',
          firstName: 'John',
          lastName: 'Anderson',
          email: 'admin@primerealty.com',
          role: 'admin',
          profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        },
        supervisor: {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'supervisor@primerealty.com',
          role: 'supervisor',
          profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        },
        sales: {
          id: '4',
          firstName: 'Mike',
          lastName: 'Davis',
          email: 'sales@primerealty.com',
          role: 'sales',
          profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        }
      };
      
      const user = mockUsers[roleParam as keyof typeof mockUsers] || mockUsers.admin;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Temporary test endpoint to bypass auth during development
  app.get('/api/test/dashboard-stats', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats('tenant-1');
      res.json(stats);
    } catch (error) {
      console.error("Error fetching test dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch test dashboard stats" });
    }
  });

  app.get('/api/test/leads', async (req, res) => {
    try {
      const leads = await storage.getLeads('tenant-1');
      res.json(leads);
    } catch (error) {
      console.error("Error fetching test leads:", error);
      res.status(500).json({ message: "Failed to fetch test leads" });
    }
  });

  app.get('/api/test/properties', async (req, res) => {
    try {
      const properties = await storage.getProperties('tenant-1');
      res.json(properties);
    } catch (error) {
      console.error("Error fetching test properties:", error);
      res.status(500).json({ message: "Failed to fetch test properties" });
    }
  });

  app.get('/api/test/deals', async (req, res) => {
    try {
      const deals = await storage.getDeals('tenant-1');
      res.json(deals);
    } catch (error) {
      console.error("Error fetching test deals:", error);
      res.status(500).json({ message: "Failed to fetch test deals" });
    }
  });

  app.get('/api/test/exchange-rates', async (req, res) => {
    try {
      const rates = await storage.getExchangeRate('tenant-1');
      res.json(rates);
    } catch (error) {
      console.error("Error fetching test exchange rates:", error);
      res.status(500).json({ message: "Failed to fetch test exchange rates" });
    }
  });

  app.get('/api/test/activities', async (req, res) => {
    try {
      const activities = await storage.getActivities('tenant-1');
      res.json(activities);
    } catch (error) {
      console.error("Error fetching test activities:", error);
      res.status(500).json({ message: "Failed to fetch test activities" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const stats = await storage.getDashboardStats('tenant-1');
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Lead management routes
  app.get('/api/leads', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const { status, assignedTo } = req.query;
      const filters = { status, assignedTo };
      const leads = await storage.getLeads('tenant-1', filters);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post('/api/leads', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant and user
      const mockUserId = '1';
      const mockTenantId = 'tenant-1';

      const validatedData = insertLeadSchema.parse({
        ...req.body,
        tenantId: mockTenantId,
        createdBy: mockUserId,
      });

      const lead = await storage.createLead(validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: mockTenantId,
        userId: mockUserId,
        entityType: "lead",
        entityId: lead.id,
        action: "created",
        description: `Lead ${lead.name} was created`,
      });

      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  app.put('/api/leads/:id', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant and user
      const mockUserId = '1';
      const mockTenantId = 'tenant-1';

      const { id } = req.params;
      const validatedData = insertLeadSchema.partial().parse(req.body);

      const lead = await storage.updateLead(id, mockTenantId, validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: mockTenantId,
        userId: mockUserId,
        entityType: "lead",
        entityId: lead.id,
        action: "updated",
        description: `Lead ${lead.name} was updated`,
      });

      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  app.delete('/api/leads/:id', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const mockTenantId = 'tenant-1';

      const { id } = req.params;
      await storage.deleteLead(id, mockTenantId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Property management routes
  app.get('/api/properties', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const { type, location, status } = req.query;
      const filters = { type, location, status };
      const properties = await storage.getProperties('tenant-1', filters);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post('/api/properties', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant and user
      const mockUserId = '1';
      const mockTenantId = 'tenant-1';

      const validatedData = insertPropertySchema.parse({
        ...req.body,
        tenantId: mockTenantId,
        createdBy: mockUserId,
      });

      const property = await storage.createProperty(validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: mockTenantId,
        userId: mockUserId,
        entityType: "property",
        entityId: property.id,
        action: "created",
        description: `Property ${property.title} was listed`,
      });

      res.status(201).json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put('/api/properties/:id', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const mockTenantId = 'tenant-1';

      const { id } = req.params;
      const validatedData = insertPropertySchema.partial().parse(req.body);

      const property = await storage.updateProperty(id, mockTenantId, validatedData);
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Deal management routes
  app.get('/api/deals', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const { status, agentId } = req.query;
      const filters = { status, agentId };
      const deals = await storage.getDeals('tenant-1', filters);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.post('/api/deals', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant and user
      const mockUserId = '1';
      const mockTenantId = 'tenant-1';

      const validatedData = insertDealSchema.parse({
        ...req.body,
        tenantId: mockTenantId,
        createdBy: mockUserId,
      });

      const deal = await storage.createDeal(validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: mockTenantId,
        userId: mockUserId,
        entityType: "deal",
        entityId: deal.id,
        action: "created",
        description: `Deal worth $${deal.salePrice} was recorded`,
      });

      res.status(201).json(deal);
    } catch (error) {
      console.error("Error creating deal:", error);
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  // Exchange rate routes
  app.get('/api/exchange-rates', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const rate = await storage.getExchangeRate('tenant-1');
      res.json(rate || { buyRate: "158", sellRate: "179" });
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
  });

  app.put('/api/exchange-rates', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant and user
      const mockUserId = '1';
      const mockTenantId = 'tenant-1';

      const validatedData = insertExchangeRateSchema.parse({
        ...req.body,
        tenantId: mockTenantId,
        updatedBy: mockUserId,
      });

      const rate = await storage.updateExchangeRate(mockTenantId, validatedData);
      res.json(rate);
    } catch (error) {
      console.error("Error updating exchange rates:", error);
      res.status(500).json({ message: "Failed to update exchange rates" });
    }
  });

  // Activity log
  app.get('/api/activities', async (req: any, res) => {
    try {
      // Mock user data for demo - using fixed tenant
      const activities = await storage.getActivities('tenant-1', 20);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
