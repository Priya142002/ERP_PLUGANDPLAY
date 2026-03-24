import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, Printer } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

export const BillingScreen: React.FC = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Product A', price: 25.00, quantity: 2, tax: 5, discount: 0 },
    { id: 2, name: 'Product B', price: 15.50, quantity: 1, tax: 5, discount: 10 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showHoldBillModal, setShowHoldBillModal] = useState(false);
  const [showResumeBillModal, setShowResumeBillModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const customers = [
    { id: 1, name: 'John Doe', mobile: '9876543210', loyaltyPoints: 150 },
    { id: 2, name: 'Jane Smith', mobile: '9876543211', loyaltyPoints: 200 },
    { id: 3, name: 'Bob Johnson', mobile: '9876543212', loyaltyPoints: 75 },
  ];

  const heldBills = [
    { id: 1, billNo: 'HOLD-001', customer: 'John Doe', items: 3, amount: 67.23, time: '10:30 AM' },
    { id: 2, billNo: 'HOLD-002', customer: 'Walk-in', items: 2, amount: 45.50, time: '11:15 AM' },
  ];

  const products = [
    { id: 1, name: 'Product A', price: 25.00, stock: 50, barcode: '1234567890' },
    { id: 2, name: 'Product B', price: 15.50, stock: 30, barcode: '0987654321' },
    { id: 3, name: 'Product C', price: 45.00, stock: 20, barcode: '1122334455' },
    { id: 4, name: 'Product D', price: 12.00, stock: 100, barcode: '5544332211' },
  ];

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleHoldBill = () => {
    setShowHoldBillModal(false);
    // Logic to save current bill
    alert('Bill held successfully!');
  };

  const handleResumeBill = (billId: number) => {
    setShowResumeBillModal(false);
    // Logic to load held bill into cart
    alert(`Resuming bill ${billId}`);
  };

  const handleSelectCustomer = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer.name);
      setShowCustomerModal(false);
    }
  };

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // If product already in cart, increase quantity
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new product to cart
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        tax: 5,
        discount: 0
      }]);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = cart.reduce((sum, item) => sum + (item.price * item.quantity * item.tax / 100), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.price * item.quantity * item.discount / 100), 0);
  const grandTotal = subtotal + totalTax - totalDiscount;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing / Sales Screen</h1>
          <p className="text-sm text-slate-500 mt-1">Product selection and cart management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            className="px-4 h-10 text-xs font-bold rounded-xl"
            onClick={() => setShowHoldBillModal(true)}
          >
            Hold Bill
          </Button>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 h-10 text-xs font-bold rounded-xl"
            onClick={() => setShowResumeBillModal(true)}
          >
            Resume Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by product name or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>

          {/* Product Grid */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Available Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                <div 
                  key={product.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                    <Badge variant="info" className="text-[9px]">{product.stock}</Badge>
                  </div>
                  <p className="text-lg font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    leftIcon={<Plus size={12} />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="space-y-5">
          {/* Customer Info */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <User size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Customer</h3>
            </div>
            {selectedCustomer ? (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-2">
                <p className="text-sm font-bold text-blue-900">{selectedCustomer}</p>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                >
                  Change Customer
                </button>
              </div>
            ) : (
              <Button 
                variant="secondary" 
                className="w-full text-xs" 
                leftIcon={<Plus size={12} />}
                onClick={() => setShowCustomerModal(true)}
              >
                Select Customer
              </Button>
            )}
          </div>

          {/* Cart Items */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Cart ({cart.length} items)</h3>
            </div>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 bg-white border border-slate-300 rounded flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 bg-white border border-slate-300 rounded flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-bold text-slate-900">${totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="font-bold text-red-600">-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Grand Total</span>
                <span className="font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Buttons */}
          <div className="space-y-2">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12" leftIcon={<CreditCard size={16} />}>
              Proceed to Payment
            </Button>
            <Button variant="secondary" className="w-full font-bold h-10" leftIcon={<Printer size={14} />}>
              Print Bill
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Select Customer"
      >
        <div className="space-y-3">
          {customers.map(customer => (
            <div
              key={customer.id}
              onClick={() => handleSelectCustomer(customer.id)}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{customer.name}</h4>
                  <p className="text-xs text-slate-500">{customer.mobile}</p>
                </div>
                <Badge variant="info" className="text-xs">
                  {customer.loyaltyPoints} pts
                </Badge>
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            className="w-full mt-4"
            leftIcon={<Plus size={14} />}
          >
            Add New Customer
          </Button>
        </div>
      </Modal>

      {/* Hold Bill Modal */}
      <Modal
        isOpen={showHoldBillModal}
        onClose={() => setShowHoldBillModal(false)}
        title="Hold Current Bill"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to hold this bill? You can resume it later.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Items in cart:</span>
              <span className="font-bold text-slate-900">{cart.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total amount:</span>
              <span className="font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowHoldBillModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleHoldBill}
            >
              Hold Bill
            </Button>
          </div>
        </div>
      </Modal>

      {/* Resume Bill Modal */}
      <Modal
        isOpen={showResumeBillModal}
        onClose={() => setShowResumeBillModal(false)}
        title="Resume Held Bill"
      >
        <div className="space-y-3">
          {heldBills.length > 0 ? (
            heldBills.map(bill => (
              <div
                key={bill.id}
                onClick={() => handleResumeBill(bill.id)}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{bill.billNo}</h4>
                  <Badge variant="warning" className="text-xs">{bill.time}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{bill.customer}</span>
                  <span>{bill.items} items</span>
                  <span className="font-bold text-emerald-600">${bill.amount.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No held bills available</p>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};
