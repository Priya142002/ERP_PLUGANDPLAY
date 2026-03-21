import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
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

// Mock data for demonstration
const MOCK_CUSTOMERS: Record<string, any> = {
  '1': {
    name: 'Nexus Enterprises',
    code: 'CUST-001',
    type: 'business',
    email: 'contact@nexus.com',
    phone: '+1 555-0123',
    contactPerson: 'John Smith',
    taxId: 'TX-99881',
    website: 'https://nexus.com',
    address: '123 Business Loop',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'us',
    terms: 'net30',
    currency: 'usd',
    priceList: 'std',
    status: 'active'
  },
  '2': {
    name: 'Tech Solutions Inc',
    code: 'CUST-002',
    type: 'business',
    email: 'billing@techsolutions.com',
    phone: '+1 555-0124',
    contactPerson: 'Sarah Johnson',
    taxId: 'TX-99882',
    website: 'https://techsolutions.com',
    address: '456 Tech Park',
    city: 'Austin',
    state: 'TX',
    postalCode: '73301',
    country: 'us',
    terms: 'net15',
    currency: 'usd',
    priceList: 'wholesale',
    status: 'active'
  }
};

export const EditCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const customer = id ? MOCK_CUSTOMERS[id] : null;

  const [formData, setFormData] = useState(customer || {});

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Customer not found</h2>
        <Button onClick={() => navigate('/admin/sales/customers')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-4 pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/sales/customers')}
            className="group flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={16} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-1">Edit Customer: {formData.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Main Form Area */}
        <div className="md:col-span-2 space-y-3">
          {/* Customer Type & Basic Info */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-3 mb-1 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                <User size={16} />
              </div>
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Customer Architecture</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <Select 
                label="Customer Type" 
                options={[
                  { label: 'Business', value: 'business' },
                  { label: 'Individual', value: 'individual' }
                ]} 
                value={formData.type}
                onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
              />
              <Input 
                label="Customer Code" 
                placeholder="CUST-006" 
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required 
              />
            </div>

            <Input 
              label="Customer Name" 
              placeholder="e.g. Acme Corp" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Tax ID / VAT Number" 
                placeholder="TAX-998877" 
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
              <Input 
                label="Website" 
                placeholder="https://example.com" 
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                leftIcon={<Globe size={14} />} 
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-3 mb-1 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                <Phone size={16} />
              </div>
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Contact Person" 
                placeholder="Manager Name" 
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
              <Input 
                label="Phone Number" 
                placeholder="+1 234 567 890" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone size={14} />} 
                required 
              />
            </div>
            
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="billing@customer.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail size={14} />} 
              required 
            />
          </div>

          {/* Address */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-3 mb-1 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <MapPin size={16} />
              </div>
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Address Details</h3>
            </div>
            <Textarea 
              label="Street Address" 
              placeholder="456 Avenue, Building A" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2} 
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              <Input label="State / Province" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Postal Code" placeholder="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
              <Select 
                label="Country" 
                options={[
                  { label: 'United States', value: 'us' },
                  { label: 'United Kingdom', value: 'uk' },
                  { label: 'Canada', value: 'ca' }
                ]} 
                value={formData.country}
                onChange={(e: any) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="space-y-3">
          {/* Sales Settings */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-3 mb-1 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                <CreditCard size={16} />
              </div>
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sales Info</h3>
            </div>
            <Select 
              label="Credit Terms" 
              options={[
                { label: 'Net 15', value: 'net15' },
                { label: 'Net 30', value: 'net30' },
                { label: 'Due on Receipt', value: 'due_receipt' }
              ]} 
              value={formData.terms}
              onChange={(e: any) => setFormData({ ...formData, terms: e.target.value })}
            />
            <Select 
              label="Currency" 
              options={[{ label: 'USD ($)', value: 'usd' }, { label: 'EUR (€)', value: 'eur' }]} 
              value={formData.currency}
              onChange={(e: any) => setFormData({ ...formData, currency: e.target.value })}
            />
             <Select 
              label="Price List" 
              options={[
                { label: 'Standard Price', value: 'std' },
                { label: 'Wholesale Price', value: 'wholesale' }
              ]} 
              value={formData.priceList}
              onChange={(e: any) => setFormData({ ...formData, priceList: e.target.value })}
            />
          </div>

          {/* Status */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
             <Select 
              label="Account Status" 
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]} 
              value={formData.status}
              onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              onClick={() => navigate('/admin/sales/customers')}
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Update Customer
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              onClick={() => setFormData(customer)}
              className="h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black active:scale-[0.98] transition-all"
            >
              Reset Interface
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
