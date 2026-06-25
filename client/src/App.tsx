// === ELITE LA PEPTIDES — App Root ===
// Dark theme (Midnight Clinic), single-page layout

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ResearchAccess from "./pages/ResearchAccess";
import Shop from "./pages/Shop";
import AgeVerification from "./components/AgeVerification";
import FloatingTextButton from "./components/FloatingTextButton";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/research-access" component={ResearchAccess} />
      <Route path="/shop" component={Shop} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AgeVerification />
          <Router />
          <FloatingTextButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
