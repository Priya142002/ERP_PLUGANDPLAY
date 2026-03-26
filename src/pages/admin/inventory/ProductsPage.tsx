import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, X, Save, Package, AlertTriangle, Layers } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { exportToExcel } from "../../../utils/reportGenerator";
import { inventoryApi, BASE_URL } from '../../../services/api';

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
  addedAt: string;
  imageUrl?: string;
}

const INITIAL_PRODUCTS: Product[] = [];
const TABS = ['All Products', 'In Stock', 'Recently Added'] as const;
type Tab = typeof TABS[number];

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
        <button 
          onClick={onClose}
          style={{ height: '40px', minHeight: '40px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] hover:bg-[#003366] text-white text-sm font-semibold transition"
        >
          Cancel
        </button>
        <button 
          onClick={() => { onConfirm(); onClose(); }}
          style={{ height: '40px', minHeight: '40px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
        >
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

        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Current Stock</span>
          <span className="font-bold text-slate-800 text-sm">{product.stock} <span className="text-slate-400 text-xs">{product.unit}</span></span>
        </div>

        <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-4 text-[11px] font-bold">
          {(['set', 'add', 'subtract'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 capitalize transition ${mode === m ? 'bg-[#002147] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
              {m === 'set' ? 'Set' : m === 'add' ? '+ Add' : '− Subtract'}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {mode === 'set' ? 'New Stock Quantity' : mode === 'add' ? 'Quantity to Add' : 'Quantity to Subtract'}
          </label>
          <input type="number" min={0} value={qty}
            onChange={e => setQty(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition" />
        </div>

        {qty !== '' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-medium">Updated Stock</span>
            <span className="font-bold text-emerald-700 text-sm">{computed()} <span className="text-emerald-500 text-xs">{product.unit}</span></span>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            style={{ height: '40px', minHeight: '40px', borderRadius: '12px' }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={qty === ''}
            style={{ height: '40px', minHeight: '40px', borderRadius: '12px' }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={14} /> 
            Update Stock
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
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('All Products');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getProducts(companyId, search);
      if (res.success && res.data) {
        setProducts(res.data.items || res.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [companyId, search]);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

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
            p.name, p.sku, p.category, p.brand, p.unit, p.stock, p.price, p.status
          ])
        }
      ];
      exportToExcel(excelData, 'Products_Catalog');
      showNotification({ type: 'success', title: 'Excel Downloaded', message: 'Product catalog exported successfully.' });
    } catch (error) {
      showNotification({ type: 'error', title: 'Export Failed', message: 'Failed to export to Excel.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await inventoryApi.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showNotification({ type: 'success', title: 'Deleted', message: 'Product deleted.' });
      }
    } catch(e) { console.error(e); }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      const p = products.find(x => x.id === id);
      if(!p) return;
      const diff = newStock - p.stock;
      if (diff === 0) return;
      const res = await inventoryApi.updateStock({
        productId: parseInt(id),
        companyId,
        quantity: Math.abs(diff),
        type: diff > 0 ? 'IN' : 'OUT',
        remarks: 'Manual update'
      });
      if (res.success) {
        loadProducts();
        showNotification({ type: 'success', title: 'Stock Updated', message: 'New stock quantity applied.' });
      }
    } catch(e) { console.error(e); }
  };

  return (
    <>
      <style>
        {`
          button.export-btn-hover:hover,
          button.export-btn-hover:hover * { color: #000000 !important; }
          button.export-btn-hover:hover svg { stroke: #000000 !important; opacity: 1 !important; }
        `}
      </style>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Catalog</h1>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="export-btn-hover px-4 h-10 text-xs font-bold rounded-xl border-slate-200"
              leftIcon={<Download size={14} color="currentColor" />} onClick={handleExportExcel}>Export</Button>
            <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
              leftIcon={<Plus size={14} />} onClick={() => navigate('/admin/inventory/products/add')}>New Product</Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1.5">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border ${
                  activeTab === tab ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}>{tab}</button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 sm:justify-end">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                className="h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 w-44 bg-white" />
            </div>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-600">
              <option value="">Filter by Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                    <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">{loading ? 'Loading...' : 'No products found'}</td>
                  </tr>
                ) : displayed.map((p, i) => (
                  <tr key={p.id} className={`group transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl.startsWith('data:') || p.imageUrl.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl.startsWith('/') ? '' : '/'}${p.imageUrl}`} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/100x100?text=?'; }} />
                          ) : (
                            <Package size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm leading-tight">{p.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.sku}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200 inline-block" />
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{p.brand}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md py-0.5 px-1.5">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="font-bold text-slate-700 text-sm">{p.stock} <span className="text-[10px] text-slate-400 font-bold uppercase">{p.unit}</span></div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock > 20 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-sm">Rs. {p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/inventory/products/edit/${p.id}`)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#002147] hover:bg-[#003366] text-white border border-[#002147] transition" title="Edit"><Edit size={14} /></button>
                        <button onClick={() => setStockProduct(p)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 transition" title="Update Stock"><Layers size={14} /></button>
                        <button onClick={() => setDeleteProduct(p)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white border border-red-600 transition" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-400 font-medium">{displayed.length} product{displayed.length !== 1 ? 's' : ''} shown</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {stockProduct && <StockModal key="stock" product={stockProduct} onClose={() => setStockProduct(null)} onSave={handleStockUpdate} />}
        {deleteProduct && <DeleteModal key="delete" name={deleteProduct.name} onClose={() => setDeleteProduct(null)} onConfirm={() => handleDelete(deleteProduct.id)} />}
      </AnimatePresence>
    </>
  );
};

export default ProductsPage;
