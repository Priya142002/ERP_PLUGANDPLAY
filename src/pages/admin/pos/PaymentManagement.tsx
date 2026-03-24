import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Smartphone, Split } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const PaymentManagement: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'split'>('cash');
  const [totalAmount] = useState(245.50);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [splitPayments, setSplitPayments] = useState([
    { method: 'cash', amount: 100 },
    { method: 'card', amount: 145.50 }
  ]);

  const changeAmount = receivedAmount ? parseFloat(receivedAmount) - totalAmount : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Management</h1>
        <p className="text-sm text-slate-500 mt-1">Cash, Card, UPI, Split payment and change calculation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Methods */}
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cash', label: 'Cash', icon: DollarSign, color: 'emerald' },
                { id: 'card', label: 'Card', icon: CreditCard, color: 'blue' },
                { id: 'upi', label: 'UPI', icon: Smartphone, color: 'purple' },
                { id: 'split', label: 'Split Payment', icon: Split, color: 'orange' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === method.id
                      ? `border-${method.color}-500 bg-${method.color}-50`
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <method.icon 
                    size={24} 
                    className={paymentMethod === method.id ? `text-${method.color}-600` : 'text-slate-400'}
                  />
                  <p className={`text-sm font-bold mt-2 ${
                    paymentMethod === method.id ? `text-${method.color}-900` : 'text-slate-600'
                  }`}>
                    {method.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Payment Details */}
          {paymentMethod === 'cash' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-4">Cash Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Amount Received</label>
                  <input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 text-lg font-bold border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-slate-50"
                  />
                </div>
                {receivedAmount && changeAmount >= 0 && (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200"
                  >
                    <p className="text-xs text-emerald-700 mb-1 font-bold uppercase tracking-wider">Change to Return</p>
                    <p className="text-3xl font-bold text-emerald-600">${changeAmount.toFixed(2)}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Card Payment Details */}
          {paymentMethod === 'card' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-4">Card Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Card Number</label>
                  <input
                    type="text"
                    placeholder="**** **** **** ****"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">CVV</label>
                    <input
                      type="text"
                      placeholder="***"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* UPI Payment Details */}
          {paymentMethod === 'upi' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-4">UPI Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">UPI ID</label>
                  <input
                    type="text"
                    placeholder="username@upi"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-slate-50"
                  />
                </div>
                <div className="p-5 bg-purple-50 rounded-xl border-2 border-purple-200 text-center">
                  <p className="text-xs text-purple-700 mb-3 font-bold uppercase tracking-wider">Scan QR Code</p>
                  <div className="w-36 h-36 bg-white mx-auto rounded-xl border-2 border-purple-300 flex items-center justify-center shadow-sm">
                    <p className="text-xs text-slate-400 font-medium">QR Code</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Split Payment Details */}
          {paymentMethod === 'split' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-4">Split Payment</h3>
              <div className="space-y-3">
                {splitPayments.map((payment, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700 capitalize">{payment.method}</span>
                      <span className="text-lg font-bold text-slate-900">${payment.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="secondary" 
                  className="w-full mt-2 border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50"
                  leftIcon={<Split size={14} />}
                >
                  Add Payment Method
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-bold text-slate-900">$220.00</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-600">Tax (5%)</span>
                <span className="font-bold text-slate-900">$11.00</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-600">Discount</span>
                <span className="font-bold text-red-600">-$5.50</span>
              </div>
              <div className="pt-4 border-t-2 border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Total Amount</span>
                  <span className="text-3xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Amount Buttons</h3>
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 200, 250, 300, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setReceivedAmount(amount.toString())}
                  className="py-3 px-3 bg-[#002147] hover:bg-[#003366] text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 text-base rounded-xl shadow-lg hover:shadow-xl transition-all">
            Complete Payment
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
