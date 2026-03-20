import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Save, 
  RotateCcw,
  CreditCard,
  User,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/customers')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">Register New Patron</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Type & Basic Info */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <User size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patron Architecture</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <Select 
                label="Customer Type" 
                options={[
                  { label: 'Business', value: 'business' },
                  { label: 'Individual', value: 'individual' }
                ]} 
                value="business"
              />
              <Input 
                label="Customer Code" 
                placeholder="CUST-006" 
                value="CUST-006"
                required 
              />
            </div>

            <Input 
              label="Customer Name" 
              placeholder="e.g. Acme Corp" 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Tax ID / VAT Number" 
                placeholder="TAX-998877" 
              />
              <Input 
                label="Website" 
                placeholder="https://example.com" 
                leftIcon={<Globe size={14} />} 
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Phone size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Strategic Contact</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Contact Person" 
                placeholder="Manager Name" 
              />
              <Input 
                label="Phone Number" 
                placeholder="+1 234 567 890" 
                leftIcon={<Phone size={14} />} 
                required 
              />
            </div>
            
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="billing@customer.com" 
              leftIcon={<Mail size={14} />} 
              required 
            />
          </div>

          {/* Address */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <MapPin size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Logistics Address</h3>
            </div>
            <Textarea 
              label="Street Address" 
              placeholder="456 Avenue, Building A" 
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
                  { label: 'Canada', value: 'ca' }
                ]} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-6">
          {/* Sales Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <CreditCard size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Commercial Dynamics</h3>
            </div>
            <Select 
              label="Credit Terms" 
              options={[
                { label: 'Net 15', value: 'net15' },
                { label: 'Net 30', value: 'net30' },
                { label: 'Due on Receipt', value: 'due_receipt' }
              ]} 
              value="net30"
            />
            <Select 
              label="Currency" 
              options={[{ label: 'USD ($)', value: 'usd' }, { label: 'EUR (€)', value: 'eur' }]} 
              value="usd"
            />
             <Select 
              label="Price List" 
              options={[
                { label: 'Standard Price', value: 'std' },
                { label: 'Wholesale Price', value: 'wholesale' }
              ]} 
              value="std"
            />
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
             <Select 
              label="Account Status" 
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]} 
              value="active"
            />
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-[#003366] text-white h-11 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Finalize Registration
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              className="h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Reset Interface
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
