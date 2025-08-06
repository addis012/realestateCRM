import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Leads from "@/pages/leads";
import Properties from "@/pages/properties";
import Deals from "@/pages/deals";
import Team from "@/pages/team";
import ExchangeRates from "@/pages/exchange-rates";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Dashboard routes - all redirect to main dashboard with role switching */}
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/supervisor" component={Dashboard} />
      <Route path="/sales" component={Dashboard} />
      <Route path="/superadmin" component={Dashboard} />
      
      {/* Authentication */}
      <Route path="/login" component={Login} />
      <Route path="/landing" component={Landing} />
      
      {/* Feature pages */}
      <Route path="/leads" component={Leads} />
      <Route path="/properties" component={Properties} />
      <Route path="/deals" component={Deals} />
      <Route path="/team" component={Team} />
      <Route path="/exchange-rates" component={ExchangeRates} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
