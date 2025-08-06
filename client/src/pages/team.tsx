import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Ban, UserPlus, Users } from "lucide-react";
import InviteUserModal from "@/components/modals/invite-user-modal";

export default function Team() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      case "supervisor":
        return "bg-blue-100 text-blue-800";
      case "sales":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIndicator = (isActive: boolean) => {
    return isActive ? "bg-green-400" : "bg-red-400";
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Mock team data for display - in real app this would come from API
  const teamMembers = [
    {
      id: "1",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@primerealty.com",
      role: "sales",
      isActive: true,
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      performance: { deals: 8, target: 10 },
      commission: 24680,
      lastActive: "2 hours ago"
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@primerealty.com",
      role: "supervisor",
      isActive: true,
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b494?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      performance: { team: 5, achievement: 92 },
      commission: 18240,
      lastActive: "1 hour ago"
    },
    {
      id: "3",
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@primerealty.com",
      role: "sales",
      isActive: true,
      profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      performance: { deals: 5, target: 10 },
      commission: 15750,
      lastActive: "5 hours ago"
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Team Management" 
          subtitle="Manage team members and their performance."
          onAddNew={() => setShowInviteModal(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Management</CardTitle>
                <Button onClick={() => setShowInviteModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {teamMembers && teamMembers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={member.profileImageUrl} 
                                alt="Team Member" 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(member.role)}>
                              {member.role === "sales" ? "Sales Agent" : 
                               member.role === "supervisor" ? "Supervisor" :
                               member.role === "admin" ? "Admin" : "Superadmin"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.role === "sales" ? (
                              <div>
                                <div className="text-sm text-gray-900">
                                  {member.performance.deals} deals closed
                                </div>
                                <div className="text-sm text-gray-500">
                                  Target: {member.performance.target}/month
                                </div>
                              </div>
                            ) : member.role === "supervisor" ? (
                              <div>
                                <div className="text-sm text-gray-900">
                                  Team of {member.performance.team} agents
                                </div>
                                <div className="text-sm text-gray-500">
                                  {member.performance.achievement}% target achievement
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">Management role</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-semibold text-success">
                              ${member.commission.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">This month</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 ${getStatusIndicator(member.isActive)} rounded-full mr-2`}></div>
                              <span className="text-sm text-gray-900">{member.lastActive}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                  <p className="text-gray-500 mb-4">Start building your team by inviting users</p>
                  <Button onClick={() => setShowInviteModal(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite First User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <InviteUserModal 
        open={showInviteModal} 
        onOpenChange={setShowInviteModal}
      />
    </div>
  );
}
