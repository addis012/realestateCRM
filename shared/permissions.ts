// Professional SaaS-Ready Role-to-Permission Matrix for Real Estate CRM
// Based on industry-standard multi-tenant access control patterns

export type UserRole = 'superadmin' | 'admin' | 'supervisor' | 'sales';

export interface Permission {
  resource: string;
  action: string;
  scope?: 'all' | 'tenant' | 'team' | 'own' | 'assigned';
}

// Exact mapping from the professional role matrix provided
export const ROLE_FEATURE_MATRIX = {
  // Tenant Management
  'tenant_management': {
    'superadmin': { create: true, edit: true, delete: true, view: 'all' },
    'admin': false,
    'supervisor': false, 
    'sales': false
  },
  
  // Company Branding & Settings
  'company_settings': {
    'superadmin': false,
    'admin': { control: 'full' },
    'supervisor': false,
    'sales': false
  },
  
  // User Management (within company)
  'user_management': {
    'superadmin': false,
    'admin': { create: true, edit: true, delete: true, scope: 'company' },
    'supervisor': false,
    'sales': false
  },
  
  // Lead Management
  'lead_management': {
    'superadmin': { view: 'all_tenants' },
    'admin': { control: 'full', scope: 'company' },
    'supervisor': { control: 'team', assign: true },
    'sales': { view: 'assigned_only', edit: 'assigned_only' }
  },
  
  // Property Listings
  'property_listings': {
    'superadmin': { view: 'all_tenants' },
    'admin': { control: 'full', scope: 'company' },
    'supervisor': { view: 'team', match: true },
    'sales': { view: 'all', match: 'assigned_leads_only' }
  },
  
  // Deals & Commissions
  'deals_commissions': {
    'superadmin': { view: 'all_tenants' },
    'admin': { control: 'full', scope: 'company' },
    'supervisor': { control: 'team', approve: true },
    'sales': { record: 'own', view: 'own_only' }
  },
  
  // Reports & Dashboard  
  'reports_dashboard': {
    'superadmin': { scope: 'all_tenants', export: true },
    'admin': { scope: 'company', export: true },
    'supervisor': { scope: 'team', export: 'team' },
    'sales': { scope: 'own_only', export: false }
  },
  
  // Billing & Subscription
  'billing_subscription': {
    'superadmin': { manage: 'all_tenants' },
    'admin': false,
    'supervisor': false,
    'sales': false
  },
  
  // System Settings
  'system_settings': {
    'superadmin': { manage: 'global' },
    'admin': false,
    'supervisor': false,
    'sales': false
  }
};

// Permission definitions by role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    // Tenant Management - Platform level
    { resource: 'tenants', action: 'create', scope: 'all' },
    { resource: 'tenants', action: 'read', scope: 'all' },
    { resource: 'tenants', action: 'update', scope: 'all' },
    { resource: 'tenants', action: 'delete', scope: 'all' },
    
    // System Settings - Global
    { resource: 'system', action: 'configure', scope: 'all' },
    { resource: 'billing', action: 'manage', scope: 'all' },
    
    // Data Access - All tenants
    { resource: 'leads', action: 'read', scope: 'all' },
    { resource: 'properties', action: 'read', scope: 'all' },
    { resource: 'deals', action: 'read', scope: 'all' },
    { resource: 'users', action: 'read', scope: 'all' },
    { resource: 'reports', action: 'read', scope: 'all' },
  ],

  admin: [
    // Company Settings - Tenant level
    { resource: 'company', action: 'configure', scope: 'tenant' },
    { resource: 'branding', action: 'manage', scope: 'tenant' },
    { resource: 'currency', action: 'set', scope: 'tenant' },
    { resource: 'exchange_rates', action: 'manage', scope: 'tenant' },
    
    // User Management - Within tenant
    { resource: 'users', action: 'create', scope: 'tenant' },
    { resource: 'users', action: 'read', scope: 'tenant' },
    { resource: 'users', action: 'update', scope: 'tenant' },
    { resource: 'users', action: 'delete', scope: 'tenant' },
    
    // Lead Management - Full control within tenant
    { resource: 'leads', action: 'create', scope: 'tenant' },
    { resource: 'leads', action: 'read', scope: 'tenant' },
    { resource: 'leads', action: 'update', scope: 'tenant' },
    { resource: 'leads', action: 'delete', scope: 'tenant' },
    { resource: 'leads', action: 'assign', scope: 'tenant' },
    
    // Property Management - Full control within tenant
    { resource: 'properties', action: 'create', scope: 'tenant' },
    { resource: 'properties', action: 'read', scope: 'tenant' },
    { resource: 'properties', action: 'update', scope: 'tenant' },
    { resource: 'properties', action: 'delete', scope: 'tenant' },
    
    // Deal Management - Full control within tenant
    { resource: 'deals', action: 'create', scope: 'tenant' },
    { resource: 'deals', action: 'read', scope: 'tenant' },
    { resource: 'deals', action: 'update', scope: 'tenant' },
    { resource: 'deals', action: 'approve', scope: 'tenant' },
    
    // Reports - Company wide
    { resource: 'reports', action: 'read', scope: 'tenant' },
    { resource: 'reports', action: 'export', scope: 'tenant' },
    { resource: 'commissions', action: 'read', scope: 'tenant' },
  ],

  supervisor: [
    // Lead Management - Team level
    { resource: 'leads', action: 'read', scope: 'team' },
    { resource: 'leads', action: 'update', scope: 'team' },
    { resource: 'leads', action: 'assign', scope: 'team' },
    
    // Property Management - Read only for team
    { resource: 'properties', action: 'read', scope: 'team' },
    { resource: 'properties', action: 'match', scope: 'team' },
    
    // Deal Management - Team level
    { resource: 'deals', action: 'create', scope: 'team' },
    { resource: 'deals', action: 'read', scope: 'team' },
    { resource: 'deals', action: 'update', scope: 'team' },
    { resource: 'deals', action: 'approve', scope: 'team' },
    
    // Team Management
    { resource: 'team', action: 'manage', scope: 'team' },
    { resource: 'users', action: 'read', scope: 'team' },
    
    // Reports - Team level
    { resource: 'reports', action: 'read', scope: 'team' },
    { resource: 'reports', action: 'export', scope: 'team' },
    { resource: 'commissions', action: 'read', scope: 'team' },
  ],

  sales: [
    // Lead Management - Assigned only
    { resource: 'leads', action: 'read', scope: 'assigned' },
    { resource: 'leads', action: 'update', scope: 'assigned' },
    
    // Property Management - View only
    { resource: 'properties', action: 'read', scope: 'tenant' },
    { resource: 'properties', action: 'match', scope: 'assigned' },
    
    // Deal Management - Own deals only
    { resource: 'deals', action: 'create', scope: 'own' },
    { resource: 'deals', action: 'read', scope: 'own' },
    { resource: 'deals', action: 'update', scope: 'own' },
    
    // Activities - Own only
    { resource: 'activities', action: 'create', scope: 'own' },
    { resource: 'activities', action: 'read', scope: 'own' },
    { resource: 'activities', action: 'update', scope: 'own' },
    
    // Personal Dashboard & Commission
    { resource: 'dashboard', action: 'read', scope: 'own' },
    { resource: 'commissions', action: 'read', scope: 'own' },
  ],
};

// Helper functions for permission checking
export function hasPermission(
  userRole: UserRole, 
  resource: string, 
  action: string, 
  scope?: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(permission => 
    permission.resource === resource && 
    permission.action === action &&
    (!scope || permission.scope === scope || permission.scope === 'all')
  );
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function canAccessResource(
  userRole: UserRole, 
  resource: string, 
  targetScope: 'all' | 'tenant' | 'team' | 'own' | 'assigned' = 'own'
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(permission => 
    permission.resource === resource && 
    (permission.scope === 'all' || permission.scope === targetScope)
  );
}

// Role hierarchy for access control
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'superadmin': 4,
  'admin': 3,
  'supervisor': 2,
  'sales': 1,
};

export function hasHigherRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}