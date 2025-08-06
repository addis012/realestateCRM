import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ModernSidebar from "@/components/modern-sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, DollarSign, Percent, Plus, Handshake } from "lucide-react";
import AddDealModal from "@/components/modals/add-deal-modal";

export default function Deals() {
  const [showAddModal, setShowAddModal] = useState(false);
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

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ["/api/test/deals"],
    // enabled: isAuthenticated, // Temporarily disabled for demo
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/test/dashboard-stats"],
    // enabled: isAuthenticated, // Temporarily disabled for demo
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Calculate summary stats
  const totalSales = deals?.reduce((sum: number, deal: any) => sum + Number(deal.salePrice || 0), 0) || 0;
  const totalCommission = deals?.reduce((sum: number, deal: any) => sum + Number(deal.agentCommission || 0), 0) || 0;
  const avgMargin = deals?.length > 0 ? (totalCommission / totalSales * 100) : 0;

  return (
    <div className="flex h-screen bg-slate-50">
      <ModernSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Deals & Commission" 
          subtitle="Track closed deals and commission calculations."
          onAddNew={() => setShowAddModal(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      ${totalSales.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Commission</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      ${totalCommission.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                    <p className="text-3xl font-semibold text-gray-900">
                      {avgMargin.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Percent className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deals Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Deals</CardTitle>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Deal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dealsLoading ? (
                <div className="text-center py-8">Loading deals...</div>
              ) : deals && deals.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>Commission %</TableHead>
                        <TableHead>Agent Commission</TableHead>
                        <TableHead>Deal Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deals.map((deal: any) => (
                        <TableRow key={deal.id}>
                          <TableCell>
                            <div className="font-medium">Property #{deal.propertyId.slice(-8)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Lead #{deal.leadId.slice(-8)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-gray-900">
                              ${Number(deal.salePrice).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {Number(deal.commissionPercentage)}%
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-success">
                              ${Number(deal.agentCommission).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {deal.dealDate ? new Date(deal.dealDate).toLocaleDateString() : "Pending"}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              deal.status === "closed" 
                                ? "bg-green-100 text-green-800"
                                : deal.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }>
                              {deal.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Handshake className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
                  <p className="text-gray-500 mb-4">Start recording your first deal to track commissions</p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record First Deal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <AddDealModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
