
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AccessGate from "@/components/AccessGate";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RealAuth from "./pages/RealAuth";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import StorytellerDashboard from "./pages/StorytellerDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AccessGate />}>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/real-auth" element={<RealAuth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/verify" element={<EmailVerify />} />
            <Route 
              path="/storyteller-dashboard" 
              element={
                <ProtectedRoute requiredRole="storyteller">
                  <StorytellerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator-dashboard" 
              element={
                <ProtectedRoute requiredRole="creator">
                  <CreatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
