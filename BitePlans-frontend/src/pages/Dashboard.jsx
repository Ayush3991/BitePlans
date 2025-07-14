import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useUser();
  const [meData, setMeData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [creditUsage, setCreditUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState('');
const name = meData?.displayName || 'User';
const email = meData?.email;
const totalCredits = meData?.totalCredits ?? 0;
const usedCredits = meData?.usedCredits ?? 0;
const isUnlimited = totalCredits === -1;
const creditUsagePercent = isUnlimited ? 0 : (usedCredits / totalCredits) * 100;
const plan = meData?.currentPlan?.planId === 'trial' ? 'Free Trial' : meData?.currentPlan?.planId || 'N/A';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setMeData(data.user);
      } catch (err) {
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get('/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const transactionData = res.data;
        setTransactions(transactionData.data || []);
      } catch (err) {
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchCreditUsage = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get('/creditusage', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usageData = res.data;
        setCreditUsage(usageData.data || []);
      } catch (err) {
        console.error('Failed to fetch credit usage:', err);
      }
    };
    fetchCreditUsage();
  }, []);

useEffect(() => {
  if (meData) {
    const target = new Date(meData.currentPlan.endDate);

    const updateCountdown = () => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown('Expired');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setCountdown(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    };

    updateCountdown(); 
    const timer = setInterval(updateCountdown, 1000); 

    return () => clearInterval(timer);
  }
}, [meData]);

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

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 dark:text-red-400">{error}</div>;
  }

  const tools = [
    { name: 'Code Formatter Pro', icon: '🚀', credits: 2, timesUsed: 15 },
    { name: 'API Tester Ultimate', icon: '🔧', credits: 3, timesUsed: 8 },
    { name: 'Resume Builder Studio', icon: '📄', credits: 5, timesUsed: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Here's an overview of your BitePlans activity.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Logged in as {email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credits Remaining */}
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
            <div className="flex justify-between mb-4">
              <div className="text-2xl">💳</div>
              <div className="text-right">
<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
  {isUnlimited ? '∞' : totalCredits}
</div>
<div className="text-sm text-gray-600 dark:text-gray-400">
  {isUnlimited ? 'Unlimited Credits' : 'Credits Remaining'}
</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all" style={{ width: `${creditUsagePercent}%` }} />
            </div>
<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  {isUnlimited ? 'Unlimited usage' : `${creditUsagePercent.toFixed(0)}% used this period`}
</div>
          </div>

          {/* Current Plan */}
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
            <div className="flex justify-between mb-4">
              <div className="text-2xl">📋</div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{plan}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Plan</div>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
            <div className="flex justify-between">
              <div className="text-2xl">⏳</div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{countdown}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <Link key={tool.name} to={`/products/${tool.name.toLowerCase().replace(/\s+/g, '-')}`} className="group p-4 border rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all">
                    <div className="text-2xl mb-2">{tool.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{tool.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{tool.credits} credits/use</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Used {tool.timesUsed} times</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {creditUsage.length > 0 ? (
                  (showAllActivities ? creditUsage : creditUsage.slice(0, 3)).map((activity, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{activity.productName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">-{activity.creditsUsed} credits</span>
                        <div className="text-xs text-green-600 dark:text-green-400">completed</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">No activity found.</p>
                )}
              </div>
              {creditUsage.length > 3 && (
                <button onClick={() => setShowAllActivities(!showAllActivities)} className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  {showAllActivities ? 'View less ↑' : 'View all activity →'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Plan Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Current Plan</span>
                  <span className="font-medium text-gray-900 dark:text-white">{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Credits Remaining</span>
<span className="font-medium text-blue-600 dark:text-blue-400">
  {isUnlimited ? '∞ Unlimited' : totalCredits}
</span>
                </div>
                {plan === 'Free Trial' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Trial Ends</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">{trialDaysLeft} days</span>
                  </div>
                )}
              </div>
              {plan === 'Free Trial' && (
                <Link to="/pricing" className="block w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center">
                  Upgrade Plan
                </Link>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Billing History</h3>
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  (showAllTransactions ? transactions : transactions.slice(0, 2)).map((txn, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">Txn ID: {txn.orderId || 'N/A'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : 'Invalid Date'}</p>
                        {txn.planName && <p className="text-xs text-gray-500 dark:text-gray-400">Plan: {txn.planName}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">₹{txn.amount}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">{txn.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">No transactions found.</p>
                )}
              </div>
              {transactions.length > 2 && (
                <button onClick={() => setShowAllTransactions(!showAllTransactions)} className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  {showAllTransactions ? 'View less ↑' : 'View all bills →'}
                </button>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Our support team is here to help you get the most out of BitePlans.</p>
              <a href="#" className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


