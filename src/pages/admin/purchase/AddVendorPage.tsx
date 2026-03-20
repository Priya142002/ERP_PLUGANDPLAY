import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  FileText, 
  Save, 
  RotateCcw,
  CreditCard
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const AddVendorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/purchase/vendors')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Strategic Vendor</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Building2 size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Company Architecture</h3>
            </div>
            
            <Input 
              label="Vendor Name" 
              placeholder="e.g. TechNova Solutions" 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Vendor Code" 
                placeholder="VND-004" 
                value="VND-004"
                required 
              />
              <Select 
                label="Vendor Category" 
                options={[
                  { label: 'Suppliers', value: 'suppliers' },
                  { label: 'Service Providers', value: 'services' },
                  { label: 'Manufacturers', value: 'manufacturers' },
                  { label: 'Wholesalers', value: 'wholesalers' }
                ]} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Tax Number / VAT" 
                placeholder="TRN12345678" 
              />
              <Input 
                label="Website" 
                placeholder="https://example.com" 
                leftIcon={<Globe size={14} />} 
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Phone size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Strategic Contact</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Contact Person" 
                placeholder="e.g. John Doe" 
                required 
              />
              <Input 
                label="Designation" 
                placeholder="e.g. Sales Manager" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="john@example.com" 
                leftIcon={<Mail size={14} />} 
                required 
              />
              <Input 
                label="Phone Number" 
                placeholder="+1 234 567 890" 
                leftIcon={<Phone size={14} />} 
                required 
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                <MapPin size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Logistics Address</h3>
            </div>
            <Textarea 
              label="Street Address" 
              placeholder="123 Business Ave, Suite 100" 
              rows={2} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" placeholder="City" />
              <Input label="State / Province" placeholder="State" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Postal Code" placeholder="Postal Code" />
              <Select 
                label="Country" 
                options={[
                  { label: 'United States', value: 'us' },
                  { label: 'United Kingdom', value: 'uk' },
                  { label: 'Canada', value: 'ca' },
                  { label: 'India', value: 'in' }
                ]} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <CreditCard size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Procurement Dynamics</h3>
            </div>
            <Select 
              label="Payment Terms" 
              options={[
                { label: 'Net 30', value: 'net30' },
                { label: 'Net 60', value: 'net60' },
                { label: 'Due on Receipt', value: 'due_receipt' }
              ]} 
              value="net30"
            />
            <Select 
              label="Currency" 
              options={[
                { label: 'USD ($)', value: 'usd' },
                { label: 'EUR (€)', value: 'eur' },
                { label: 'GBP (£)', value: 'gbp' }
              ]} 
              value="usd"
            />
             <Select 
              label="Status" 
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]} 
              value="active"
            />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <FileText size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Internal Intelligence</h3>
            </div>
            <Textarea 
              label="Internal Remarks" 
              placeholder="Add any internal notes..." 
              rows={4} 
            />
          </div>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={18} />} 
              className="py-6 bg-[#002147] hover:bg-[#003366] text-white rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all font-bold tracking-tight"
            >
              Verify & Register Vendor
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={18} />} 
              className="py-6 rounded-xl border-slate-200 text-slate-600 font-bold tracking-tight"
            >
              Reset Dynamics
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
