import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import ModernSidebar from "@/components/modern-sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit, DollarSign, TrendingUp } from "lucide-react";

const exchangeRateSchema = z.object({
  buyRate: z.string().min(1, "Buy rate is required"),
  sellRate: z.string().min(1, "Sell rate is required"),
});

type ExchangeRateFormData = z.infer<typeof exchangeRateSchema>;

export default function ExchangeRates() {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: exchangeRate, isLoading: ratesLoading } = useQuery({
    queryKey: ["/api/test/exchange-rates"],
    // enabled: isAuthenticated, // Temporarily disabled for demo
  });

  const form = useForm<ExchangeRateFormData>({
    resolver: zodResolver(exchangeRateSchema),
    defaultValues: {
      buyRate: "",
      sellRate: "",
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (exchangeRate) {
      form.setValue("buyRate", exchangeRate.buyRate?.toString() || "158");
      form.setValue("sellRate", exchangeRate.sellRate?.toString() || "179");
    }
  }, [exchangeRate, form]);

  const mutation = useMutation({
    mutationFn: async (data: ExchangeRateFormData) => {
      const payload = {
        buyRate: parseFloat(data.buyRate),
        sellRate: parseFloat(data.sellRate),
      };
      await apiRequest("PUT", "/api/exchange-rates", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exchange rates updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/exchange-rates"] });
      setEditMode(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Error",
        description: "Failed to update exchange rates",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExchangeRateFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (exchangeRate) {
      form.setValue("buyRate", exchangeRate.buyRate?.toString() || "158");
      form.setValue("sellRate", exchangeRate.sellRate?.toString() || "179");
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const buyRate = parseFloat(form.watch("buyRate") || exchangeRate?.buyRate || "158");
  const sellRate = parseFloat(form.watch("sellRate") || exchangeRate?.sellRate || "179");
  const spread = sellRate - buyRate;
  const profitMargin = buyRate > 0 ? ((spread / buyRate) * 100) : 0;

  return (
    <div className="flex h-screen bg-slate-50">
      <ModernSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Exchange Rates" 
          subtitle="Configure USD to ETB exchange rates."
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Currency Exchange Rates (USD to ETB)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Buy Rate</h4>
                          <span className="text-sm text-gray-500">Company buys USD</span>
                        </div>
                        {editMode ? (
                          <FormField
                            control={form.control}
                            name="buyRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="158"
                                      className="text-2xl font-bold text-primary"
                                      {...field}
                                    />
                                    <span className="text-gray-600">ETB per $1 USD</span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary">{buyRate.toFixed(2)}</span>
                            <span className="text-gray-600">ETB per $1 USD</span>
                          </div>
                        )}
                        {!editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-3 text-sm text-primary hover:text-blue-700"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Rate
                          </Button>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Sell Rate</h4>
                          <span className="text-sm text-gray-500">Company sells USD</span>
                        </div>
                        {editMode ? (
                          <FormField
                            control={form.control}
                            name="sellRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="179"
                                      className="text-2xl font-bold text-success"
                                      {...field}
                                    />
                                    <span className="text-gray-600">ETB per $1 USD</span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-success">{sellRate.toFixed(2)}</span>
                            <span className="text-gray-600">ETB per $1 USD</span>
                          </div>
                        )}
                        {!editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-3 text-sm text-success hover:text-green-700"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Rate
                          </Button>
                        )}
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end space-x-2 mb-6">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                          {mutation.isPending ? "Updating..." : "Update Rates"}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Profit Calculation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spread per $1 USD:</span>
                      <span className="font-medium">{spread.toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="font-medium text-success">{profitMargin.toFixed(1)}%</span>
                    </div>
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
