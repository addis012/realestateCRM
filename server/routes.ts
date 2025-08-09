import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeadSchema, insertPropertySchema, insertDealSchema, insertExchangeRateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - temporarily disabled for demo
  // await setupAuth(app);

  // Login endpoints for different roles - professional access control
  app.get('/api/login/superadmin', (req: any, res) => {
    req.session.userRole = 'superadmin';
    req.session.userId = '1';
    res.redirect('/superadmin');
  });

  app.get('/api/login/admin', (req: any, res) => {
    req.session.userRole = 'admin';
    req.session.userId = '2';
    res.redirect('/admin');
  });

  app.get('/api/login/supervisor', (req: any, res) => {
    req.session.userRole = 'supervisor';
    req.session.userId = '3';
    res.redirect('/supervisor');
  });

  app.get('/api/login/sales', (req: any, res) => {
    req.session.userRole = 'sales';
    req.session.userId = '4';
    res.redirect('/sales');
  });

  // Auth routes - return user based on session/authentication
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // In a real system, this would get user from session/JWT token
      // Role is determined by user's assigned permissions in database
      
      const mockUsers = {
        superadmin: {
          id: '1',
          firstName: 'Platform',
          lastName: 'Admin',
          email: 'superadmin@crmsaas.com',
          role: 'superadmin',
          tenantId: null, // Access to all tenants
          company: 'SaaS Platform',
          permissions: ['manage_all_tenants', 'system_config', 'billing_management'],
          profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        },
        admin: {
          id: '2',
          firstName: 'John',
          lastName: 'Anderson',
          email: 'admin@primerealty.com',
          role: 'admin',
          tenantId: 'tenant-1',
          company: 'PrimeRealty',
          permissions: ['manage_company', 'manage_users', 'full_access_leads_properties'],
          profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        },
        supervisor: {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'supervisor@primerealty.com',
          role: 'supervisor',
          tenantId: 'tenant-1',
          company: 'PrimeRealty',
          teamId: 'team-sales-west',
          permissions: ['manage_team_leads', 'assign_leads', 'approve_deals', 'team_reports'],
          profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        },
        sales: {
          id: '4',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@primerealty.com',
          role: 'sales',
          tenantId: 'tenant-1',
          company: 'PrimeRealty',
          teamId: 'team-sales-west',
          supervisorId: '3',
          permissions: ['manage_assigned_leads', 'record_activities', 'close_deals', 'view_own_commission'],
          profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40'
        }
      };
      
      // Get user role from session or default to admin
      const sessionRole = (req as any).session?.userRole || 'admin';
      const sessionUserId = (req as any).session?.userId || '2';
      
      console.log('Session data:', { userRole: sessionRole, userId: sessionUserId });
      
      const user = mockUsers[sessionRole as keyof typeof mockUsers] || mockUsers.admin;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Temporary test endpoint to bypass auth during development
  app.get('/api/test/dashboard-stats', async (req: any, res) => {
    try {
      const userRole = req.session?.userRole || 'sales';
      
      // SuperAdmin gets platform stats only - NO ACCESS to tenant business data
      if (userRole === 'superadmin') {
        const stats = {
          totalTenants: 15,
          activeTenants: 12, 
          platformRevenue: 125000,
          activeUsers: 1247,
          monthlyGrowth: 18,
          systemHealth: 99.8,
          storageUsed: 2.5,
          apiCalls: 45600,
          uptime: 99.95
        };
        res.json(stats);
      } else {
        // Other roles get tenant-specific stats
        const stats = await storage.getDashboardStats('tenant-1');
        res.json(stats);
      }
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

  // Dashboard stats - role-based data access
  app.get('/api/dashboard/stats', async (req: any, res) => {
    try {
      const userRole = req.session?.userRole || 'sales';
      
      // SuperAdmin gets platform stats only, no tenant business data
      if (userRole === 'superadmin') {
        const stats = {
          totalTenants: 15,
          activeTenants: 12,
          platformRevenue: 125000,
          activeUsers: 1247,
          monthlyGrowth: 18,
          systemHealth: 99.8,
          storageUsed: 2.5,
          apiCalls: 45600,
          uptime: 99.95
        };
        res.json(stats);
      } else {
        // Other roles get tenant-specific stats
        const stats = await storage.getDashboardStats('tenant-1');
        res.json(stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // SuperAdmin Platform Management Routes
  app.get('/api/superadmin/platform-stats', async (req: any, res) => {
    try {
      // Platform-level aggregated statistics (no individual tenant data)
      const stats = {
        totalTenants: 15,
        activeTenants: 12,
        platformRevenue: 125000,
        monthlyGrowth: 18,
        systemHealth: 99.8,
        storageUsed: 2.5, // GB
        apiCalls: 45600,
        uptime: 99.95
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

  app.get('/api/superadmin/tenants', async (req: any, res) => {
    try {
      // Basic tenant information only (no business data)
      const tenants = [
        {
          id: 'tenant-1',
          name: 'PrimeRealty',
          subdomain: 'primerealty',
          isActive: true,
          createdAt: '2024-01-15',
          plan: 'Professional',
          userCount: 12
        },
        {
          id: 'tenant-2', 
          name: 'UrbanProperties',
          subdomain: 'urbanprops',
          isActive: true,
          createdAt: '2024-02-20',
          plan: 'Enterprise',
          userCount: 25
        }
      ];
      res.json(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });

  app.post('/api/superadmin/tenants', async (req: any, res) => {
    try {
      const { name, subdomain, plan } = req.body;
      
      // Create new tenant
      const newTenant = {
        id: `tenant-${Date.now()}`,
        name,
        subdomain,
        plan: plan || 'Basic',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        userCount: 0
      };
      
      res.status(201).json(newTenant);
    } catch (error) {
      console.error("Error creating tenant:", error);
      res.status(500).json({ message: "Failed to create tenant" });
    }
  });

  app.get('/api/superadmin/system-settings', async (req: any, res) => {
    try {
      const settings = {
        maintenanceMode: false,
        maxTenantsPerPlan: {
          basic: 100,
          professional: 500,
          enterprise: 1000
        },
        apiRateLimit: 1000,
        storageLimit: 10, // GB per tenant
        backupFrequency: 'daily'
      };
      res.json(settings);
    } catch (error) {
      console.error("Error fetching system settings:", error);
      res.status(500).json({ message: "Failed to fetch system settings" });
    }
  });

  app.put('/api/superadmin/system-settings', async (req: any, res) => {
    try {
      // Update system settings
      const settings = req.body;
      res.json({ message: "System settings updated successfully", settings });
    } catch (error) {
      console.error("Error updating system settings:", error);
      res.status(500).json({ message: "Failed to update system settings" });
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
