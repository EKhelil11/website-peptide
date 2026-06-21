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
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import AdminOrders from "./pages/AdminOrders";
import AgeVerification from "./components/AgeVerification";
import FloatingTextButton from "./components/FloatingTextButton";
import { CartProvider } from "./contexts/CartContext";
import FloatingCart from "./components/FloatingCart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/login" component={Login} />
      <Route path="/shop" component={Shop} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/admin/orders" component={AdminOrders} />
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
          <CartProvider>
            <AgeVerification />
            <Router />
            <FloatingCart />
            <FloatingTextButton />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
