import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus, ArrowLeft, Tag, IndianRupee, Database,
  Image as ImageIcon, Save, RotateCcw, X, Upload, Loader2, Percent, Calculator
} from "lucide-react";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi, fileApi, BASE_URL } from "../../../services/api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";

/* ── tiny inline select with + button ── */
interface CreatableSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onAdd: () => void;
  placeholder?: string;
  disabled?: boolean;
}
const CreatableSelect: React.FC<CreatableSelectProps> = ({
  label, value, onChange, options, onAdd, placeholder = "Select…", disabled = false
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
    <div className="flex gap-2 items-center">
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        title={`Add new ${label}`}
        className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition disabled:opacity-50"
      >
        <Plus size={16} />
      </button>
    </div>
  </div>
);

/* ── quick-add modal ── */
interface QuickAddModalProps {
  title: string;
  label: string;
  onClose: () => void;
  onSave: (value: string, percentage?: number) => void;
  isTax?: boolean;
}
const QuickAddModal: React.FC<QuickAddModalProps> = ({ title, label, onClose, onSave, isTax }) => {
  const [val, setVal] = useState("");
  const [perc, setPerc] = useState("");
  const handleSave = () => {
    if (val.trim()) { 
      onSave(val.trim(), isTax ? parseFloat(perc) || 0 : undefined); 
      onClose(); 
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-base">Add New {title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{label} Name</label>
            <input
              autoFocus
              type="text"
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder={`Enter name…`}
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
          {isTax && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Tax Percentage (%)</label>
              <input
                type="number"
                value={perc}
                onChange={e => setPerc(e.target.value)}
                placeholder="e.g. 18"
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition">Cancel</button>
          <button onClick={handleSave} disabled={!val.trim()} className="flex-1 h-12 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] disabled:opacity-40 transition">Add {title}</button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── main page ── */
export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // dropdown options state
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [taxTypes, setTaxTypes] = useState<{name: string, percentage: number}[]>([]);

  // form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [taxType, setTaxType] = useState("");
  const [price, setPrice] = useState(""); // Purchase
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [tax, setTax] = useState(""); // Current Percent
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageUrl, setImageUrl] = useState("");

  const [modal, setModal] = useState<'category' | 'brand' | 'unit' | 'warehouse' | 'tax' | null>(null);

  // Calculate total amount auto
  const totalAmount = useMemo(() => {
    const s = parseFloat(sellingPrice) || 0;
    const t = parseFloat(tax) || 0;
    return (s + (s * t / 100)).toFixed(2);
  }, [sellingPrice, tax]);

  useEffect(() => {
    fetchInitialData();
    if (isEdit) {
      loadEditProduct();
    } else {
      autoGenerateSku();
    }
  }, [companyId, id]);

  const fetchInitialData = async () => {
    try {
      const [catsRes, brandsRes, unitsRes, whRes, taxRes] = await Promise.all([
        inventoryApi.getCategories(companyId),
        inventoryApi.getBrands(companyId),
        inventoryApi.getUnits(companyId),
        inventoryApi.getWarehouses(companyId),
        inventoryApi.getTaxTypes(companyId)
      ]);

      if (catsRes.success && catsRes.data) setCategories(catsRes.data.map((c: any) => c.name));
      if (brandsRes.success && brandsRes.data) setBrands(brandsRes.data.map((b: any) => b.name));
      if (unitsRes.success && unitsRes.data) setUnits(unitsRes.data.map((u: any) => u.name));
      if (whRes.success && whRes.data) setWarehouses((whRes.data.items || whRes.data || []).map((w: any) => w.name));
      if (taxRes.success && taxRes.data) setTaxTypes(taxRes.data);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const loadEditProduct = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getProduct(id!);
      if (res.success && res.data) {
        const found = res.data;
        setName(found.name); setSku(found.sku); setCategory(found.category);
        setBrand(found.brand || ""); setUnit(found.unit || "");
        setPrice(found.price?.toString() || "");
        setSellingPrice(found.sellingPrice?.toString() || "");
        setTax(found.taxPercentage?.toString() || "");
        setTaxType(found.taxType || "");
        setStock(found.stock?.toString() || "");
        setStatus(found.status || "Active");
        setImageUrl(found.imageUrl || "");
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const autoGenerateSku = async () => {
    try {
      const res = await inventoryApi.getProducts(companyId);
      if (res.success) {
        const products = res.data.items || res.data || [];
        const skus = products.map((p: any) => p.sku).filter((s: string) => s && s.toUpperCase().startsWith('PROD'));
        let nextNum = 1;
        if (skus.length > 0) {
          const nums = skus.map((s: string) => {
             const numPart = s.replace(/[^0-9]/g, '');
             return numPart ? parseInt(numPart) : 0;
          }).filter((n: number) => n > 0);
          if (nums.length > 0) nextNum = Math.max(...nums) + 1;
        }
        setSku(`PROD${nextNum.toString().padStart(2, '0')}`);
      }
    } catch (err) { console.error(err); }
  };

  const handleTaxTypeChange = (v: string) => {
    setTaxType(v);
    const found = taxTypes.find(t => t.name === v);
    if (found) setTax(found.percentage.toString());
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification({ type: 'error', title: 'File Too Large', message: 'Please select an image under 2MB for base64 storage.' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      setUploading(false);
      showNotification({ type: 'success', title: 'Ready', message: 'Image processed successfully.' });
    };
    reader.onerror = () => {
      showNotification({ type: 'error', title: 'Error', message: 'Failed to read image file.' });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async () => {
    if (!name || !sku || !category) {
      showNotification({ type: 'error', title: 'Validation', message: 'Name, SKU, and Category are required.' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        companyId, name, sku, category, brand, unit, taxType,
        price: parseFloat(price) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        taxPercentage: parseFloat(tax) || 0,
        stock: parseInt(stock) || 0,
        status: status, imageUrl
      };
      const res = isEdit ? await inventoryApi.updateProduct(id!, { ...payload, id: parseInt(id!) }) : await inventoryApi.createProduct(payload);
      if (res.success) {
        showNotification({ type: 'success', title: 'Success', message: `Product ${isEdit ? 'updated' : 'created'} successfully!` });
        navigate('/admin/inventory/products');
      }
    } catch (err: any) { console.error(err); } finally { setLoading(false); }
  };

  const handleClear = () => {
    setName(""); setCategory(""); setBrand(""); setUnit(""); setWarehouse(""); setTaxType("");
    setPrice(""); setSellingPrice(""); setStock(""); setTax(""); setDescription(""); setImageUrl("");
    autoGenerateSku();
  };

  const modalConfig = {
    category: { title: "Category", label: "Category", onSave: async (v: string) => {
      const res = await inventoryApi.createCategory({ companyId, name: v });
      if (res.success) { setCategories(p => [...p, v]); setCategory(v); }
    }},
    brand: { title: "Brand", label: "Brand", onSave: async (v: string) => {
      const res = await inventoryApi.createBrand({ companyId, name: v });
      if (res.success) { setBrands(p => [...p, v]); setBrand(v); }
    }},
    unit: { title: "Unit", label: "Unit", onSave: async (v: string) => {
      const res = await inventoryApi.createUnit({ companyId, name: v });
      if (res.success) { setUnits(p => [...p, v]); setUnit(v); }
    }},
    warehouse: { title: "Warehouse", label: "Warehouse", onSave: async (v: string) => {
      const res = await inventoryApi.createWarehouse({ companyId, name: v, location: 'Default' });
      if (res.success) { setWarehouses(p => [...p, v]); setWarehouse(v); }
    }},
    tax: { title: "Tax Type", label: "Tax", onSave: async (v: string, p?: number) => {
      const res = await inventoryApi.createTaxType({ companyId, name: v, percentage: p || 0 });
      if (res.success) {
        setTaxTypes(prev => [...prev, { name: v, percentage: p || 0 }]);
        setTaxType(v); setTax((p || 0).toString());
      }
    }},
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6 pb-12 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <button onClick={() => navigate('/admin/inventory/products')} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Primary Info */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Tag size={18} /></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Metadata</h3>
              </div>
              <Input label="Product Name" placeholder="e.g. Wireless Headphones" value={name} onChange={e => setName(e.target.value)} required />
              <div className="grid grid-cols-2 gap-5">
                <Input label="SKU" placeholder="PROD-01" value={sku} onChange={e => setSku(e.target.value)} required />
                <CreatableSelect label="Category" value={category} onChange={setCategory} options={categories} onAdd={() => setModal('category')} placeholder="Select category" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <CreatableSelect label="Brand" value={brand} onChange={setBrand} options={brands} onAdd={() => setModal('brand')} placeholder="Select brand" />
                <CreatableSelect label="Unit" value={unit} onChange={setUnit} options={units} onAdd={() => setModal('unit')} placeholder="Select unit" />
              </div>
              <CreatableSelect label="Warehouse" value={warehouse} onChange={setWarehouse} options={warehouses} onAdd={() => setModal('warehouse')} placeholder="Select warehouse" />
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><IndianRupee size={18} /></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Attributes</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input label="Purchase Price" type="number" value={price} onChange={e => setPrice(e.target.value)} leftIcon={<IndianRupee size={14} />} />
                <Input label="Selling Price" type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} leftIcon={<IndianRupee size={14} />} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <CreatableSelect label="Tax Type" value={taxType} onChange={handleTaxTypeChange} options={taxTypes.map(t => t.name)} onAdd={() => setModal('tax')} placeholder="Select tax" />
                <Input label="Tax Percent (%)" type="number" value={tax} onChange={e => setTax(e.target.value)} leftIcon={<Percent size={14} />} />
              </div>
              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-slate-50">
                <div className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Amount (Incl. Tax)</span>
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Calculator size={16} />
                    <span className="text-xl font-bold">Rs. {totalAmount}</span>
                  </div>
                </div>
                {!isEdit && (
                  <Input label="Opening Stock" type="number" value={stock} onChange={e => setStock(e.target.value)} leftIcon={<Database size={14} />} />
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <Textarea label="Product Description" placeholder="Full product details..." rows={4} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Image Section */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6 sticky top-24">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><ImageIcon size={18} /></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Image</h3>
              </div>
              
              <div onClick={() => fileInputRef.current?.click()} className="aspect-square relative rounded-[1.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden">
                {imageUrl ? (
                  <>
                    <img src={imageUrl.startsWith('data:') || imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`} alt="P" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/400x400?text=No+Image'; }}/>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white gap-2 transition-opacity">
                       <Upload size={24} /> <span className="text-xs font-bold">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      {uploading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={32} />}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">Upload Image</p>
                    </div>
                  </>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="pt-4 border-t border-slate-50">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Initial Status</label>
                <select className="w-full h-12 px-4 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-900 font-medium focus:outline-none transition" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-3 pt-4">
                <Button variant="primary" fullWidth onClick={handleSaveProduct} disabled={loading || uploading} className="bg-[#002147] h-14 text-[13px] font-bold rounded-2xl shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                  {loading ? 'Saving...' : isEdit ? 'Update Changes' : 'Create Product'}
                </Button>
                <Button variant="secondary" fullWidth leftIcon={<RotateCcw size={18} />} onClick={handleClear} className="h-14 text-[13px] font-bold border-slate-100 text-slate-500 hover:bg-slate-50">Reset Form</Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {modal && (
        <QuickAddModal title={modalConfig[modal].title} label={modalConfig[modal].label} onClose={() => setModal(null)} onSave={modalConfig[modal].onSave} isTax={modal === 'tax'} />
      )}
    </>
  );
};

export default AddProductPage;
