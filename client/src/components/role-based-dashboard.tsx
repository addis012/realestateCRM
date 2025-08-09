import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  Handshake, 
  DollarSign, 
  TrendingUp, 
  ArrowUp, 
  Shield, 
  UserCheck, 
  BarChart3,
  Settings,
  Target,
  Award,
  Clock
} from "lucide-react";
import SalesChart from "@/components/charts/sales-chart";
import LeadSourceChart from "@/components/charts/lead-source-chart";
import { AddTenantModal } from "./modals/add-tenant-modal";
import { AddUserModal } from "./modals/add-user-modal";

interface DashboardProps {
  stats: any;
  activities: any[];
  statsLoading: boolean;
}

export function SuperAdminDashboard({ stats, activities, statsLoading }: DashboardProps) {
  return (
    <>
      {/* SuperAdmin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-red-600 to-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-red-100 mb-2">Total Tenants</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.totalTenants || 15}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">5% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-2">Platform Revenue</p>
                {statsLoading ? (
                  <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">${stats?.platformRevenue?.toLocaleString() || '125,000'}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">18% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-emerald-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-emerald-100 mb-2">System Health</p>
                {statsLoading ? (
                  <div className="h-9 w-16 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">99.8%</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Excellent uptime</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-purple-100 mb-2">Active Users</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.activeUsers || 1247}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">22% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SuperAdmin Platform Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Platform Administration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              data-testid="button-global-settings"
              onClick={() => window.alert('Global System Settings - Coming Soon')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Global System Settings
            </Button>
            <AddTenantModal />
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              data-testid="button-billing-management"
              onClick={() => window.alert('Billing Management - Coming Soon')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Subscription & Billing
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              data-testid="button-platform-analytics"
              onClick={() => window.alert('Platform Analytics - Coming Soon')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Platform Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Platform Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function AdminDashboard({ stats, activities, statsLoading }: DashboardProps) {
  return (
    <>
      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-2">Total Leads</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.totalLeads || 0}</p>
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
                <p className="text-sm font-medium text-emerald-100 mb-2">Properties</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.activeProperties || 0}</p>
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
                <p className="text-sm font-medium text-amber-100 mb-2">Team Members</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.teamMembers || 12}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">2 new this month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-purple-100 mb-2">Revenue</p>
                {statsLoading ? (
                  <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">${stats?.totalCommission?.toLocaleString() || "0"}</p>
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

      {/* Admin Company Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Company Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" data-testid="button-company-settings">
              <Settings className="h-4 w-4 mr-2" />
              Company Settings & Branding
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-currency-settings">
              <DollarSign className="h-4 w-4 mr-2" />
              Currency & Exchange Rates
            </Button>
            <AddUserModal 
              allowedRoles={[{ value: "supervisor", label: "Supervisor" }]}
              triggerText="Add Supervisor"
              title="Create New Supervisor"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <span>Company Reports & Analytics</span>
              </div>
              <Button variant="outline" size="sm" data-testid="button-export-reports">
                Export Data
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="justify-start" variant="ghost" data-testid="button-lead-reports">
                <Users className="h-4 w-4 mr-2" />
                Lead Performance
              </Button>
              <Button className="justify-start" variant="ghost" data-testid="button-property-reports">
                <Building className="h-4 w-4 mr-2" />
                Property Analytics  
              </Button>
              <Button className="justify-start" variant="ghost" data-testid="button-commission-reports">
                <DollarSign className="h-4 w-4 mr-2" />
                Commission Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Sales Performance</span>
              </div>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm">
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
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span>Lead Sources</span>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeadSourceChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function SupervisorDashboard({ stats, activities, statsLoading }: DashboardProps) {
  return (
    <>
      {/* Supervisor Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-2">Team Leads</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.teamLeads || 45}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">8% from last week</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-emerald-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-emerald-100 mb-2">Conversion Rate</p>
                {statsLoading ? (
                  <div className="h-9 w-16 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">24.5%</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">3.2% increase</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-600 to-orange-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-amber-100 mb-2">Team Performance</p>
                {statsLoading ? (
                  <div className="h-9 w-16 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">92%</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Above target</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-purple-100 mb-2">Team Revenue</p>
                {statsLoading ? (
                  <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">${stats?.teamRevenue?.toLocaleString() || "85,420"}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">18% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supervisor Team Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Team Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" data-testid="button-assign-leads">
              <Users className="h-4 w-4 mr-2" />
              Assign/Reassign Leads
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-approve-deals">
              <Handshake className="h-4 w-4 mr-2" />
              Review & Approve Deals
            </Button>
            <AddUserModal 
              allowedRoles={[{ value: "sales", label: "Sales Agent" }]}
              triggerText="Add Sales Agent"
              title="Create New Sales Agent"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>Team Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function SalesDashboard({ stats, activities, statsLoading }: DashboardProps) {
  return (
    <>
      {/* Sales Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-2">My Leads</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.myLeads || 12}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">3 new this week</span>
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
                <p className="text-sm font-medium text-emerald-100 mb-2">Active Deals</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.activeDeals || 5}</p>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">2 closing soon</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Handshake className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-600 to-orange-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-amber-100 mb-2">This Month</p>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">{stats?.closedDeals || 3}</p>
                )}
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Deals closed</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-purple-100 mb-2">My Commission</p>
                {statsLoading ? (
                  <div className="h-9 w-24 bg-white/20 rounded animate-pulse mb-3"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mb-3">${stats?.myCommission?.toLocaleString() || "8,450"}</p>
                )}
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">$2,100 pending</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>My Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeadSourceChart />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" data-testid="button-update-leads">
              <Users className="h-4 w-4 mr-2" />
              Update My Leads
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-record-activity">
              <Clock className="h-4 w-4 mr-2" />
              Record Activity
            </Button>
            <Button className="w-full justify-start" variant="outline" data-testid="button-close-deal">
              <Handshake className="h-4 w-4 mr-2" />
              Submit Deal for Approval
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}