import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import Payments from "./pages/Payments";
import Inventory from "./pages/Inventory";
import Debts from "./pages/Debts";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/contracts/:id" element={<ContractDetail />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;