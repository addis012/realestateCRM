import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar,
  Shield,
  Target,
  Award
} from "lucide-react";
import { AddUserModal } from "@/components/modals/add-user-modal";
import { AddTenantModal } from "@/components/modals/add-tenant-modal";

export default function TeamPage() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: isAuthenticated,
  });

  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ["/api/superadmin/tenants"],
    enabled: isAuthenticated && (user as any)?.role === 'superadmin',
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      superadmin: "bg-red-100 text-red-800",
      admin: "bg-blue-100 text-blue-800",
      supervisor: "bg-emerald-100 text-emerald-800",
      sales: "bg-purple-100 text-purple-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, any> = {
      superadmin: Shield,
      admin: Users,
      supervisor: Target,
      sales: Award
    };
    const Icon = icons[role] || Users;
    return <Icon className="h-4 w-4" />;
  };

  const getCreateButton = () => {
    const userRole = (user as any)?.role;
    if (userRole === 'superadmin') {
      return <AddTenantModal />;
    } else if (userRole === 'admin') {
      return (
        <AddUserModal 
          allowedRoles={[{ value: "supervisor", label: "Supervisor" }]}
          triggerText="Add Supervisor"
          title="Create New Supervisor"
        />
      );
    } else if (userRole === 'supervisor') {
      return (
        <AddUserModal 
          allowedRoles={[{ value: "sales", label: "Sales Agent" }]}
          triggerText="Add Sales Agent"
          title="Create New Sales Agent"
        />
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to view the team.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600 mt-2">
            {(user as any)?.role === 'superadmin' 
              ? 'Manage tenants and platform access'
              : (user as any)?.role === 'admin'
              ? 'Manage supervisors and company settings'
              : (user as any)?.role === 'supervisor'
              ? 'Manage your sales team'
              : 'View team information'
            }
          </p>
        </div>
        {getCreateButton()}
      </div>

      {/* SuperAdmin Tenant View */}
      {(user as any)?.role === 'superadmin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Platform Tenants</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tenantsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-300 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tenants && Array.isArray(tenants) && tenants.length > 0 ? (
                  tenants.map((tenant: any) => (
                    <Card key={tenant.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{tenant.name}</h3>
                        <Badge variant={tenant.isActive ? "default" : "secondary"}>
                          {tenant.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {tenant.subdomain}.realestate.com
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tenant.plan} Plan
                        </span>
                        <span>{tenant.userCount} users</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Created: {new Date(tenant.createdAt).toLocaleDateString()}
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tenants created yet</p>
                    <p className="text-sm mt-1">Use the "Create New Tenant" button above to get started</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Team Members View */}
      {(user as any)?.role !== 'superadmin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Members</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {users && Array.isArray(users) ? users.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getRoleColor(member.role)} flex items-center space-x-1`}>
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No team members found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}