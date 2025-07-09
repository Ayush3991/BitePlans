import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { auth } from '../firebase';
import '../index.css';

const Pricing = () => {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedPlanId, setClickedPlanId] = useState(null); 


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/v1/plans');
        const data = await res.json();
        if (data.success) setPlans(data.data);
        else console.error('Failed to load plans');
      } catch (err) {
        console.error('Error fetching plans:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

const handlePayPalClick = async (planId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please login to subscribe");
      return;
    }
    setClickedPlanId(planId);
    const idToken = await currentUser.getIdToken();

    console.log("Sending planId to backend:", planId);

    const res = await axios.post(
      '/api/v1/plans/subscribe',
      { planId },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

if (res.data && res.data.approvalUrl && res.data.orderId) {
  window.location.href = res.data.approvalUrl;
} else {
  alert('Failed to initiate PayPal subscription');
}
  } catch (error) {
    console.error("PayPal Subscribe Error:", error.response || error.message);
    alert('Something went wrong. Please try again.');
  }
  finally {
    setClickedPlanId(null);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin-slow"></div>
          <p className="text-gray-700 dark:text-white text-lg font-medium">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Credit-Based Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Pay only for what you use. Start with a free trial and scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isFree = plan.planId === 'trial-plan';

            return (
<div
  key={index}
  className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
    plan.planId === 'pro-plan'
      ? 'border-purple-500 dark:border-purple-400 shadow-xl ring-2 ring-purple-300/60 dark:ring-purple-500/30'
      : 'border-gray-200/50 dark:border-gray-700/50'
  }`}
>
  {plan.planId === 'pro-plan' && (
    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
      <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md tracking-wide">
        Most Popular
      </span>
    </div>
  )}

                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name || 'Free Trial'}</h3>
                      <div className="flex justify-center items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-300">/{plan.period}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {plan.creditsPerMonth === -1 ? 'Unlimited' : `${plan.credits} credits`}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {Array.isArray(plan.features) &&
                        plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

<div className="space-y-3">
  {isFree ? (
    <>
      {/* Top Blue Button (same design as others) */}
      <button
        onClick={() => window.location.href = '/signup'}
        className="w-full px-6 py-3 font-medium rounded-lg transform transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
      >
        Choose Free Trial
      </button>

      {/* Bottom Yellow Button (same as PayPal style, just text changed) */}
      <button
        onClick={() => window.location.href = '/signup'}
        className="w-full px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
      >
        <span>🎉</span>
        <span>Start Free Trial</span>
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => handlePayPalClick(plan.planId)}
        className="w-full px-6 py-3 font-medium rounded-lg transform transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-60"
        disabled={clickedPlanId !== null}
      >
        {clickedPlanId === plan.planId ? 'Processing...' : `Choose ${plan.name || 'Plan'}`}
      </button>

      <button
        onClick={() => handlePayPalClick(plan.planId)}
        className="w-full px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-60"
        disabled={clickedPlanId !== null}
      >
        <span>💳</span>
        <span>{clickedPlanId === plan.planId ? 'Redirecting...' : 'Pay with PayPal'}</span>
      </button>
    </>
  )}
</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How Credits Work */}
<div className="text-center mt-20">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How Credits Work</h2>
  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
    Credits let you use our tools. Each tool costs a few credits to use. Plans come with monthly credits, and you can upgrade anytime.
  </p>
</div>

{/* FAQs Section */}
<div className="mt-16">
  <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">FAQs</h2>
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {faqs.map((faq, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{faq.answer}</p>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

const CreditCard = ({ icon, title, usage, info }) => (
  <div className="text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{usage}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{info}</p>
  </div>
);

const faqs = [
  {
    question: 'What are credits and how do they work?',
    answer: 'Credits are used to access tools. Each tool consumes a set number of credits.',
  },
  {
    question: 'Do credits expire?',
    answer: 'Monthly credits reset each month and don’t carry over. But bonus or one-time credits never expire.',
  },
  {
    question: 'Can I change my plan anytime?',
    answer: 'Yes! You can upgrade or downgrade anytime. Billing adjusts automatically.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Definitely. You get 7 days free access with 100 credits. No credit card needed.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cards, UPI, net banking, and PayPal.',
  },
];

export default Pricing;
