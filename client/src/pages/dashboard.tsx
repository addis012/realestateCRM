import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import ModernSidebar from "@/components/modern-sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Handshake, DollarSign, TrendingUp, ArrowUp } from "lucide-react";
import SalesChart from "@/components/charts/sales-chart";
import LeadSourceChart from "@/components/charts/lead-source-chart";
import RoleSwitcher from "@/components/role-switcher";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

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
        
        {/* Role Switcher for Demo */}
        {(user as any)?.role === 'admin' && (
          <div className="mb-6">
            <RoleSwitcher />
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100/50">
          {/* Enhanced Stats Cards with Skeleton Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium text-blue-100 mb-2">Total Leads</p>
                    {statsLoading ? (
                      <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                    ) : (
                      <p className="text-3xl font-bold text-white mb-3">
                        {(stats as any)?.totalLeads || 0}
                      </p>
                    )}
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">12% from last month</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-emerald-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium text-emerald-100 mb-2">Active Properties</p>
                    {statsLoading ? (
                      <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                    ) : (
                      <p className="text-3xl font-bold text-white mb-3">
                        {(stats as any)?.activeProperties || 0}
                      </p>
                    )}
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">8% from last month</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-600 to-orange-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium text-amber-100 mb-2">Closed Deals</p>
                    {statsLoading ? (
                      <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                    ) : (
                      <p className="text-3xl font-bold text-white mb-3">
                        {(stats as any)?.closedDeals || 0}
                      </p>
                    )}
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">23% from last month</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium text-purple-100 mb-2">Total Commission</p>
                    {statsLoading ? (
                      <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-3"></div>
                    ) : (
                      <p className="text-3xl font-bold text-white mb-3">
                        ${(stats as any)?.totalCommission?.toLocaleString() || "0"}
                      </p>
                    )}
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">15% from last month</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Sales Performance</span>
                  </div>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Last 6 months</option>
                    <option>Last 12 months</option>
                  </select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <span>Lead Sources</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadSourceChart />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">No performance data yet</p>
                    <p className="text-sm text-gray-500">Performance metrics will appear here as deals are closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
