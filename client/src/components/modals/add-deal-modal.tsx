import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const addDealSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  leadId: z.string().min(1, "Lead is required"),
  salePrice: z.string().min(1, "Sale price is required"),
  commissionPercentage: z.string().min(1, "Commission percentage is required"),
  agentId: z.string().optional(),
  dealDate: z.string().optional(),
  status: z.string().default("pending"),
});

type AddDealFormData = z.infer<typeof addDealSchema>;

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddDealModal({ open, onOpenChange }: AddDealModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddDealFormData>({
    resolver: zodResolver(addDealSchema),
    defaultValues: {
      propertyId: "",
      leadId: "",
      salePrice: "",
      commissionPercentage: "3",
      agentId: "",
      dealDate: "",
      status: "pending",
    },
  });

  // Fetch properties and leads for dropdowns
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
    enabled: open,
  });

  const { data: leads } = useQuery({
    queryKey: ["/api/leads"],
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: async (data: AddDealFormData) => {
      const salePrice = parseFloat(data.salePrice);
      const commissionPercentage = parseFloat(data.commissionPercentage);
      const agentCommission = (salePrice * commissionPercentage) / 100;
      const companyCommission = agentCommission * 0.4; // Company takes 40%

      const payload = {
        ...data,
        salePrice,
        commissionPercentage,
        agentCommission,
        companyCommission,
        dealDate: data.dealDate ? new Date(data.dealDate).toISOString() : null,
      };
      await apiRequest("POST", "/api/deals", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Deal recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      form.reset();
      onOpenChange(false);
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
        description: "Failed to record deal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddDealFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record New Deal</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties?.map((property: any) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title} - {property.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leads?.map((lead: any) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (USD) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="285000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commissionPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission % *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dealDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Recording..." : "Record Deal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
