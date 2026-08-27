// === LA ELITE PEPTIDES — Customer Auth Hook ===
// Manages customer session state (separate from Manus OAuth admin auth)

import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export function useCustomerAuth() {
  const { data: customer, isLoading, refetch } = trpc.customer.me.useQuery(undefined, {
    retry: false,
    staleTime: 0, // Always refetch when invalidated (e.g. after login)
  });

  const logoutMutation = trpc.customer.logout.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return {
    customer: customer ?? null,
    isLoading,
    isAuthenticated: !!customer,
    logout: () => logoutMutation.mutate(),
    refetch,
  };
}

// Hook that redirects to /login if not authenticated
export function useRequireCustomerAuth() {
  const auth = useCustomerAuth();
  const [, setLocation] = useLocation();

  if (!auth.isLoading && !auth.isAuthenticated) {
    setLocation("/login");
  }

  return auth;
}
