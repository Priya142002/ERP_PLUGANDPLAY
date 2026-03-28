import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

interface SubscriptionPlanModalProps {
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
}

export const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({ onClose, onSelectPlan }) => {
  const handleViewPlans = () => {
    // Redirect to subscription page
    window.location.href = '/admin/subscription';
    onClose();
  };

  const handleStartTrial = () => {
    onSelectPlan('trial');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[95vw] sm:max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative max-h-[95vh] overflow-y-auto"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
        </button>

        {/* Header */}
        <div className="relative pt-6 sm:pt-8 pb-3 sm:pb-4 px-3 sm:px-8 text-center" style={{ backgroundColor: '#1a2744' }}>
          <h2 className="text-base sm:text-xl font-bold text-white mb-1">Start Your Free Trial!</h2>
          <p className="text-[10px] sm:text-xs" style={{ color: '#ffffff' }}>
            30 days full access to all features
          </p>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-6">
          {/* Benefits */}
          <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <p className="text-[11px] sm:text-sm text-slate-700">All 12 ERP modules included</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              </div>
              <p className="text-[11px] sm:text-sm text-slate-700">Unlimited users during trial</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
              </div>
              <p className="text-[11px] sm:text-sm text-slate-700">No credit card required</p>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-4 sm:mb-5">
            <p className="text-[10px] sm:text-xs text-amber-800 text-center">
              <span className="font-bold">Note:</span> After 30 days, choose a plan to continue
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 sm:space-y-2.5">
            <button
              onClick={handleStartTrial}
              className="w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#1a2744', color: '#ffffff' }}
            >
              Start Free Trial
            </button>
            <button
              onClick={handleViewPlans}
              className="w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition hover:bg-slate-50 border-2"
              style={{ borderColor: '#1a2744', color: '#1a2744' }}
            >
              View Subscription Plans
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2 sm:mt-3">
            Cancel anytime • No commitment
          </p>
        </div>
      </motion.div>
    </div>
  );
};
