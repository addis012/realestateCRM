import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Shield, Eye, User, Crown } from "lucide-react";

const roleInfo = [
  {
    role: 'superadmin',
    title: 'Super Admin',
    description: 'Platform Owner - Oversees entire SaaS platform and all tenant companies',
    responsibilities: ['Manage all tenants', 'Monitor system health', 'Configure global settings', 'Handle billing & subscriptions'],
    icon: Crown,
    color: 'bg-red-600',
    endpoint: '/api/login/superadmin'
  },
  {
    role: 'admin', 
    title: 'Company Admin',
    description: 'Tenant Owner - Manages company CRM instance and business operations',
    responsibilities: ['Company branding & settings', 'Manage all users', 'Full lead & property access', 'Generate reports'],
    icon: Shield,
    color: 'bg-blue-600',
    endpoint: '/api/login/admin'
  },
  {
    role: 'supervisor',
    title: 'Team Manager',
    description: 'Oversees sales agents, ensuring lead follow-up and team performance',
    responsibilities: ['Manage team leads', 'Assign/reassign leads', 'Track agent performance', 'Approve deals'],
    icon: Eye,
    color: 'bg-emerald-600',
    endpoint: '/api/login/supervisor'
  },
  {
    role: 'sales',
    title: 'Sales Agent',
    description: 'Works directly with assigned leads and property listings to close deals',
    responsibilities: ['Contact assigned leads', 'Present properties', 'Record activities', 'Track commissions'],
    icon: User,
    color: 'bg-purple-600',
    endpoint: '/api/login/sales'
  }
];

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">PrimeRealty CRM</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional Real Estate Customer Relationship Management System
          </p>
        </div>

        {/* Role-based Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roleInfo.map((roleData) => {
            const IconComponent = roleData.icon;
            return (
              <Card key={roleData.role} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${roleData.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {roleData.role.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {roleData.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {roleData.description}
                  </p>
                  <div className="space-y-1">
                    {roleData.responsibilities.slice(0, 2).map((resp, idx) => (
                      <div key={idx} className="text-xs text-gray-500 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {resp}
                      </div>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full ${roleData.color} hover:opacity-90 text-white shadow-md`}
                    onClick={() => window.location.href = roleData.endpoint}
                  >
                    Access {roleData.title} Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Standard Login Form */}
        <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              User Login
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Enter your credentials to access your assigned role
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              Sign In
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Your role and permissions are automatically assigned based on your account
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}