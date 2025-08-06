import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import ModernSidebar from "@/components/modern-sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Handshake, DollarSign, TrendingUp, ArrowUp } from "lucide-react";
import SalesChart from "@/components/charts/sales-chart";
import LeadSourceChart from "@/components/charts/lead-source-chart";

import { 
  SuperAdminDashboard, 
  AdminDashboard, 
  SupervisorDashboard, 
  SalesDashboard 
} from "@/components/role-based-dashboard";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();



  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/test/dashboard-stats"],
    enabled: isAuthenticated,
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/test/activities"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <ModernSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" subtitle={`Welcome back, ${(user as any)?.firstName || 'User'}! Here's what's happening with your business today.`} />
        

        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100/50">
          {/* Role-Based Dashboard Content */}
          {(user as any)?.role === 'superadmin' && (
            <SuperAdminDashboard stats={stats} activities={activities || []} statsLoading={statsLoading} />
          )}
          
          {(user as any)?.role === 'admin' && (
            <AdminDashboard stats={stats} activities={activities || []} statsLoading={statsLoading} />
          )}
          
          {(user as any)?.role === 'supervisor' && (
            <SupervisorDashboard stats={stats} activities={activities || []} statsLoading={statsLoading} />
          )}
          
          {(user as any)?.role === 'sales' && (
            <SalesDashboard stats={stats} activities={activities || []} statsLoading={statsLoading} />
          )}

          {/* Enhanced Recent Activity for all roles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities && (activities as any[]).length > 0 ? (
                      (activities as any[]).map((activity: any) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-600 mb-2">No recent activity</p>
                        <p className="text-sm text-gray-500">Activity will appear here as you use the system</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span>Quick Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(user as any)?.role === 'superadmin' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Manage Tenants</p>
                            <p className="text-xs text-gray-500">Add or configure tenants</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">System Analytics</p>
                            <p className="text-xs text-gray-500">View platform metrics</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                  
                  {['admin', 'supervisor'].includes((user as any)?.role) && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Team Reports</p>
                            <p className="text-xs text-gray-500">View team performance</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Building className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Properties</p>
                            <p className="text-xs text-gray-500">Manage listings</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                  
                  {(user as any)?.role === 'sales' && (
                    <>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">My Leads</p>
                            <p className="text-xs text-gray-500">View assigned leads</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Handshake className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Active Deals</p>
                            <p className="text-xs text-gray-500">Track your deals</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
