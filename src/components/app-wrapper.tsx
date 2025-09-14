import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
// Lazy load all routes to reduce initial bundle size
const Index = lazy(() => import("../pages/Index"));
const Admin = lazy(() => import("../pages/Admin"));
const Auth = lazy(() => import("../pages/Auth"));
const NotFound = lazy(() => import("../pages/NotFound"));

const queryClient = new QueryClient();

const AppWrapper = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  }>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Suspense>
);

export default AppWrapper;