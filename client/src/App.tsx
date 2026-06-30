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
import { Redirect } from "wouter";
import AgeVerification from "./components/AgeVerification";
import FloatingTextButton from "./components/FloatingTextButton";
import FloatingCart from "./components/FloatingCart";
import { CartProvider } from "./contexts/CartContext";
import TermsPage from "./pages/TermsPage";
import ShippingReturnsPage from "./pages/ShippingReturnsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import AdminOrders from "./pages/AdminOrders";
import Blends from "./pages/Blends";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/research-access"><Redirect to="/login" /></Route>
      <Route path="/shop"><Redirect to="/#products" /></Route>
      <Route path="/terms" component={TermsPage} />
      <Route path="/shipping-returns" component={ShippingReturnsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={AdminOrders} />
      <Route path="/blends" component={Blends} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
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
            {/* <FloatingTextButton /> */}
            <FloatingCart />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
