import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, Eye, User } from "lucide-react";

const roles = [
  { value: "superadmin", label: "Super Admin", icon: Crown, description: "Full system access" },
  { value: "admin", label: "Admin", icon: Shield, description: "Management access" },
  { value: "supervisor", label: "Supervisor", icon: Eye, description: "Team oversight" },
  { value: "sales", label: "Sales Agent", icon: User, description: "Sales focused" },
];

export default function RoleSwitcher() {
  const [selectedRole, setSelectedRole] = useState("admin");

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // Store the role in localStorage and reload to simulate role switch
    localStorage.setItem('demo-role', role);
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Demo: Switch User Role</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Switch between different user roles to see how the dashboard changes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Role:
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex items-center space-x-2">
                    <role.icon className="h-4 w-4" />
                    <span>{role.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          {roles.map((role) => (
            <div key={role.value} className={`p-3 rounded-lg border ${
              selectedRole === role.value ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <role.icon className="h-4 w-4" />
                <div>
                  <div className="font-medium text-sm">{role.label}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={() => handleRoleChange(selectedRole)} 
          className="w-full"
        >
          Switch to {roles.find(r => r.value === selectedRole)?.label}
        </Button>
      </CardContent>
    </Card>
  );
}