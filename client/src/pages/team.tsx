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

  const { data: tenants } = useQuery({
    queryKey: ["/api/superadmin/tenants"],
    enabled: isAuthenticated && user?.role === 'superadmin',
  });

  const getRoleColor = (role: string) => {
    const colors = {
      superadmin: "bg-red-100 text-red-800",
      admin: "bg-blue-100 text-blue-800",
      supervisor: "bg-emerald-100 text-emerald-800",
      sales: "bg-purple-100 text-purple-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      superadmin: Shield,
      admin: Users,
      supervisor: Target,
      sales: Award
    };
    const Icon = icons[role] || Users;
    return <Icon className="h-4 w-4" />;
  };

  const getCreateButton = () => {
    if (user?.role === 'superadmin') {
      return <AddTenantModal />;
    } else if (user?.role === 'admin') {
      return (
        <AddUserModal 
          allowedRoles={[{ value: "supervisor", label: "Supervisor" }]}
          triggerText="Add Supervisor"
          title="Create New Supervisor"
        />
      );
    } else if (user?.role === 'supervisor') {
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
            {user?.role === 'superadmin' 
              ? 'Manage tenants and platform access'
              : user?.role === 'admin'
              ? 'Manage supervisors and company settings'
              : user?.role === 'supervisor'
              ? 'Manage your sales team'
              : 'View team information'
            }
          </p>
        </div>
        {getCreateButton()}
      </div>

      {/* SuperAdmin Tenant View */}
      {user?.role === 'superadmin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Platform Tenants</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenants?.map((tenant: any) => (
                <Card key={tenant.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{tenant.name}</h3>
                    <Badge variant={tenant.isActive ? "default" : "secondary"}>
                      {tenant.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {tenant.subdomain}.realestate.com
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{tenant.plan} Plan</span>
                    <span>{tenant.userCount} users</span>
                  </div>
                </Card>
              )) || (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No tenants available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members View */}
      {user?.role !== 'superadmin' && (
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
                {users?.map((member: any) => (
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
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    No team members found
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