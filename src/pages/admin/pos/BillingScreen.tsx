import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, User,
  Printer, DollarSign, Tag, Phone, Grid, List,
  Package, X, Check, Clock, Barcode, ArrowLeft, CreditCard,
  Smartphone, QrCode, CheckCircle
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  tax: number;
  discount: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode: string;
  category: string;
}

export const BillingScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [checkoutStep, setCheckoutStep] = useState<'billing' | 'checkout' | 'payment'>('billing');
  
  // Customer state
  const [selectedCustomer, setSelectedCustomer] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  // Pricing state
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('percent');
  const [discountValue, setDiscountValue] = useState(0);
  const taxRate = 18; // GST 18%
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState('');
  
  // Card payment details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // UPI payment
  const [upiId, setUpiId] = useState('');
  const [showUpiQR, setShowUpiQR] = useState(false);

  const categories = ['All', 'Electronics', 'Groceries', 'Clothing', 'Accessories', 'Food & Beverage'];

  const products: Product[] = [
    { id: 1, name: 'Wireless Mouse', price: 25.00, stock: 50, barcode: '1234567890', category: 'Electronics' },
    { id: 2, name: 'USB Cable', price: 15.50, stock: 30, barcode: '0987654321', category: 'Electronics' },
    { id: 3, name: 'Notebook', price: 5.00, stock: 100, barcode: '1122334455', category: 'Accessories' },
    { id: 4, name: 'Water Bottle', price: 12.00, stock: 75, barcode: '5544332211', category: 'Accessories' },
    { id: 5, name: 'Coffee Beans', price: 18.00, stock: 40, barcode: '6677889900', category: 'Food & Beverage' },
    { id: 6, name: 'T-Shirt', price: 22.00, stock: 60, barcode: '9988776655', category: 'Clothing' },
  ];

  const customers = [
    { id: 1, name: 'John Doe', phone: '9876543210', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', phone: '9876543211', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', phone: '9876543212', email: 'bob@example.com' },
  ];

  // Cart operations
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        tax: taxRate,
        discount: 0
      }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const discountAmount = discountType === 'percent' 
    ? (subtotal * discountValue / 100)
    : discountValue;
  
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * taxRate / 100;
  const grandTotal = taxableAmount + taxAmount;
  const balance = paidAmount - grandTotal;

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setCheckoutStep('checkout');
  };

  const handlePayment = () => {
    if (paidAmount < grandTotal) {
      alert('Insufficient payment amount!');
      return;
    }

    // Validate payment method specific details
    if (paymentMethod === 'Card') {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCVV) {
        alert('Please fill in all card details!');
        return;
      }
    }

    if (paymentMethod === 'UPI') {
      if (!upiId && !showUpiQR) {
        alert('Please enter UPI ID or scan QR code!');
        return;
      }
    }

    // Generate invoice ID
    const invoiceId = `INV-${Date.now()}`;
    setGeneratedInvoiceId(invoiceId);

    // Show success modal
    setShowSuccessModal(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setCart([]);
      setSelectedCustomer('Walk-in Customer');
      setCustomerPhone('');
      setDiscountValue(0);
      setPaidAmount(0);
      setCardNumber('');
      setCardHolder('');
      setCardExpiry('');
      setCardCVV('');
      setUpiId('');
      setShowUpiQR(false);
      setCheckoutStep('billing');
    }, 3000);
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    
    // Save order for later
    alert('Order held successfully!');
  };

  const handleClearCart = () => {
    if (cart.length === 0) {
      return;
    }
    
    if (window.confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
      setSelectedCustomer('Walk-in Customer');
      setCustomerPhone('');
      setDiscountValue(0);
      setPaidAmount(0);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {checkoutStep === 'billing' && (
        <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing Screen</h1>
          <p className="text-sm text-slate-500 mt-1">Point of Sale - Main POS Page</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            className="px-6 h-10 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white border-none shadow-sm min-w-[100px]"
            leftIcon={<X size={14} />}
            onClick={handleClearCart}
            disabled={cart.length === 0}
          >
            Clear
          </Button>
          <Button 
            variant="secondary" 
            className="px-4 h-10 text-xs font-bold rounded-xl bg-[#002147] hover:bg-[#003366] text-white border-none shadow-sm"
            leftIcon={<Clock size={14} />}
            onClick={handleHoldOrder}
          >
            Hold Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Product Section */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search product name or scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#002147] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Available Products ({filteredProducts.length})</h3>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="info" className="text-[9px]">Stock: {product.stock}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{product.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={14} className="text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                        <p className="text-xs text-slate-500">{product.category} • Stock: {product.stock}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs">
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Cart, Customer, Pricing & Payment Section */}
        <div className="flex flex-col space-y-4">
          {/* Customer Section */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Customer</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-bold text-slate-900">{selectedCustomer}</p>
                {customerPhone && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Phone size={10} /> {customerPhone}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1 text-xs h-8"
                  onClick={() => setShowCustomerModal(true)}
                >
                  {selectedCustomer === 'Walk-in Customer' ? 'Add Customer' : 'Change'}
                </Button>
                {selectedCustomer !== 'Walk-in Customer' && (
                  <Button 
                    variant="secondary"
                    className="text-xs h-8 px-3"
                    onClick={() => {
                      setSelectedCustomer('Walk-in Customer');
                      setCustomerPhone('');
                    }}
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Cart</h3>
                </div>
                <Badge variant="info" className="text-xs">{cart.length} items</Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Package size={48} className="text-slate-300 mb-3" />
                  <p className="text-sm text-slate-500">Cart is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Add products to start billing</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-100"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            setCart(cart.map(cartItem =>
                              cartItem.id === item.id
                                ? { ...cartItem, quantity: Math.max(1, newQty) }
                                : cartItem
                            ));
                          }}
                          className="w-12 text-sm font-bold text-slate-900 text-center bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          min="1"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Pricing</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              
              {/* Discount Input */}
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <Tag size={14} className="text-slate-400" />
                  <input
                    type="number"
                    placeholder="0"
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'amount' | 'percent')}
                    className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none"
                  >
                    <option value="percent">%</option>
                    <option value="amount">$</option>
                  </select>
                </div>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Discount</span>
                  <span className="font-bold text-red-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (GST {taxRate}%)</span>
                <span className="font-bold text-slate-900">${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Grand Total</span>
                <span className="font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-base rounded-xl shadow-lg"
              leftIcon={<Check size={18} />}
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
            >
              Complete Sale
            </Button>
            <Button 
              variant="secondary"
              className="w-full font-bold h-10 rounded-xl"
              leftIcon={<Printer size={14} />}
              disabled={cart.length === 0}
            >
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
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by phone number..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          {customers.map(customer => (
            <div
              key={customer.id}
              onClick={() => {
                setSelectedCustomer(customer.name);
                setCustomerPhone(customer.phone);
                setShowCustomerModal(false);
              }}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <h4 className="text-sm font-bold text-slate-900">{customer.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{customer.phone}</p>
              <p className="text-xs text-slate-400">{customer.email}</p>
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

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Payment"
      >
        <div className="space-y-4">
          {/* Payment Method */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash', 'Card', 'UPI'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    paymentMethod === method
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Grand Total</span>
              <span className="font-bold text-slate-900">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Paid Amount */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Paid Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="number"
                value={paidAmount || ''}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 text-lg font-bold bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setPaidAmount(grandTotal)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                Exact
              </button>
              <button
                onClick={() => setPaidAmount(Math.ceil(grandTotal / 10) * 10)}
                className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
              >
                Round Up
              </button>
            </div>
          </div>

          {/* Balance/Change */}
          {paidAmount > 0 && (
            <div className={`p-4 rounded-lg border-2 ${
              balance >= 0 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">
                  {balance >= 0 ? 'Change to Return' : 'Balance Due'}
                </span>
                <span className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  ${Math.abs(balance).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={handlePayment}
              disabled={paidAmount < grandTotal}
            >
              Complete Payment
            </Button>
          </div>
        </div>
      </Modal>
      </>
      )}

      {/* Checkout Page */}
      {checkoutStep === 'checkout' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="px-3 h-10"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => setCheckoutStep('billing')}
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>
                <p className="text-sm text-slate-500 mt-1">Review order details</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Customer Details */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Name:</span>
                    <span className="text-sm font-bold text-slate-900">{selectedCustomer}</span>
                  </div>
                  {customerPhone && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Phone:</span>
                      <span className="text-sm font-medium text-slate-900">{customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product List */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Order Items ({cart.length})</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Discount</span>
                      <span className="font-bold text-red-600">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax (GST {taxRate}%)</span>
                    <span className="font-bold text-slate-900">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Grand Total</span>
                    <span className="font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-base rounded-xl shadow-lg"
                leftIcon={<CreditCard size={18} />}
                onClick={() => setCheckoutStep('payment')}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Page */}
      {checkoutStep === 'payment' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="px-3 h-10"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => setCheckoutStep('checkout')}
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment</h1>
                <p className="text-sm text-slate-500 mt-1">Complete your transaction</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Payment Method Selection */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h3>
                <p className="text-xs text-slate-500 mb-3">Select how the customer will pay</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['Cash', 'Card', 'UPI'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-lg border-2 text-sm font-semibold transition-all ${
                        paymentMethod === method
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'Card' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-600" />
                    Card Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Card Holder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1 block">CVV</label>
                        <input
                          type="password"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment */}
              {paymentMethod === 'UPI' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Smartphone size={20} className="text-purple-600" />
                    UPI Payment
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-2">OR</p>
                      <Button
                        variant="secondary"
                        className="w-full"
                        leftIcon={<QrCode size={16} />}
                        onClick={() => setShowUpiQR(!showUpiQR)}
                      >
                        {showUpiQR ? 'Hide QR Code' : 'Show QR Code'}
                      </Button>
                    </div>
                    {showUpiQR && (
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <div className="w-48 h-48 mx-auto bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center">
                          <QrCode size={120} className="text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500 mt-3">Scan QR code to pay ${grandTotal.toFixed(2)}</p>
                        <p className="text-xs text-slate-400 mt-1">Payment ID: UPI-{Date.now()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Amount Details</h3>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Paid Amount</label>
                  <p className="text-xs text-slate-500 mb-2">Enter the amount customer paid</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      value={paidAmount || ''}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 text-lg font-bold bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setPaidAmount(grandTotal)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium"
                    >
                      Exact Amount
                    </button>
                    <button
                      onClick={() => setPaidAmount(Math.ceil(grandTotal / 10) * 10)}
                      className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium"
                    >
                      Round Up
                    </button>
                  </div>
                </div>

                {/* Balance / Change Display */}
                {paidAmount > 0 && (
                  <div className={`mt-4 p-4 rounded-lg border-2 ${
                    balance >= 0 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-700">
                          {balance >= 0 ? 'Change to Return' : 'Pending Amount'}
                        </span>
                        <span className={`text-2xl font-bold ${
                          balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          ${Math.abs(balance).toFixed(2)}
                        </span>
                      </div>
                      {balance < 0 && (
                        <p className="text-xs text-red-600">
                          Customer needs to pay ${Math.abs(balance).toFixed(2)} more
                        </p>
                      )}
                      {balance > 0 && (
                        <p className="text-xs text-emerald-600">
                          Return ${balance.toFixed(2)} to customer
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Customer:</span>
                    <span className="font-medium text-slate-900">{selectedCustomer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Items:</span>
                    <span className="font-medium text-slate-900">{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Payment Method:</span>
                    <span className="font-medium text-slate-900">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total Amount</span>
                    <span className="font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-base rounded-xl shadow-lg"
                leftIcon={<Check size={18} />}
                onClick={handlePayment}
                disabled={paidAmount < grandTotal}
              >
                Complete Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {}}
        title=""
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-sm text-slate-600 mb-4">Your transaction has been completed</p>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Invoice ID:</span>
                <span className="font-bold text-slate-900">{generatedInvoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Customer:</span>
                <span className="font-medium text-slate-900">{selectedCustomer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span className="font-medium text-slate-900">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount Paid:</span>
                <span className="font-bold text-emerald-600">${paidAmount.toFixed(2)}</span>
              </div>
              {balance > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Change:</span>
                  <span className="font-bold text-blue-600">${balance.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              leftIcon={<Printer size={16} />}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setShowSuccessModal(false);
                setCheckoutStep('billing');
              }}
            >
              New Sale
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
