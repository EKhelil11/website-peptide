// === ELITE LA PEPTIDES — App Root ===
// Dark theme (Midnight Clinic), single-page layout

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { Redirect } from "wouter";
import AgeVerification from "./components/AgeVerification";
import FloatingCart from "./components/FloatingCart";
import { CartProvider } from "./contexts/CartContext";

const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CertificateOfAnalysis = lazy(() => import("./pages/CertificateOfAnalysis"));
const Shop = lazy(() => import("./pages/Shop"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ShippingReturnsPage = lazy(() => import("./pages/ShippingReturnsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Blends = lazy(() => import("./pages/Blends"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07152F] px-6 text-center" aria-live="polite">
      <span className="text-xs uppercase tracking-[0.2em] text-[#B9C0CA]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
        Loading LA Elite Peptides
      </span>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/coa/:id" component={CertificateOfAnalysis} />
      <Route path="/research-access"><Redirect to="/login" /></Route>
      <Route path="/shop" component={Shop} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/shipping-returns" component={ShippingReturnsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={AdminOrders} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/orders" component={AdminOrders} />
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
            <Suspense fallback={<RouteFallback />}>
              <Router />
            </Suspense>
            {/* <FloatingTextButton /> */}
            <FloatingCart />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
