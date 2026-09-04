/**
 * ResearchAccess.tsx
 * Compliance-first registration/login page for La Elite Peptides.
 * Mirrors the Peptides Collective login wall pattern:
 *  - Unauthenticated visitors see this page when they try to view pricing
 *  - New users must scroll the Research Use Only T&C and check acceptance
 *  - Acceptance is timestamped in the database (termsAcceptedAt)
 *  - Returning users who already accepted go straight through
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const TERMS_VERSION = "v1.0";

const TERMS_TEXT = `RESEARCH USE ONLY — TERMS & CONDITIONS

La Elite Peptides is a supplier of laboratory research materials intended strictly for in-vitro and analytical research purposes. All products are for research use only and are not intended for human consumption or clinical application.

1. RESEARCH USE ONLY
All products sold, listed, or otherwise displayed by La Elite Peptides are provided strictly for laboratory and analytical in vitro research purposes only. These materials are not drugs, food additives, cosmetics, or dietary supplements and must never be used for human or veterinary applications under any circumstances.

2. FDA STATUS
Our products are not approved, cleared, or evaluated by the FDA, nor any other regulatory body, and any suggestion — explicit or implied — of bodily introduction, therapeutic use, or consumption is a violation of federal law and a breach of our Terms of Sale. Using these products is unauthorized by the FDA and may lead to adverse effects.

3. ELIGIBILITY TO PURCHASE
You must be at least 21 years of age and possess appropriate credentials to purchase from La Elite Peptides. By placing an order, you confirm that:
  • You are purchasing solely for research.
  • You are not acting on behalf of or distributing to any party intending human or animal use.
  • You will not repackage, relabel, or redistribute any product purchased.
  • You are a qualified professional or institutional researcher operating in a lawful environment.
  • You understand and accept all risks associated with laboratory research materials.

4. WAIVER AND INDEMNIFICATION
By purchasing or using products from La Elite Peptides, you agree to indemnify and hold harmless La Elite Peptides and its affiliates, agents, owners, and employees against any and all claims, damages, liabilities, expenses, and losses, including reasonable legal fees, arising from your misuse or unauthorized handling of our products.

You also waive any claims against us for injuries, damages, or losses resulting from improper use, storage, distribution, or disposal of our materials. You accept all legal and civil liability related to your research practices.

5. PRODUCT REPRESENTATIONS
Our products are not guaranteed to be sterile, pyrogen-free, or suitable for any specific application beyond research. We do not provide dosing instructions, health-related guidance, or guarantees of performance.

6. STORAGE AND HANDLING
Our compounds are shipped with the assumption that the end-user is qualified to handle, store, and dispose of them appropriately. All inventory is stored at −20°C until time of shipping to preserve chemical integrity. Upon receipt, the end-user is responsible for maintaining optimal storage conditions.

7. SHIPPING POLICY
We ship only to locations where such materials are legally permitted. Customers are responsible for ensuring that delivery to their jurisdiction complies with applicable laws. We are not liable for delays, loss, or damages once the package has been handed off to the shipping carrier.

8. RETURNS AND REFUNDS
We do not accept returns for opened or used products. We do not process refunds for any orders where usage for human or animal consumption is suspected. Refunds, when issued, are returned to the original payment method.

9. INTELLECTUAL PROPERTY
All content on this site — including logos, branding, trademarks, product listings, and text — belongs to La Elite Peptides. Unauthorized use, reproduction, or redistribution is strictly prohibited.

10. GOVERNING LAW
These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of Los Angeles County, California.

By checking the box below and creating an account, you expressly certify that you have read, understood, and agree to be bound by these Terms and Conditions in their entirety.`;

export default function ResearchAccess() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const [termsChecked, setTermsChecked] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const acceptTermsMutation = trpc.auth.acceptTerms.useMutation({
    onSuccess: () => {
      toast.success("Access granted. Welcome to La Elite Peptides.");
      navigate("/");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  // If user is already authenticated AND has accepted terms, redirect to home
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const u = user as any;
      if (u.termsAcceptedAt) {
        navigate("/");
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // Mark as scrolled when user reaches within 40px of the bottom
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setHasScrolled(true);
    }
  };

  const handleAccess = () => {
    if (!isAuthenticated) {
      // Redirect to Manus OAuth login, return here after
      window.location.href = getLoginUrl();
      return;
    }
    if (!termsChecked) {
      toast.error("Please read and accept the Terms & Conditions to continue.");
      return;
    }
    acceptTermsMutation.mutate({ termsVersion: TERMS_VERSION });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1D3F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B9C0CA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1D3F] flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-1 h-8 bg-[#B9C0CA]" />
          <span className="text-[#B9C0CA] text-xs font-mono tracking-[0.3em] uppercase">
            Restricted Access
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Research Access Portal
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          La Elite Peptides products are sold strictly for in-vitro laboratory
          research use only. To view pricing and place orders, you must create
          an account and agree to our Research Use Only Terms & Conditions.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-[#10295E] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-[#0C2147]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#B9C0CA] animate-pulse" />
            <span className="text-white font-semibold text-sm">
              Research Use Only — Terms & Conditions
            </span>
            <span className="ml-auto text-xs text-slate-500 font-mono">
              {TERMS_VERSION}
            </span>
          </div>
        </div>

        {/* Scrollable T&C */}
        <div
          onScroll={handleScroll}
          className="h-72 overflow-y-auto px-6 py-4 text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-wrap scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
          style={{ scrollbarWidth: "thin" }}
        >
          {TERMS_TEXT}
        </div>

        {/* Scroll hint */}
        {!hasScrolled && (
          <div className="px-6 py-2 bg-amber-900/20 border-t border-amber-700/30 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-amber-400 text-xs">
              Please scroll to read the full Terms & Conditions before accepting.
            </span>
          </div>
        )}

        {/* Acceptance checkbox */}
        <div className="px-6 py-4 border-t border-slate-700/50">
          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              id="terms-accept"
              checked={termsChecked}
              onCheckedChange={(v) => setTermsChecked(Boolean(v))}
              disabled={!hasScrolled}
              className="mt-0.5 border-slate-500 data-[state=checked]:bg-[#B9C0CA] data-[state=checked]:border-[#B9C0CA]"
            />
            <span className={`text-sm leading-relaxed transition-colors ${hasScrolled ? "text-slate-300 group-hover:text-white" : "text-slate-600"}`}>
              I have read and agree to the Research Use Only Terms & Conditions.
              I confirm I am at least 21 years of age, a qualified researcher,
              and will use these materials solely for lawful in-vitro laboratory
              research purposes.
            </span>
          </label>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          {!isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs text-center mb-4">
                Create an account or sign in to accept the terms and access pricing.
              </p>
              <Button
                onClick={handleAccess}
                className="w-full bg-[#B9C0CA] hover:bg-[#B9C0CA] text-black font-bold py-3 text-sm tracking-wide transition-all duration-150 active:scale-[0.97]"
              >
                Create Account / Sign In
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAccess}
              disabled={!termsChecked || acceptTermsMutation.isPending}
              className="w-full bg-[#B9C0CA] hover:bg-[#B9C0CA] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 text-sm tracking-wide transition-all duration-150 active:scale-[0.97]"
            >
              {acceptTermsMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Granting Access...
                </span>
              ) : (
                "Accept Terms & Access Research Portal"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-slate-600 text-xs text-center max-w-md">
        Your acceptance is timestamped and recorded for compliance purposes.
        La Elite Peptides · Los Angeles, CA · Research Use Only
      </p>
    </div>
  );
}
