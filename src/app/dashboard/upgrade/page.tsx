'use client'
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, Loader2, X, Sparkles } from "lucide-react";
import { ManageSubscriptionCard } from "../../components/ui/ManageSubscriptionCard";

// --- Configuration ---
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const TRIAL_CONFIG = {
    'vip-trial': { id: 'vip-trial', priceId: process.env.NEXT_PUBLIC_STRIPE_VIP_TRIAL_PRICE_ID! },
    'student-vip-trial': { id: 'student-vip-trial', priceId: process.env.NEXT_PUBLIC_STRIPE_STUDENT_VIP_TRIAL_PRICE_ID! }
};

// --- Type Definitions for Better Safety ---
interface PlanOption {
  id: string;
  priceId: string;
  label: string;
  price: string;
  then: string;
}

interface Plan {
  name: string;
  features: string[];
  options: Record<string, PlanOption>;
}

const plans: Record<string, Plan> = {
  pro: { name: "Pro", features: ["Unlimited Summaries", "Audio Summaries"], options: { monthly: { id: "pro-monthly", priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_ID!, label: "Monthly", price: "$7.99", then: "per month" }, annual: { id: "pro-annual", priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_ID!, label: "Annual", price: "$71.99", then: "per year" }}},
  vip: { name: "VIP", features: ["All Pro Features", "Voice Cloning"], options: { monthly: { id: "vip-monthly", priceId: process.env.NEXT_PUBLIC_STRIPE_VIP_MONTHLY_ID!, label: "Monthly", price: "$14.99", then: "per month" }, annual: { id: "vip-annual", priceId: process.env.NEXT_PUBLIC_STRIPE_VIP_YEARLY_ID!, label: "Annual", price: "$134.99", then: "per year" }}},
  studentPro: { name: "Student Pro", features: ["Unlimited Summaries", "Audio Summaries"], options: { monthly: { id: "student-pro-monthly", priceId: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PRO_MONTHLY_ID!, label: "Monthly", price: "$4.99", then: "per month" }, annual: { id: "student-pro-annual", priceId: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PRO_YEARLY_ID!, label: "Annual", price: "$47.99", then: "per year" }}},
  studentVip: { name: "Student VIP", features: ["All Pro Features", "Voice Cloning"], options: { monthly: { id: "student-vip-monthly", priceId: process.env.NEXT_PUBLIC_STRIPE_STUDENT_VIP_MONTHLY_ID!, label: "Monthly", price: "$8.99", then: "per month" }, annual: { id: "student-vip-annual", priceId: process.env.NEXT_PUBLIC_STRIPE_STUDENT_VIP_YEARLY_ID!, label: "Annual", price: "$89.99", then: "per year" }}},
};

// --- Child Components for UI with Typed Props ---

const CancelationModal = ({ onConfirm, onDismiss, isLoading, periodEndDate }: { onConfirm: () => void; onDismiss: () => void; isLoading: boolean; periodEndDate: number | null }) => {
  const formattedDate = periodEndDate ? new Date(periodEndDate * 1000).toLocaleDateString() : "the end of your billing period";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 h-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cancel Subscription?</h2>
          <button onClick={onDismiss} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"> <X size={24} /> </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Your plan will remain active with all benefits until <span className="font-bold">{formattedDate}</span>. Are you sure you want to schedule this cancellation?</p>
        <div className="flex justify-end gap-4">
          <button onClick={onDismiss} className="px-6 py-2 rounded-full font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"> Never Mind </button>
          <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 rounded-full font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center min-w-[120px] transition-colors">
            {isLoading ? (<Loader2 className="w-5 h-5 animate-spin" />) : ("Yes, Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, onSelectPlan, isLoading, currentPlanId }: { plan: Plan; onSelectPlan: (priceId: string) => void; isLoading: boolean | string; currentPlanId: string; }) => {
  const firstOptionKey = Object.keys(plan.options)[0];
  const [selectedOptionId, setSelectedOptionId] = useState(plan.options[firstOptionKey].id);
  const selectedPlanDetails = Object.values(plan.options).find((opt) => opt.id === selectedOptionId);
  const isCurrentPlan = Object.values(plan.options).some((option) => option.id === currentPlanId);

  return (
    <div className={`border-2 rounded-2xl p-8 flex flex-col ${isCurrentPlan ? "border-indigo-600" : "border-gray-300"}`}>
      <h3 className="text-3xl font-bold">{plan.name}</h3>
      {selectedPlanDetails && (
        <div className="my-4">
            <p className="text-5xl font-bold">{selectedPlanDetails.price}</p>
            <p className="text-sm text-gray-500">{selectedPlanDetails.then}</p>
        </div>
      )}
      <div className="my-6">
        <div className="flex border border-gray-200 rounded-full p-1">
          {Object.values(plan.options).map((opt) => (
            <button key={opt.id} onClick={() => setSelectedOptionId(opt.id)} className={`w-full rounded-full py-2 text-sm font-medium transition-colors ${selectedOptionId === opt.id ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}> {opt.label} </button>
          ))}
        </div>
      </div>
      <ul className="space-y-2 mb-8 flex-grow">
        {plan.features.map((feature: string) => (<li key={feature} className="flex items-center"> <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> {feature} </li>))}
      </ul>
      {currentPlanId === 'basic' && selectedPlanDetails &&
        <button onClick={() => onSelectPlan(selectedPlanDetails.priceId)} disabled={isLoading === selectedPlanDetails.priceId || isCurrentPlan} className="w-full inline-flex items-center justify-center px-6 py-4 border rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading === selectedPlanDetails.priceId ? (<Loader2 className="w-5 h-5 animate-spin" />) : isCurrentPlan ? ("Current Plan") : ("Select Plan")}
        </button>
      }
    </div>
  );
};

const VipTrialPromotionCard = ({ onStartTrial, isLoading, vipTrialPriceId, description }: { onStartTrial: () => void; isLoading: boolean | string; vipTrialPriceId: string; description: string; }) => (
  <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl p-8 text-center">
      <Sparkles className="mx-auto h-12 w-12 text-amber-300 mb-4" />
      <h3 className="text-3xl font-bold mb-2">Try Our Best Features!</h3>
      <p className="text-lg text-indigo-100 mb-6">{description}</p>
      <button onClick={onStartTrial} disabled={!!isLoading} className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-70">
          {isLoading === vipTrialPriceId ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start VIP Trial'}
      </button>
  </div>
);

// --- Main Page Component ---
export default function UpgradePage() {
  const { session, userProfile, loading, fetchUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean | string>(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  if (loading || !userProfile) {
    return (<div className="text-center"> <Loader2 className="w-8 h-8 animate-spin mx-auto" /> </div>);
  }

  const activeSubscription = userProfile.subscriptions?.[0];
  const subscription_status = activeSubscription?.status || null;
  const subscription_expires_at = activeSubscription?.expires_at || null;
  const isCanceling = activeSubscription?.cancel_at_period_end === true;

  const isSubscribed = userProfile.current_tier !== "basic";
  const trialToOffer = userProfile.is_student ? TRIAL_CONFIG['student-vip-trial'] : TRIAL_CONFIG['vip-trial'];
  const trialPromoText = userProfile.is_student ? "Get a 7-day trial of the Student VIP Plan for just $3.99." : "Get a 7-day trial of the VIP Plan for just $6.99.";
  const showVipTrialPromo = !userProfile.had_trial;
  const plansToShow = userProfile.is_student ? [plans.studentPro, plans.studentVip] : [plans.pro, plans.vip];
  
  const handleConfirmCancelation = async () => {
    if (!session) return;
    setIsLoading("cancel");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancel-subscription`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );
      if (!response.ok) throw new Error((await response.json()).message || "Failed to cancel.");
      await fetchUserProfile();
      location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setCancelModalOpen(false);
    }
  };

  const handleSubscriptionChange = async (newPriceId: string) => {
    if (!session) return;
    setIsLoading(newPriceId);
    try {
      const endpoint = isSubscribed ? "/upgrade-subscription" : "/create-checkout-session";
      const allPlanOptions = Object.values(plans).flatMap(p => Object.values(p.options));
      const allTrialOptions = Object.values(TRIAL_CONFIG);
      const planIdentifier = [...allPlanOptions, ...allTrialOptions].find(o => o.priceId === newPriceId)?.id;

      const body = isSubscribed ? { newPriceId } : { planIdentifier };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error((await response.json()).message || "API Error");

      if (isSubscribed) {
        await fetchUserProfile();
      } else {
        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        if (stripe) await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error: any) {
      alert(`Could not change subscription: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageBilling = async () => {
    if (!session) return;
    setIsLoading("billing");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-portal-session`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert("Could not open billing portal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 space-y-10 animate-fade-in-up">
       <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-500 dark:from-rose-400 dark:to-amber-400">
          Upgrade Your Plan
        </span>: Unlock More Power
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
        Choose the perfect plan to get unlimited AI summaries, exclusive features, and personalized learning experiences.
      </p>

      {isCancelModalOpen && (
        <CancelationModal
          onConfirm={handleConfirmCancelation}
          onDismiss={() => setCancelModalOpen(false)}
          isLoading={isLoading === "cancel"}
          periodEndDate={subscription_expires_at}
        />
      )}

      <ManageSubscriptionCard
        planName={userProfile.current_tier}
        onCancel={() => setCancelModalOpen(true)}
        onManageBilling={handleManageBilling}
        isLoading={isLoading}
        cancelAtPeriodEnd={isCanceling}
        periodEndDate={subscription_expires_at}
        status={subscription_status}
      />

      {showVipTrialPromo && trialToOffer && (
        <VipTrialPromotionCard
            vipTrialPriceId={trialToOffer.priceId}
            description={trialPromoText}
            isLoading={isLoading}
            onStartTrial={() => handleSubscriptionChange(trialToOffer.priceId)}
        />
      )}

      <>
        <h2 className="text-4xl font-extrabold text-center">
          {isSubscribed ? "Change Your Plan" : "Choose Your Plan"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plansToShow.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              onSelectPlan={handleSubscriptionChange}
              isLoading={isLoading}
              currentPlanId={userProfile.current_tier}
            />
          ))}
        </div>
      </>
    </div>
  );
}
