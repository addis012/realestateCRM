import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeadSchema, insertPropertySchema, insertDealSchema, insertExchangeRateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const stats = await storage.getDashboardStats(user.tenantId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Lead management routes
  app.get('/api/leads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const { status, assignedTo } = req.query;
      const filters = { status, assignedTo };
      const leads = await storage.getLeads(user.tenantId, filters);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post('/api/leads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const validatedData = insertLeadSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
        createdBy: userId,
      });

      const lead = await storage.createLead(validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: user.tenantId,
        userId,
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

  app.put('/api/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const { id } = req.params;
      const validatedData = insertLeadSchema.partial().parse(req.body);

      const lead = await storage.updateLead(id, user.tenantId, validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: user.tenantId,
        userId,
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

  app.delete('/api/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const { id } = req.params;
      await storage.deleteLead(id, user.tenantId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Property management routes
  app.get('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const { type, location, status } = req.query;
      const filters = { type, location, status };
      const properties = await storage.getProperties(user.tenantId, filters);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const validatedData = insertPropertySchema.parse({
        ...req.body,
        tenantId: user.tenantId,
        createdBy: userId,
      });

      const property = await storage.createProperty(validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: user.tenantId,
        userId,
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

  app.put('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const { id } = req.params;
      const validatedData = insertPropertySchema.partial().parse(req.body);

      const property = await storage.updateProperty(id, user.tenantId, validatedData);
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Deal management routes
  app.get('/api/deals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const { status, agentId } = req.query;
      const filters = { status, agentId };
      const deals = await storage.getDeals(user.tenantId, filters);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.post('/api/deals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const validatedData = insertDealSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
        createdBy: userId,
      });

      const deal = await storage.createDeal(validatedData);
      
      // Log activity
      await storage.createActivity({
        tenantId: user.tenantId,
        userId,
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
  app.get('/api/exchange-rates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const rate = await storage.getExchangeRate(user.tenantId);
      res.json(rate || { buyRate: "158", sellRate: "179" });
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
  });

  app.put('/api/exchange-rates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const validatedData = insertExchangeRateSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
        updatedBy: userId,
      });

      const rate = await storage.updateExchangeRate(user.tenantId, validatedData);
      res.json(rate);
    } catch (error) {
      console.error("Error updating exchange rates:", error);
      res.status(500).json({ message: "Failed to update exchange rates" });
    }
  });

  // Activity log
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with a tenant" });
      }

      const activities = await storage.getActivities(user.tenantId, 20);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
