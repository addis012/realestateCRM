import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Users, 
  Building, 
  Handshake, 
  UserCheck, 
  TrendingUp,
  ArrowLeftRight,
  Palette,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Lead Management", href: "/leads", icon: Users },
  { name: "Properties", href: "/properties", icon: Building },
  { name: "Deals & Commission", href: "/deals", icon: Handshake },
  { name: "Team Management", href: "/team", icon: UserCheck },
  { name: "Reports & Analytics", href: "/reports", icon: TrendingUp },
];

const settings = [
  { name: "Exchange Rates", href: "/exchange-rates", icon: ArrowLeftRight },
  { name: "Branding", href: "/branding", icon: Palette },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Prime Realty</h1>
            <p className="text-xs text-gray-500">{user?.role || "Admin"} Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <div className="px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                    }
                  `}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.name === "Lead Management" && (
                      <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                        24
                      </span>
                    )}
                    {item.name === "Properties" && (
                      <span className="ml-auto bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                        156
                      </span>
                    )}
                    {item.name === "Deals & Commission" && (
                      <span className="ml-auto bg-success text-white text-xs px-2 py-1 rounded-full">
                        8
                      </span>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 px-3">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settings
          </h3>
          <div className="mt-2 space-y-1">
            {settings.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                    }
                  `}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
            alt="User Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName || "John"} {user?.lastName || "Anderson"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@primerealty.com"}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
