import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider } from "@/contexts/AdminContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Announcements from "@/pages/Announcements";
import Gallery from "@/pages/Gallery";
import WatchServices from "@/pages/WatchServices";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/watch-services" component={WatchServices} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
