import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Building, 
  Handshake, 
  UserCheck, 
  DollarSign,
  Settings,
  HelpCircle,
  ChevronDown,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    badge: null,
    description: "Overview and analytics"
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
    badge: "24",
    description: "Manage potential clients"
  },
  {
    name: "Properties",
    href: "/properties",
    icon: Building,
    badge: "8",
    description: "Property listings"
  },
  {
    name: "Deals",
    href: "/deals",
    icon: Handshake,
    badge: null,
    description: "Active transactions"
  },
  {
    name: "Team",
    href: "/team",
    icon: UserCheck,
    badge: null,
    description: "Team management"
  },
  {
    name: "Exchange Rates",
    href: "/exchange-rates",
    icon: DollarSign,
    badge: null,
    description: "Currency management"
  }
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings"
  },
  {
    name: "Help & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Get assistance"
  }
];

export default function ModernSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">RealEstate CRM</h1>
            <p className="text-xs text-slate-400">Professional Edition</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {(user as any)?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {(user as any)?.firstName} {(user as any)?.lastName}
            </p>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={`text-xs border-0 ${
                  (user as any)?.role === 'superadmin' ? 'bg-red-600 text-white hover:bg-red-700' :
                  (user as any)?.role === 'admin' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                  (user as any)?.role === 'supervisor' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                  'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {(user as any)?.role || 'Sales'}
              </Badge>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Main Menu
          </h2>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  location === item.href
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    location === item.href
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-slate-700 space-y-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Support
        </h2>
        {bottomNavigation.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location === item.href
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-xs text-slate-400">
            © 2025 RealEstate CRM
          </p>
          <p className="text-xs text-slate-500 mt-1">
            v2.1.0 • Open Source
          </p>
        </div>
      </div>
    </div>
  );
}