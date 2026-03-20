import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings2, 
  Plus, 
  Save, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  ChevronRight
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Checkbox from "../../../components/ui/Checkbox";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";

const MOCK_REMINDERS = [
  { id: 1, module: 'Accounts', screen: 'Vouchers', field: 'Amount', subject: 'High Value Transaction Alert', category: 'Financial', channels: ['Email', 'Push'] },
  { id: 2, module: 'Inventory', screen: 'Stock', field: 'Quantity', subject: 'Low Stock Level Warning', category: 'Inventory', channels: ['Email', 'SMS'] },
  { id: 3, module: 'Sales', screen: 'Invoices', field: 'Due Date', subject: 'Invoice Overdue Notification', category: 'Sales', channels: ['Push'] },
];

export const NotificationSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reminders' | 'channels'>('reminders');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications & Reminders</h1>
            <p className="text-slate-500 mt-1">Configure automated alerts and communication preferences</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            leftIcon={<Settings2 size={18} />}
          >
            Regional Settings
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#3b4cb8] font-bold"
            leftIcon={<Plus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            New Reminder Rule
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'reminders' ? 'bg-white text-[#3b4cb8] shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          Reminder Rules
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'channels' ? 'bg-white text-[#3b4cb8] shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          Delivery Channels
        </button>
      </div>

      {activeTab === 'reminders' ? (
        <div className="space-y-4">
          {/* Reminder Rules Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter rules by module or subject..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                leftIcon={<Filter size={14} />}
                className="rounded-xl border-slate-200 h-10 px-4 text-slate-700 font-bold"
              >
                Advanced Filters
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                  <tr>
                    <th className="px-8 py-5">Source / Context</th>
                    <th className="px-6 py-5">Rule Subject</th>
                    <th className="px-6 py-5 text-center">Category</th>
                    <th className="px-6 py-5">Channels</th>
                    <th className="px-6 py-5 text-right pr-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_REMINDERS.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/20 transition-colors group cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="text-sm font-bold text-slate-900 tracking-tight leading-none">{rule.module}</div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Laptop size={11} className="shrink-0" />
                            <span>{rule.screen}</span>
                            <ChevronRight size={10} className="text-slate-300" />
                            <span className="text-indigo-400/80">{rule.field}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-bold text-slate-700 leading-tight max-w-xs">{rule.subject}</div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <Badge variant="info" className="text-[10px] py-0.5 px-2.5 font-bold uppercase tracking-wider rounded-md">
                          {rule.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-2">
                          {rule.channels.map(ch => (
                            <div key={ch} className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100 hover:text-[#3b4cb8] hover:border-indigo-100 hover:bg-white transition-all shadow-sm">
                              {ch === 'Email' && <Mail size={14} />}
                              {ch === 'SMS' && <MessageSquare size={14} />}
                              {ch === 'Push' && <Smartphone size={14} />}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right pr-8">
                        <div className="flex items-center justify-end gap-2 text-emerald-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-bold uppercase tracking-widest">Active</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tag: 'Email', icon: <Mail size={24} />, desc: 'Send automated alerts to user email addresses', active: true, color: 'text-blue-500' },
            { tag: 'SMS', icon: <MessageSquare size={24} />, desc: 'Urgent mobile text notifications (Carrier rates apply)', active: false, color: 'text-emerald-500' },
            { tag: 'Push', icon: <Smartphone size={24} />, desc: 'Web and mobile app real-time push alerts', active: true, color: 'text-amber-500' },
          ].map(channel => (
            <div key={channel.tag} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-slate-50 ${channel.color}`}>
                  {channel.icon}
                </div>
                <div className="h-6 w-11 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                  <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-all ${channel.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{channel.tag} Gateway</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{channel.desc}</p>
              </div>
              <button className="w-full py-2 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
                Configure Gateway
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Logic/Safety Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Clock size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-400" /> Scheduler Integrity</h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Notification background jobs run every 5 minutes. High-priority transaction alerts are dispatched immediately upon record creation. Ensure your SMTP and SMS gateway configurations are verified.
            </p>
          </div>
          <Button className="bg-white text-slate-900 border-none font-bold whitespace-nowrap">
            View Job Queue
          </Button>
        </div>
      </div>

      {/* Modal - Based on reminderSettingsForm.js logic */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Reminder Rule"
        size="lg"
      >
        <div className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Select 
                label="Module" 
                required 
                placeholder="Select Module"
                options={[
                  { label: 'Accounts', value: '1' },
                  { label: 'Inventory', value: '2' },
                  { label: 'Sales', value: '3' },
                ]} 
              />
              <Select 
                label="Screen" 
                placeholder="Select Screen"
                options={[{ label: 'Sales Invoice', value: '1' }]} 
              />
              <Select 
                label="Trigger Field" 
                placeholder="Select Field"
                options={[{ label: 'Due Date', value: '1' }]} 
              />
            </div>
            <div className="space-y-4">
              <Input 
                label="Subject" 
                required 
                placeholder="Notification Headline" 
              />
              <Select 
                label="Reminder Category" 
                placeholder="e.g. Due Notification"
                options={[{ label: 'Financial Due', value: '1' }]}
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Delivery Channels</label>
                <div className="flex gap-4 p-3 bg-white rounded-xl border border-slate-200">
                  <Checkbox id="ch-email" label="Email" checked={true} onChange={() => {}} />
                  <Checkbox id="ch-push" label="Push" checked={false} onChange={() => {}} />
                  <Checkbox id="ch-sms" label="SMS" checked={false} onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <AlertCircle size={18} className="text-blue-600 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Configuration Tip:</strong> Use placeholders like <code>{`{doc_no}`}</code> or <code>{`{amount}`}</code> in the subject to dynamically inject record details into the notification.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="bg-[#3b4cb8] px-8 font-bold" leftIcon={<Save size={18} />}>
              Activate Rule
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
