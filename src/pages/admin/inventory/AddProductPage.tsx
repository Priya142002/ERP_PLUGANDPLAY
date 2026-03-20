import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, ArrowLeft, Tag, DollarSign, Database,
  Image as ImageIcon, Save, RotateCcw, X
} from "lucide-react";
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
}
const CreatableSelect: React.FC<CreatableSelectProps> = ({
  label, value, onChange, options, onAdd, placeholder = "Select…"
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
    <div className="flex gap-2 items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <button
        type="button"
        onClick={onAdd}
        title={`Add new ${label}`}
        className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition"
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
  onSave: (value: string) => void;
}
const QuickAddModal: React.FC<QuickAddModalProps> = ({ title, label, onClose, onSave }) => {
  const [val, setVal] = useState("");
  const handleSave = () => {
    if (val.trim()) { onSave(val.trim()); onClose(); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-base">Add New {title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X size={18} />
          </button>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{label} Name</label>
          <input
            autoFocus
            type="text"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder={`Enter ${label.toLowerCase()} name…`}
            className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center"
            style={{ minHeight: '48px', height: '48px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!val.trim()}
            className="flex-1 h-12 rounded-lg bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
            style={{ minHeight: '48px', height: '48px' }}
          >
            Add {title}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── main page ── */
export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  // dropdown options state
  const [categories, setCategories] = useState(["Electronics", "Furniture", "Clothing", "Accessories"]);
  const [brands, setBrands] = useState(["Sony", "Apple", "Logitech", "Samsung"]);
  const [units, setUnits] = useState(["Pcs (Piece)", "Kg (Kilogram)", "Box", "Litre"]);
  const [warehouses, setWarehouses] = useState(["Main Warehouse", "North Store", "South Store"]);

  // selected values
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [warehouse, setWarehouse] = useState("");

  // modal state
  const [modal, setModal] = useState<null | 'category' | 'brand' | 'unit' | 'warehouse'>(null);

  const modalConfig = {
    category:  { title: "Category",  label: "Category",  onSave: (v: string) => { setCategories(p => [...p, v]);  setCategory(v);  } },
    brand:     { title: "Brand",     label: "Brand",     onSave: (v: string) => { setBrands(p => [...p, v]);      setBrand(v);     } },
    unit:      { title: "Unit",      label: "Unit",      onSave: (v: string) => { setUnits(p => [...p, v]);       setUnit(v);      } },
    warehouse: { title: "Warehouse", label: "Warehouse", onSave: (v: string) => { setWarehouses(p => [...p, v]);  setWarehouse(v); } },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6 pb-12"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/inventory/products')}
            className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Product</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ── Left: Main Details ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Tag size={16} /></div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Primary Metadata</h3>
              </div>

              <Input label="Product Name" placeholder="e.g. Wireless Headphones" required />

              <div className="grid grid-cols-2 gap-4">
                <Input label="SKU" placeholder="PROD-10293" required />
                {/* Category with + */}
                <CreatableSelect
                  label="Category"
                  value={category}
                  onChange={setCategory}
                  options={categories}
                  onAdd={() => setModal('category')}
                  placeholder="Select category"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand with + */}
                <CreatableSelect
                  label="Brand"
                  value={brand}
                  onChange={setBrand}
                  options={brands}
                  onAdd={() => setModal('brand')}
                  placeholder="Select brand"
                />
                {/* Unit of Measure with + */}
                <CreatableSelect
                  label="Unit of Measure"
                  value={unit}
                  onChange={setUnit}
                  options={units}
                  onAdd={() => setModal('unit')}
                  placeholder="Select unit"
                />
              </div>

              {/* Warehouse with + */}
              <CreatableSelect
                label="Warehouse"
                value={warehouse}
                onChange={setWarehouse}
                options={warehouses}
                onAdd={() => setModal('warehouse')}
                placeholder="Select warehouse"
              />
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign size={16} /></div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Financial Dimensions</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Purchase Price" type="number" placeholder="0.00" leftIcon={<DollarSign size={14} />} />
                <Input label="Selling Price"  type="number" placeholder="0.00" leftIcon={<DollarSign size={14} />} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Tax Percentage (%)" type="number" placeholder="5" />
                <Input label="Opening Stock"      type="number" placeholder="0" leftIcon={<Database size={14} />} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <Textarea label="Product Description" placeholder="Write detailed information about the product…" rows={4} />
            </div>
          </div>

          {/* ── Right: Media & Actions ── */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Initial Status</label>
              <select className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><ImageIcon size={16} /></div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Visual Assets</h3>
              </div>
              <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 p-6 cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Plus size={24} />
                </div>
                <p className="text-xs font-medium text-slate-500 text-center">Click to upload product image</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">JPG, PNG, WebP up to 5MB</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="primary" fullWidth leftIcon={<Save size={18} />}
                className="py-4 bg-[#002147] hover:bg-[#003366] border-none shadow-lg rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                Commit Product
              </Button>
              <Button variant="secondary" fullWidth leftIcon={<RotateCcw size={18} />}
                className="py-4 rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                Clear Workspace
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick-Add Modal */}
      {modal && (
        <QuickAddModal
          title={modalConfig[modal].title}
          label={modalConfig[modal].label}
          onClose={() => setModal(null)}
          onSave={modalConfig[modal].onSave}
        />
      )}
    </>
  );
};

export default AddProductPage;
