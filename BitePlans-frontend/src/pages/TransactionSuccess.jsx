import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import Lottie from 'lottie-react';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { auth } from '../firebase';

import successAnim from '../assets/success-check.json';

const TransactionSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [width, height] = useWindowSize();
  const receiptRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [planName, setPlanName] = useState('');
  const [credits, setCredits] = useState(0);

  const formattedDateTime = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleDownloadReceipt = () => {
    if (receiptRef.current) {
      const opt = {
        margin: 0.5,
        filename: `BitePlans_Receipt_${orderId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(receiptRef.current).save();
    }
  };

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
    if (!firebaseUser) {
      toast.error("User not logged in");
      navigate('/pricing');
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const planIdFromURL = queryParams.get('planId');
    const orderIdFromToken = queryParams.get('token');

    if (!planIdFromURL || !orderIdFromToken) {
      toast.error("Missing order ID or plan ID");
      navigate('/pricing');
      return;
    }

    try {
      const token = await firebaseUser.getIdToken();

      const res = await axios.post(
        '/api/v1/plans/confirm-subscription',
        {
          orderId: orderIdFromToken,
          planId: planIdFromURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Plan Activated!");
        setOrderId(orderIdFromToken);
        setPlanName(res.data.currentPlan?.planId || "Premium");
        setCredits(res.data.currentPlan?.credits || 0);
      } else {
        toast.error("Failed to confirm subscription");
      }
    } catch (err) {
      console.error("Confirm Subscription Error:", err.message);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900 text-gray-700 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-4">
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <Lottie animationData={successAnim} loop={false} style={{ height: 120, width: 120 }} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you! Your transaction has been processed successfully. You can now access premium features.
        </p>

        <Link
          to="/dashboard"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          Go to Dashboard
        </Link>
      </motion.div>

    </div>
  );
};

export default TransactionSuccess;
