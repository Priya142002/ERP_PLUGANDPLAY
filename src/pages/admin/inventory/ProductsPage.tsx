import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, X, Save, Package, AlertTriangle, Layers } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useNotifications } from "../../../context/AppContext";
import { exportToExcel } from "../../../utils/reportGenerator";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unit: string;
  stock: number;
  price: number;
  status: string;
  addedAt: string; // ISO date string
}

/* ─────────────────────────────────────────
   Mock Data
───────────────────────────────────────── */
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Wireless Headphones', sku: 'WHP-001', category: 'Electronics', brand: 'Sony',         unit: 'pcs', stock: 45,  price: 299.99, status: 'Active',       addedAt: daysAgo(2)  },
  { id: '2', name: 'Smart Fitness Tracker',        sku: 'SFT-002', category: 'Wearables',   brand: 'Fitbit',       unit: 'pcs', stock: 12,  price: 149.50, status: 'Low Stock',   addedAt: daysAgo(5)  },
  { id: '3', name: 'Ergonomic Office Chair',       sku: 'EOC-003', category: 'Furniture',   brand: 'Herman Miller',unit: 'pcs', stock: 8,   price: 899.00, status: 'Active',       addedAt: daysAgo(10) },
  { id: '4', name: 'Mechanical Gaming Keyboard',   sku: 'MGK-004', category: 'Accessories', brand: 'Logitech',     unit: 'pcs', stock: 0,   price: 129.99, status: 'Out of Stock', addedAt: daysAgo(15) },
  { id: '5', name: '4K Ultra HD Monitor',          sku: 'MON-005', category: 'Electronics', brand: 'Dell',         unit: 'pcs', stock: 25,  price: 449.00, status: 'Active',       addedAt: daysAgo(20) },
  { id: '6', name: 'Leather Travel Backpack',      sku: 'BPK-006', category: 'Fashion',     brand: 'Bellroy',      unit: 'pcs', stock: 15,  price: 189.00, status: 'Active',       addedAt: daysAgo(3)  },
  { id: '7', name: 'Stainless Steel Water Bottle', sku: 'WBT-007', category: 'Home',        brand: 'Hydro Flask',  unit: 'pcs', stock: 120, price: 34.95,  status: 'Active',       addedAt: daysAgo(1)  },
  { id: '8', name: 'Noise-Cancelling Earbuds',     sku: 'NCE-008', category: 'Electronics', brand: 'Bose',         unit: 'pcs', stock: 5,   price: 199.00, status: 'Low Stock',    addedAt: daysAgo(7)  },
];

const TABS = ['All Products', 'In Stock', 'Recently Added'] as const;
type Tab = typeof TABS[number];

/* ─────────────────────────────────────────
   Shared: Creatable Select (dropdown + + button)
───────────────────────────────────────── */
interface CreatableSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onAddNew: (v: string) => void;
}
const CreatableSelect: React.FC<CreatableSelectProps> = ({ label, value, onChange, options, onAddNew }) => {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState('');
  const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1";
  const fieldCls = "flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";

  const handleAdd = () => {
    if (newVal.trim()) { onAddNew(newVal.trim()); onChange(newVal.trim()); setNewVal(''); setAdding(false); }
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      {adding ? (
        <div className="flex gap-2">
          <input autoFocus value={newVal} onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            placeholder={`New ${label.toLowerCase()}…`}
            className={fieldCls} />
          <button type="button" onClick={handleAdd}
            className="h-10 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">Add</button>
          <button type="button" onClick={() => setAdding(false)}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition"><X size={14} /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select value={value} onChange={e => onChange(e.target.value)} className={fieldCls}>
            <option value="">Select…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <button type="button" onClick={() => setAdding(true)} title={`Add new ${label}`}
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
            <Plus size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Edit / Update Stock Modal
───────────────────────────────────────── */
interface EditModalProps {
  product: Product;
  categories: string[];
  brands: string[];
  units: string[];
  onAddCategory: (v: string) => void;
  onAddBrand: (v: string) => void;
  onAddUnit: (v: string) => void;
  onClose: () => void;
  onSave: (p: Product) => void;
}

const EditModal: React.FC<EditModalProps> = ({ product, categories, brands, units, onAddCategory, onAddBrand, onAddUnit, onClose, onSave }) => {
  const [form, setForm] = useState<Product>({ ...product });
  const set = (k: keyof Product, v: any) => setForm(p => ({ ...p, [k]: v }));

  const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
  const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Package size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Edit Product</h3>
              <p className="text-xs text-slate-400">{form.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className={labelCls}>Product Name</label>
            <input className={fieldCls} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>SKU</label>
              <input className={fieldCls} value={form.sku} onChange={e => set('sku', e.target.value)} />
            </div>
            <CreatableSelect label="Category" value={form.category} onChange={v => set('category', v)}
              options={categories} onAddNew={v => { onAddCategory(v); set('category', v); }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CreatableSelect label="Brand" value={form.brand} onChange={v => set('brand', v)}
              options={brands} onAddNew={v => { onAddBrand(v); set('brand', v); }} />
            <CreatableSelect label="Unit of Measure" value={form.unit} onChange={v => set('unit', v)}
              options={units} onAddNew={v => { onAddUnit(v); set('unit', v); }} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Purchase Price</label>
              <input className={fieldCls} type="number" value={form.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Stock Qty</label>
              <input className={fieldCls} type="number" value={form.stock} onChange={e => set('stock', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={fieldCls} value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} 
            style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
            className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }}
            style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
            className="flex-1 bg-[#002147] text-white text-sm font-semibold transition flex items-center justify-center gap-2">
            <Save size={15} /> Update Product
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Delete Confirm Modal
───────────────────────────────────────── */
const DeleteModal: React.FC<{ name: string; onClose: () => void; onConfirm: () => void }> = ({ name, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      style={{ backgroundColor: '#ffffff', opacity: 1 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Product</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete <span className="font-semibold text-slate-700">"{name}"</span>? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} 
          style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} 
          style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center">
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

/* ─────────────────────────────────────────
   Stock Update Modal
───────────────────────────────────────── */
interface StockModalProps {
  product: Product;
  onClose: () => void;
  onSave: (id: string, newStock: number) => void;
}
const StockModal: React.FC<StockModalProps> = ({ product, onClose, onSave }) => {
  const [qty, setQty] = useState<number | ''>(product.stock);
  const [mode, setMode] = useState<'set' | 'add' | 'subtract'>('set');

  const computed = () => {
    const n = Number(qty) || 0;
    if (mode === 'add')      return product.stock + n;
    if (mode === 'subtract') return Math.max(0, product.stock - n);
    return n;
  };

  const handleSave = () => { onSave(product.id, computed()); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Layers size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Update Stock</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{product.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={16} /></button>
        </div>

        {/* Current stock */}
        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Current Stock</span>
          <span className="font-bold text-slate-800 text-sm">{product.stock} <span className="text-slate-400 text-xs">{product.unit}</span></span>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-4 text-[11px] font-bold">
          {(['set', 'add', 'subtract'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 capitalize transition ${mode === m ? 'bg-[#002147] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
              {m === 'set' ? 'Set' : m === 'add' ? '+ Add' : '− Subtract'}
            </button>
          ))}
        </div>

        {/* Qty input */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {mode === 'set' ? 'New Stock Quantity' : mode === 'add' ? 'Quantity to Add' : 'Quantity to Subtract'}
          </label>
          <input type="number" min={0} value={qty}
            onChange={e => setQty(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition" />
        </div>

        {/* Preview */}
        {qty !== '' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-medium">Updated Stock</span>
            <span className="font-bold text-emerald-700 text-sm">{computed()} <span className="text-emerald-500 text-xs">{product.unit}</span></span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} 
            style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
            className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
            Cancel
          </button>
          <button onClick={handleSave} disabled={qty === ''}
            style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
            className="flex-1 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            <Save size={14} /> Update Stock
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Status Badge
───────────────────────────────────────── */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Active') return (
    <div className="flex items-center gap-1.5 text-emerald-600">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
    </div>
  );
  if (status === 'Low Stock') return (
    <div className="flex items-center gap-1.5 text-amber-600">
      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Low Stock</span>
    </div>
  );
  if (status === 'Out of Stock') return (
    <div className="flex items-center gap-1.5 text-rose-600">
      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
    </div>
  );
  return <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{status}</span>;
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<Tab>('All Products');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  // Extra options added by user (merged with product-derived ones)
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const [extraBrands, setExtraBrands]         = useState<string[]>([]);
  const [extraUnits, setExtraUnits]           = useState<string[]>([]);

  const categories = useMemo(() => Array.from(new Set([...products.map(p => p.category), ...extraCategories])), [products, extraCategories]);
  const brands     = useMemo(() => Array.from(new Set([...products.map(p => p.brand),    ...extraBrands])),    [products, extraBrands]);
  const units      = useMemo(() => Array.from(new Set([...products.map(p => p.unit),     ...extraUnits])),     [products, extraUnits]);

  const addCategory = (v: string) => setExtraCategories(p => p.includes(v) ? p : [...p, v]);
  const addBrand    = (v: string) => setExtraBrands(p => p.includes(v) ? p : [...p, v]);
  const addUnit     = (v: string) => setExtraUnits(p => p.includes(v) ? p : [...p, v]);

  /* tab + search + category filter */
  const displayed = useMemo(() => {
    let list = [...products];
    if (activeTab === 'In Stock')       list = list.filter(p => p.stock > 0);
    if (activeTab === 'Recently Added') list = list.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 5);
    if (search)          list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    if (filterCategory)  list = list.filter(p => p.category === filterCategory);
    return list;
  }, [products, activeTab, search, filterCategory]);

  const handleExportExcel = () => {
    try {
      const excelData = [
        {
          sheetName: 'Products',
          headers: ['Product Name', 'SKU', 'Category', 'Brand', 'Unit', 'Stock', 'Price', 'Status'],
          data: displayed.map(p => [
            p.name,
            p.sku,
            p.category,
            p.brand,
            p.unit,
            p.stock,
            p.price,
            p.status
          ])
        }
      ];
      exportToExcel(excelData, 'Products_Catalog');
      
      showNotification({
        type: 'success',
        title: 'Excel Downloaded',
        message: 'Product catalog has been exported to Excel successfully.',
        duration: 3000
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export product catalog to Excel.',
        duration: 5000
      });
    }
  };

  const handleSave = (updated: Product) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const handleDelete = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const handleStockUpdate = (id: string, newStock: number) =>
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p, stock: newStock,
      status: newStock === 0 ? 'Out of Stock' : newStock <= 10 ? 'Low Stock' : 'Active'
    } : p));

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Catalog</h1>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleExportExcel}
              variant="secondary" 
              className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" 
              leftIcon={<Download size={14} />}
            >
              Export
            </Button>
            <Button variant="primary"
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate('/admin/inventory/products/add')}>
              New Product
            </Button>
          </div>
        </div>

        {/* Tabs + Filters row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border ${
                  activeTab === tab
                    ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center gap-2 sm:justify-end">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                className="h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 w-44 bg-white" />
            </div>
            {/* Filter by Category */}
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-600">
              <option value="">Filter by Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Fixed-height scrollable table */}
          <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#002147] text-white">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Product</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Category</th>
                  <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Stock</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Price</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">No products found</td>
                  </tr>
                ) : displayed.map((p, i) => (
                  <tr key={p.id} className={`group transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 text-sm leading-tight">{p.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.sku}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200 inline-block" />
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{p.brand}</span>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md py-0.5 px-1.5">
                        {p.category}
                      </span>
                    </td>
                    {/* Stock */}
                    <td className="px-5 py-3.5 text-center">
                      <div className="font-bold text-slate-700 text-sm">
                        {p.stock} <span className="text-[10px] text-slate-400 font-bold uppercase">{p.unit}</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock > 20 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }} />
                      </div>
                    </td>
                    {/* Price */}
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-sm">
                        ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditProduct(p)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#002147] hover:bg-[#003366] text-white border border-[#002147] transition" title="Edit">
                          <Edit size={14} stroke="currentColor" strokeWidth={2} />
                        </button>
                        <button onClick={() => setStockProduct(p)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 transition" title="Update Stock">
                          <Layers size={14} stroke="currentColor" strokeWidth={2} />
                        </button>
                        <button onClick={() => setDeleteProduct(p)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white border border-red-600 transition" title="Delete">
                          <Trash2 size={14} stroke="currentColor" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-400 font-medium">{displayed.length} product{displayed.length !== 1 ? 's' : ''} shown</span>
          </div>
        </div>

      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {editProduct && (
          <EditModal key="edit" product={editProduct} categories={categories} brands={brands} units={units}
            onAddCategory={addCategory} onAddBrand={addBrand} onAddUnit={addUnit}
            onClose={() => setEditProduct(null)} onSave={handleSave} />
        )}
        {stockProduct && (
          <StockModal key="stock" product={stockProduct}
            onClose={() => setStockProduct(null)} onSave={handleStockUpdate} />
        )}
        {deleteProduct && (
          <DeleteModal key="delete" name={deleteProduct.name}
            onClose={() => setDeleteProduct(null)} onConfirm={() => handleDelete(deleteProduct.id)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsPage;
