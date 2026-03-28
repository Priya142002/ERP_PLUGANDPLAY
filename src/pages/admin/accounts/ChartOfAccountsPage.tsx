import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Download, Edit, ChevronDown, X, Trash2, MoreVertical, Loader2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";
import { accountsApi } from "../../../services/api";
import toast from "react-hot-toast";

const TreeNode: React.FC<{ node: any; depth: number; onEdit?: (node: any) => void; onAdd?: (node: any) => void; onDelete?: (node: any) => void }> = ({ node, depth, onEdit, onAdd, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const [showMenu, setShowMenu] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`group relative flex items-center gap-2 rounded-xl transition-all ${
          depth === 0 ? 'mt-4 first:mt-0' : 'mt-1'
        }`}
      >
        <div className="flex items-center" style={{ width: `${depth * 32}px` }}>
          {depth > 0 && (
            <div className="h-px w-6 bg-slate-200 ml-auto mr-2" />
          )}
        </div>
        
        <div className="relative flex items-center">
          {depth > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" style={{ left: `${(depth * 32) - 16}px` }} />
          )}
          
          {hasChildren ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#002147] hover:text-[#002147] transition-all z-10 shadow-sm"
            >
              <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`} />
            </button>
          ) : (
            <div className="h-7 w-7 flex items-center justify-center z-10">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 py-1.5 px-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 min-w-[40px]">{node.accountCode}</span>
            <span className={`text-sm tracking-tight ${depth === 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
              - {node.accountName.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={
              node.accountType === 'Asset' ? 'info' : 
              node.accountType === 'Liability' ? 'warning' : 
              node.accountType === 'Equity' ? 'primary' : 
              node.accountType === 'Income' ? 'success' : 'error'
            } className="text-[10px] uppercase font-bold tracking-tighter">
              {node.accountType}
            </Badge>
            <span className="text-sm font-bold text-slate-900 min-w-[100px] text-right">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(node.currentBalance || node.openingBalance || 0)}
            </span>
            
            <div className="relative flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-1.5 text-slate-400 hover:text-[#002147] rounded-md"
                title="More options"
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        onAdd?.(node);
                      }} 
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Plus size={14} />
                      Add Sub-Account
                    </button>
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        onEdit?.(node);
                      }} 
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    {!node.isSystemAccount && (
                      <button 
                        onClick={() => {
                          setShowMenu(false);
                          onDelete?.(node);
                        }} 
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="relative">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ChartOfAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [isAddingSubAccount, setIsAddingSubAccount] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'Asset',
    accountGroup: '',
    openingBalance: 0,
    openingBalanceType: 'Debit',
    isGroup: false,
    currency: 'INR'
  });

  const companyId = JSON.parse(localStorage.getItem('erp_user') || '{}').companyId || 1;

  useEffect(() => {
    fetchAccounts();
  }, [companyId]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getChart(companyId);
      if (res.success && res.data) {
        setAccounts(res.data);
        buildTree(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch chart of accounts");
    } finally {
      setLoading(false);
    }
  };

  const buildTree = (flatData: any[]) => {
    const map = new Map();
    const tree: any[] = [];
    
    // Sort by code to ensure deterministic tree structure
    const sortedData = [...flatData].sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    sortedData.forEach(item => {
      map.set(item.accountCode, { ...item, children: [] });
    });

    sortedData.forEach(item => {
      const node = map.get(item.accountCode);
      if (item.parentAccountCode && map.has(item.parentAccountCode)) {
        map.get(item.parentAccountCode).children.push(node);
      } else {
        tree.push(node);
      }
    });

    setTreeData(tree);
  };

  const handleExport = () => {
    const headers = ['Code', 'Account Name', 'Type', 'Group', 'Balance', 'Parent'];
    const data = accounts.map(a => [
      a.accountCode,
      a.accountName,
      a.accountType,
      a.accountGroup,
      a.currentBalance || a.openingBalance,
      a.parentAccountCode || ''
    ]);
    
    exportSingleSheetToExcel(headers, data, 'Chart_of_Accounts');
  };

  const handleEdit = (node: any) => {
    setEditingNode(node);
    setFormData({
      accountCode: node.accountCode,
      accountName: node.accountName,
      accountType: node.accountType,
      accountGroup: node.accountGroup,
      openingBalance: node.openingBalance,
      openingBalanceType: node.openingBalanceType || 'Debit',
      isGroup: node.isGroup,
      currency: node.currency || 'INR'
    });
    setIsAddingSubAccount(false);
    setIsModalOpen(true);
  };

  const handleAdd = (node: any) => {
    setEditingNode(node);
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: node.accountType, // Inherit from parent
      accountGroup: node.accountGroup,
      openingBalance: 0,
      openingBalanceType: 'Debit',
      isGroup: false,
      currency: 'INR'
    });
    setIsAddingSubAccount(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        companyId,
        parentAccountCode: isAddingSubAccount ? editingNode.accountCode : (editingNode?.parentAccountCode || null),
        level: isAddingSubAccount ? (editingNode.level + 1) : (editingNode?.level || 1)
      };

      let res;
      if (editingNode && !isAddingSubAccount) {
        res = await accountsApi.updateAccount(editingNode.id, payload);
      } else {
        res = await accountsApi.createAccount(payload);
      }

      if (res.success) {
        toast.success(res.message || "Account saved successfully");
        fetchAccounts();
        handleCloseModal();
      } else {
        toast.error(res.message || "Failed to save account");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  const handleDelete = (node: any) => {
    setNodeToDelete(node);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await accountsApi.deleteAccount(nodeToDelete.id);
      if (res.success) {
        toast.success("Account deleted");
        fetchAccounts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to delete account");
    }
    setIsDeleteModalOpen(false);
    setNodeToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNode(null);
    setIsAddingSubAccount(false);
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: 'Asset',
      accountGroup: '',
      openingBalance: 0,
      openingBalanceType: 'Debit',
      isGroup: false,
      currency: 'INR'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Taxonomies</h1>
          <p className="text-slate-500 text-sm">Manage your company chart of accounts and hierarchy</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-[10px] md:text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsModalOpen(true)}
          >
            New Account
          </Button>
        </div>
      </div>

      {/* Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Account Details"
        size="lg"
        showCloseButton={false} 
        contentClassName="p-0 overflow-hidden rounded-xl border-none shadow-2xl"
      >
        <div className="bg-[#002147] px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">
            {isAddingSubAccount ? 'Add Sub-Account' : editingNode ? 'Edit Account' : 'New Account'}
          </h3>
          <button onClick={handleCloseModal} className="text-white/80 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isAddingSubAccount && editingNode && (
            <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600 mb-1">Parent Account:</p>
              <p className="text-sm font-semibold text-slate-900">{editingNode.accountCode} - {editingNode.accountName}</p>
            </div>
          )}
          
          <Input 
            label="Account Code" 
            placeholder="e.g. 1001" 
            value={formData.accountCode}
            onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
            className="border-slate-200"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Input 
            label="Account Name" 
            placeholder="Enter name" 
            value={formData.accountName}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            className="border-slate-200"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Select 
            label="Account Type" 
            value={formData.accountType}
            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
            options={[
              { label: 'Asset', value: 'Asset' },
              { label: 'Liability', value: 'Liability' },
              { label: 'Equity', value: 'Equity' },
              { label: 'Income', value: 'Income' },
              { label: 'Expense', value: 'Expense' },
            ]} 
            className="border-slate-200"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Input 
            label="Account Group" 
            placeholder="e.g. Current Asset" 
            value={formData.accountGroup}
            onChange={(e) => setFormData({ ...formData, accountGroup: e.target.value })}
            className="border-slate-200"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Input 
            label="Opening Balance" 
            type="number"
            value={formData.openingBalance}
            onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
            className="border-slate-200"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Select 
            label="Balance Type" 
            value={formData.openingBalanceType}
            onChange={(e) => setFormData({ ...formData, openingBalanceType: e.target.value })}
            options={[
              { label: 'Debit', value: 'Debit' },
              { label: 'Credit', value: 'Credit' }
            ]} 
            className="border-slate-200"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          
          <div className="col-span-2 flex items-center gap-2">
             <input 
               type="checkbox" 
               id="isGroup" 
               className="h-4 w-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]"
               checked={formData.isGroup} 
               onChange={(e) => setFormData({...formData, isGroup: e.target.checked})}
             />
             <label htmlFor="isGroup" className="text-sm font-medium text-slate-700">This is a Group Account (cannot have transactions directly)</label>
          </div>

          <div className="col-span-2 flex items-center justify-center gap-3 pt-4">
            <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] h-11 px-10" onClick={handleSave}>
              Save Account
            </Button>
            <Button variant="outline" className="h-11 px-10" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
        showCloseButton={false}
      >
        <div className="p-6 text-center space-y-4">
          <Trash2 className="mx-auto text-red-500" size={48} />
          <p className="text-slate-700">Are you sure you want to delete <b>{nodeToDelete?.accountName}</b>?</p>
          <div className="flex justify-center gap-3">
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] p-4 md:p-8 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading Chart of Accounts...</p>
          </div>
        ) : treeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 text-center">
            <div className="bg-slate-50 rounded-full p-4 mb-4">
              <Plus size={32} className="text-slate-300" />
            </div>
            <p>No accounts found. Start by creating a new account.</p>
            <Button variant="primary" className="mt-4 bg-[#002147]" onClick={() => setIsModalOpen(true)}>Create First Account</Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-2">
            {treeData.map(node => (
              <TreeNode key={node.id} node={node} depth={0} onEdit={handleEdit} onAdd={handleAdd} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex gap-6 uppercase tracking-widest">
            <span>Total Records: <span className="text-slate-900">{accounts.length}</span></span>
          </div>
          <span>Active Session: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChartOfAccountsPage;
