import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, X, Trash2, Calendar, DollarSign,
  Clock, Users, Briefcase, FileText, AlertCircle, CheckCircle2,
  Upload, Bell, Target, File, FolderOpen, Download, Eye
} from 'lucide-react';
import Button from '../../../components/ui/Button';

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";
const selectCls = `${fieldCls} appearance-none`;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  allocation: string;
}

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  assignedTo: string;
  status: string;
  priority: string;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: string;
  date: string;
  // Domain/Server specific fields
  domainName?: string;
  serverName?: string;
  provider?: string;
  renewalDate?: string;
  specifications?: string;
  // File upload
  billFile?: File | null;
  billFileName?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  category?: string;
  uploadDate?: string;
  uploadedBy?: string;
}

// Creatable Select Component for dynamic category addition
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
  const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";
  const fieldCls = "flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";

  const handleAdd = () => {
    if (newVal.trim()) {
      onAddNew(newVal.trim());
      onChange(newVal.trim());
      setNewVal('');
      setAdding(false);
    }
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      {adding ? (
        <div className="flex gap-2 items-center">
          <input
            autoFocus
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setAdding(false);
            }}
            placeholder={`New ${label.toLowerCase()}...`}
            className={fieldCls}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="h-10 px-4 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition whitespace-nowrap"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls}>
            <option value="">Select...</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAdding(true)}
            title={`Add new ${label}`}
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition"
          >
            <Plus size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'budget' | 'timesheet' | 'expenses' | 'tasks' | 'documents' | 'drive' | 'notifications'>('basic');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Basic Project Info
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    code: '',
    clientName: '',
    description: '',
    projectType: 'Fixed',
    startDate: '',
    endDate: '',
    status: 'Planned',
    priority: 'Medium',
    projectManager: '',
    teamLeader: '',
    department: '',
    completionDate: '',
  });

  // Budget & Financial Details
  const [budget, setBudget] = useState({
    totalBudget: '',
    billingType: 'Fixed',
    hourlyRate: '',
    estimatedCost: '',
    currency: 'USD',
    paymentTerms: '',
    advanceAmount: '',
    laborCost: '',
    materialCost: '',
    overheadCost: '',
  });

  // Timesheet Configuration
  const [timesheetConfig, setTimesheetConfig] = useState({
    enableTimesheet: true,
    timeTrackingType: 'Manual',
    billableHours: true,
    maxHoursLimit: '',
    approvalRequired: false,
  });

  // Expense Management
  const [expenseConfig, setExpenseConfig] = useState({
    enableExpenseTracking: true,
    budgetLimit: '',
    uploadBills: true,
    approvalFlow: true,
    selectedCategories: ['Travel', 'Food', 'Software', 'Misc', 'Domain Purchase', 'Server Purchase'],
  });
  const [expenseCategories, setExpenseCategories] = useState<string[]>(['Travel', 'Food', 'Software', 'Misc', 'Domain Purchase', 'Server Purchase']);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({ 
    category: 'Travel', 
    description: '', 
    amount: '', 
    date: '',
    domainName: '',
    serverName: '',
    provider: '',
    renewalDate: '',
    specifications: '',
    billFile: null as File | null,
    billFileName: '',
  });

  // Dropdown options for CreatableSelect
  const [projectTypes, setProjectTypes] = useState<string[]>(['Fixed', 'Hourly', 'Internal']);
  const [priorities, setPriorities] = useState<string[]>(['Low', 'Medium', 'High']);
  const [projectStatuses, setProjectStatuses] = useState<string[]>(['Planned', 'Ongoing', 'Completed']);
  const [currencies, setCurrencies] = useState<string[]>(['USD', 'EUR', 'GBP', 'INR']);

  // Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', allocation: '' });

  // Milestones & Tasks
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({ name: '', dueDate: '' });
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [newTask, setNewTask] = useState({ name: '', assignedTo: '', status: 'Pending', priority: 'Medium' });

  // Documents
  const [documents] = useState<Document[]>([]);

  // Drive / File Management
  const [driveFiles, setDriveFiles] = useState<Document[]>([]);
  const [driveFolderCreated, setDriveFolderCreated] = useState(false);
  const [selectedFileCategory, setSelectedFileCategory] = useState('Project Documents');

  // Notifications & Alerts
  const [notifications, setNotifications] = useState({
    deadlineAlerts: true,
    budgetAlerts: true,
    taskUpdates: true,
  });

  const addTeamMember = () => {
    if (newMember.name && newMember.role) {
      setTeamMembers([...teamMembers, { ...newMember, id: Date.now().toString() }]);
      setNewMember({ name: '', role: '', allocation: '' });
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const addMilestone = () => {
    if (newMilestone.name && newMilestone.dueDate) {
      setMilestones([...milestones, { ...newMilestone, id: Date.now().toString(), tasks: [] }]);
      setNewMilestone({ name: '', dueDate: '' });
    }
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const addTask = (milestoneId: string) => {
    if (newTask.name) {
      setMilestones(milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, tasks: [...m.tasks, { ...newTask, id: Date.now().toString() }] }
          : m
      ));
      setNewTask({ name: '', assignedTo: '', status: 'Pending', priority: 'Medium' });
    }
  };

  const removeTask = (milestoneId: string, taskId: string) => {
    setMilestones(milestones.map(m =>
      m.id === milestoneId
        ? { ...m, tasks: m.tasks.filter(t => t.id !== taskId) }
        : m
    ));
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now().toString() }]);
      setNewExpense({ 
        category: 'Travel', 
        description: '', 
        amount: '', 
        date: '',
        domainName: '',
        serverName: '',
        provider: '',
        renewalDate: '',
        specifications: '',
        billFile: null,
        billFileName: '',
      });
    }
  };

  const addExpenseCategory = (newCategory: string) => {
    if (!expenseCategories.includes(newCategory)) {
      setExpenseCategories([...expenseCategories, newCategory]);
    }
  };

  const addProjectType = (newType: string) => {
    if (!projectTypes.includes(newType)) {
      setProjectTypes([...projectTypes, newType]);
    }
  };

  const addPriority = (newPriority: string) => {
    if (!priorities.includes(newPriority)) {
      setPriorities([...priorities, newPriority]);
    }
  };

  const addProjectStatus = (newStatus: string) => {
    if (!projectStatuses.includes(newStatus)) {
      setProjectStatuses([...projectStatuses, newStatus]);
    }
  };

  const addCurrency = (newCurrency: string) => {
    if (!currencies.includes(newCurrency)) {
      setCurrencies([...currencies, newCurrency]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewExpense({ ...newExpense, billFile: file, billFileName: file.name });
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleDriveFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = e.target.files;
    if (files) {
      const newFiles: Document[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type || 'Unknown',
        size: (file.size / 1024).toFixed(2) + ' KB',
        category: category,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User', // In real app, get from auth context
      }));
      setDriveFiles([...driveFiles, ...newFiles]);
    }
  };

  const removeDriveFile = (id: string) => {
    setDriveFiles(driveFiles.filter(f => f.id !== id));
  };

  const downloadDriveFile = (file: Document) => {
    // Simulate download
    console.log('Downloading file:', file);
    alert(`Downloading: ${file.name}`);
  };

  const handleSubmit = () => {
    // Check if project is being marked as completed
    if (projectInfo.status === 'Completed') {
      // Validate completion date
      if (!projectInfo.completionDate) {
        alert('⚠️ Please set a completion date for the completed project.');
        return;
      }

      // Set completion date
      const completionDate = projectInfo.completionDate;
      
      // Update project with completion date
      const completedProjectData = {
        ...projectInfo,
        completionDate,
      };

      // Simulate customer update (in real app, this would be an API call)
      const customerUpdate = {
        customerName: projectInfo.clientName,
        status: 'Project Completed',
        tags: ['Completed Client'],
        lastProjectCompletionDate: completionDate,
        customerType: 'Completed / Retained',
      };

      // Create Drive folder automatically
      const driveFolderName = `${projectInfo.name || 'Project'}_${projectInfo.code || 'ID'}`;
      console.log('Creating Drive Folder:', driveFolderName);
      setDriveFolderCreated(true);

      console.log('Project Data:', { 
        projectInfo: completedProjectData, 
        budget, 
        timesheetConfig, 
        expenseConfig, 
        teamMembers, 
        milestones, 
        expenses, 
        documents, 
        driveFiles,
        notifications 
      });
      
      console.log('Customer Update:', customerUpdate);

      // Show detailed success message
      const successMessage = `✅ Project Completed Successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Project Details:
   • Name: ${projectInfo.name || 'N/A'}
   • Status: Completed
   • Completion Date: ${completionDate}

👤 Customer Status Updated:
   • Customer: ${projectInfo.clientName || 'N/A'}
   • Status: Project Completed
   • Tag: Completed Client
   • Type: Completed / Retained
   • Last Completion: ${completionDate}

📁 Drive Folder Created:
   • Folder: ${projectInfo.name || 'Project'}_${projectInfo.code || 'ID'}
   • Files Stored: ${driveFiles.length}
   • Location: /Projects/${projectInfo.name || 'Project'}_${projectInfo.code || 'ID'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All changes have been saved successfully.`;

      alert(successMessage);
    } else {
      console.log('Project Data:', { 
        projectInfo, 
        budget, 
        timesheetConfig, 
        expenseConfig, 
        teamMembers, 
        milestones, 
        expenses, 
        documents, 
        notifications 
      });
      
      alert('✅ Project created successfully!');
    }
    
    navigate('/admin/projects/list');
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Briefcase },
    { id: 'budget', label: 'Budget & Financial', icon: DollarSign },
    { id: 'timesheet', label: 'Timesheet Config', icon: Clock },
    { id: 'expenses', label: 'Expense Management', icon: FileText },
    { id: 'tasks', label: 'Tasks & Milestones', icon: Target },
    { id: 'documents', label: 'Documents', icon: File },
    { id: 'drive', label: 'Drive', icon: FolderOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/projects/list')}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Project</h1>
            <p className="text-slate-500 text-sm mt-1">Complete all project details and configurations</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/projects/list')}
            className="px-4 h-10"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            leftIcon={<Save size={16} />}
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10"
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#002147] shadow-md'
                  : 'hover:bg-slate-50'
              }`}
            >
              <tab.icon 
                size={14} 
                color={isActive ? '#ffffff' : (isHovered ? '#000000' : '#64748b')}
                style={{ transition: 'color 0.2s' }}
              />
              <span style={{ color: isActive ? '#ffffff' : (isHovered ? '#000000' : '#64748b'), transition: 'color 0.2s' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Project Information</h3>
                <p className="text-xs text-slate-500">Basic details about the project</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Project Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className={fieldCls}
                  value={projectInfo.name}
                  onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
                  placeholder="e.g., Infrastructure Modernization"
                />
              </div>

              <div>
                <label className={labelCls}>Project Code / ID</label>
                <input
                  type="text"
                  className={fieldCls}
                  value={projectInfo.code}
                  onChange={(e) => setProjectInfo({ ...projectInfo, code: e.target.value })}
                  placeholder="e.g., PRJ-001"
                />
              </div>

              <div>
                <label className={labelCls}>Client Name</label>
                <input
                  type="text"
                  className={fieldCls}
                  value={projectInfo.clientName}
                  onChange={(e) => setProjectInfo({ ...projectInfo, clientName: e.target.value })}
                  placeholder="Client or stakeholder name"
                />
              </div>

              <CreatableSelect
                label="Project Type *"
                value={projectInfo.projectType}
                onChange={(v) => setProjectInfo({ ...projectInfo, projectType: v })}
                options={projectTypes}
                onAddNew={addProjectType}
              />

              <div className="md:col-span-2">
                <label className={labelCls}>Project Description</label>
                <textarea
                  rows={4}
                  className={`${fieldCls} h-auto py-2.5 resize-none`}
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                  placeholder="Detailed project description..."
                />
              </div>

              <div>
                <label className={labelCls}>Start Date <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  className={fieldCls}
                  value={projectInfo.startDate}
                  onChange={(e) => setProjectInfo({ ...projectInfo, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className={labelCls}>End Date / Deadline <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  className={fieldCls}
                  value={projectInfo.endDate}
                  onChange={(e) => setProjectInfo({ ...projectInfo, endDate: e.target.value })}
                />
              </div>

              <CreatableSelect
                label="Project Status *"
                value={projectInfo.status}
                onChange={(v) => {
                  const newStatus = v;
                  setProjectInfo({ 
                    ...projectInfo, 
                    status: newStatus,
                    // Auto-set completion date when status changes to Completed
                    completionDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : projectInfo.completionDate
                  });
                }}
                options={projectStatuses}
                onAddNew={addProjectStatus}
              />

              {/* Completion Date - Only show when status is Completed */}
              {projectInfo.status === 'Completed' && (
                <div className="md:col-span-2">
                  <label className={labelCls}>Completion Date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    className={fieldCls}
                    value={projectInfo.completionDate}
                    onChange={(e) => setProjectInfo({ ...projectInfo, completionDate: e.target.value })}
                  />
                  <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Marking as completed will update customer status to 'Project Completed'
                  </p>
                </div>
              )}

              <CreatableSelect
                label="Priority *"
                value={projectInfo.priority}
                onChange={(v) => setProjectInfo({ ...projectInfo, priority: v })}
                options={priorities}
                onAddNew={addPriority}
              />

              <div>
                <label className={labelCls}>Project Manager <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className={fieldCls}
                  value={projectInfo.projectManager}
                  onChange={(e) => setProjectInfo({ ...projectInfo, projectManager: e.target.value })}
                  placeholder="Manager name"
                />
              </div>

              <div>
                <label className={labelCls}>Team Leader</label>
                <input
                  type="text"
                  className={fieldCls}
                  value={projectInfo.teamLeader}
                  onChange={(e) => setProjectInfo({ ...projectInfo, teamLeader: e.target.value })}
                  placeholder="Team leader name"
                />
              </div>

              <div>
                <label className={labelCls}>Department</label>
                <input
                  type="text"
                  className={fieldCls}
                  value={projectInfo.department}
                  onChange={(e) => setProjectInfo({ ...projectInfo, department: e.target.value })}
                  placeholder="Department name"
                />
              </div>
            </div>

            {/* Project Completion Impact Notice */}
            {projectInfo.status === 'Completed' && (
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle2 size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-green-900 mb-2">Project Completion Actions</h4>
                    <p className="text-xs text-green-700 mb-3">
                      When you save this project as completed, the following actions will be triggered:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Project Status:</span> Updated to "Completed"
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Completion Date:</span> Set to {projectInfo.completionDate || 'today'}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Customer Update:</span> Customer "{projectInfo.clientName || 'N/A'}" status will be updated to "Project Completed"
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Customer Tag:</span> "Completed Client" label will be added
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Customer Type:</span> Updated from "Active" to "Completed / Retained"
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Last Project Completion Date:</span> Stored in customer record
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members Assignment Section */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Users size={18} className="text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-700">Team Members (Assign Users)</h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Add team members and their roles for this project
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelCls}>Member Name</label>
                  <input
                    type="text"
                    className={fieldCls}
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <input
                    type="text"
                    className={fieldCls}
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Developer"
                  />
                </div>
                <div>
                  <label className={labelCls}>Allocation (%)</label>
                  <input
                    type="number"
                    className={fieldCls}
                    value={newMember.allocation}
                    onChange={(e) => setNewMember({ ...newMember, allocation: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addTeamMember}
                    className="w-full h-10 bg-[#002147] text-white rounded-lg font-medium hover:bg-[#003366] transition flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
              
              {/* Team Members List */}
              <div className="mt-4 space-y-3">
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No team members added yet</p>
                  </div>
                ) : (
                  teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role} • {member.allocation}% Allocated</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTeamMember(member.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Budget & Financial Tab */}
        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Budget & Expenses</h3>
                <p className="text-xs text-slate-500">Manage project budget and track expenses</p>
              </div>
            </div>

            {/* Budget Information */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Budget Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Total Budget</label>
                  <input
                    type="number"
                    className={fieldCls}
                    value={budget.totalBudget}
                    onChange={(e) => setBudget({ ...budget, totalBudget: e.target.value })}
                    placeholder="100000"
                  />
                </div>
                <CreatableSelect
                  label="Currency"
                  value={budget.currency}
                  onChange={(v) => setBudget({ ...budget, currency: v })}
                  options={currencies}
                  onAddNew={addCurrency}
                />
                <div>
                  <label className={labelCls}>Labor Cost</label>
                  <input
                    type="number"
                    className={fieldCls}
                    value={budget.laborCost}
                    onChange={(e) => setBudget({ ...budget, laborCost: e.target.value })}
                    placeholder="60000"
                  />
                </div>
                <div>
                  <label className={labelCls}>Material Cost</label>
                  <input
                    type="number"
                    className={fieldCls}
                    value={budget.materialCost}
                    onChange={(e) => setBudget({ ...budget, materialCost: e.target.value })}
                    placeholder="30000"
                  />
                </div>
                <div>
                  <label className={labelCls}>Overhead Cost</label>
                  <input
                    type="number"
                    className={fieldCls}
                    value={budget.overheadCost}
                    onChange={(e) => setBudget({ ...budget, overheadCost: e.target.value })}
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            {/* Add Expense Form */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Add Expense</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <CreatableSelect
                    label="Category"
                    value={newExpense.category}
                    onChange={(v) => setNewExpense({ ...newExpense, category: v })}
                    options={expenseCategories}
                    onAddNew={addExpenseCategory}
                  />
                  <div className="md:col-span-2">
                    <label className={labelCls}>Description</label>
                    <input
                      type="text"
                      className={fieldCls}
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="Expense description"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Amount</label>
                    <input
                      type="number"
                      className={fieldCls}
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={addExpense}
                    className="px-6 h-10 bg-[#002147] text-white rounded-lg font-medium hover:bg-[#003366] transition flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Expense
                  </button>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <DollarSign size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No expenses recorded yet</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-slate-700">Recorded Expenses</h4>
                    <span className="text-sm font-bold text-slate-900">
                      Total: {budget.currency} {expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0).toFixed(2)}
                    </span>
                  </div>
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <DollarSign size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{expense.description}</p>
                          <p className="text-xs text-slate-500">{expense.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-900">{budget.currency} {expense.amount}</span>
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Timesheet Configuration Tab */}
        {activeTab === 'timesheet' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Timesheet Configuration</h3>
                <p className="text-xs text-slate-500">Control how time is tracked for this project</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Time Tracking Settings</h4>
              </div>
              
              <div className="space-y-6">
                {/* Enable Timesheet */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Enable Timesheet</label>
                    <p className="text-xs text-slate-500 mt-1">Allow team members to log time for this project</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timesheetConfig.enableTimesheet}
                      onChange={(e) => setTimesheetConfig({ ...timesheetConfig, enableTimesheet: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                  </label>
                </div>

                {/* Time Tracking Type */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">Time Tracking Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTimesheetConfig({ ...timesheetConfig, timeTrackingType: 'Manual' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        timesheetConfig.timeTrackingType === 'Manual'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={18} className={timesheetConfig.timeTrackingType === 'Manual' ? 'text-blue-600' : 'text-slate-400'} />
                        <span className={`text-sm font-bold ${timesheetConfig.timeTrackingType === 'Manual' ? 'text-blue-600' : 'text-slate-700'}`}>
                          Manual
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Team members manually enter hours</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimesheetConfig({ ...timesheetConfig, timeTrackingType: 'Timer' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        timesheetConfig.timeTrackingType === 'Timer'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className={timesheetConfig.timeTrackingType === 'Timer' ? 'text-blue-600' : 'text-slate-400'} />
                        <span className={`text-sm font-bold ${timesheetConfig.timeTrackingType === 'Timer' ? 'text-blue-600' : 'text-slate-700'}`}>
                          Timer
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Use built-in timer to track time</p>
                    </button>
                  </div>
                </div>

                {/* Billable Hours */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Billable Hours</label>
                    <p className="text-xs text-slate-500 mt-1">Mark logged hours as billable to client</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timesheetConfig.billableHours}
                      onChange={(e) => setTimesheetConfig({ ...timesheetConfig, billableHours: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                  </label>
                </div>

                {/* Max Hours Limit */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Max Hours Limit (Optional)</label>
                  <p className="text-xs text-slate-500 mb-3">Set maximum hours that can be logged per day/week</p>
                  <input
                    type="number"
                    className={fieldCls}
                    value={timesheetConfig.maxHoursLimit}
                    onChange={(e) => setTimesheetConfig({ ...timesheetConfig, maxHoursLimit: e.target.value })}
                    placeholder="e.g., 8 hours per day"
                  />
                </div>

                {/* Approval Required */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Approval Required</label>
                    <p className="text-xs text-slate-500 mt-1">Require manager approval for logged hours</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timesheetConfig.approvalRequired}
                      onChange={(e) => setTimesheetConfig({ ...timesheetConfig, approvalRequired: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Configuration Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${timesheetConfig.enableTimesheet ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs text-slate-600">Timesheet: {timesheetConfig.enableTimesheet ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-600">Tracking: {timesheetConfig.timeTrackingType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${timesheetConfig.billableHours ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs text-slate-600">Billable: {timesheetConfig.billableHours ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${timesheetConfig.approvalRequired ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs text-slate-600">Approval: {timesheetConfig.approvalRequired ? 'Required' : 'Not Required'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Expense Management Tab */}
        {activeTab === 'expenses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Expense Management</h3>
                <p className="text-xs text-slate-500">Track all project expenses and purchases</p>
              </div>
            </div>

            {/* Expense Configuration */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Expense Tracking Settings</h4>
              </div>
              
              <div className="space-y-4">
                {/* Enable Expense Tracking */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Enable Expense Tracking</label>
                    <p className="text-xs text-slate-500 mt-1">Allow team to record project expenses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expenseConfig.enableExpenseTracking}
                      onChange={(e) => setExpenseConfig({ ...expenseConfig, enableExpenseTracking: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                  </label>
                </div>

                {/* Budget Limit */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Budget Limit for Expenses</label>
                  <p className="text-xs text-slate-500 mb-3">Set maximum budget for project expenses</p>
                  <input
                    type="number"
                    className={fieldCls}
                    value={expenseConfig.budgetLimit}
                    onChange={(e) => setExpenseConfig({ ...expenseConfig, budgetLimit: e.target.value })}
                    placeholder="e.g., 50000"
                  />
                </div>

                {/* Upload Bills Option */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Upload Bills / Receipts Option</label>
                    <p className="text-xs text-slate-500 mt-1">Allow uploading expense receipts and bills</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expenseConfig.uploadBills}
                      onChange={(e) => setExpenseConfig({ ...expenseConfig, uploadBills: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                  </label>
                </div>

                {/* Approval Flow */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">Approval Flow (Manager Approval)</label>
                    <p className="text-xs text-slate-500 mt-1">Require manager approval for expenses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expenseConfig.approvalFlow}
                      onChange={(e) => setExpenseConfig({ ...expenseConfig, approvalFlow: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Expense Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {expenseCategories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-700">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Expense Form */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Add New Expense</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CreatableSelect
                    label="Category"
                    value={newExpense.category}
                    onChange={(v) => setNewExpense({ ...newExpense, category: v })}
                    options={expenseCategories}
                    onAddNew={addExpenseCategory}
                  />
                  <div>
                    <label className={labelCls}>Amount</label>
                    <input
                      type="number"
                      className={fieldCls}
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <input
                    type="text"
                    className={fieldCls}
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Expense description"
                  />
                </div>

                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    className={fieldCls}
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>

                {/* Domain/Server Specific Fields */}
                {(newExpense.category === 'Domain Purchase' || newExpense.category === 'Server Purchase') && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload size={16} className="text-blue-600" />
                      <h5 className="text-sm font-bold text-blue-900">
                        {newExpense.category === 'Domain Purchase' ? 'Domain Details' : 'Server Details'}
                      </h5>
                    </div>

                    {newExpense.category === 'Domain Purchase' && (
                      <>
                        <div>
                          <label className={labelCls}>Domain Name</label>
                          <input
                            type="text"
                            className={fieldCls}
                            value={newExpense.domainName}
                            onChange={(e) => setNewExpense({ ...newExpense, domainName: e.target.value })}
                            placeholder="e.g., example.com"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Provider</label>
                          <input
                            type="text"
                            className={fieldCls}
                            value={newExpense.provider}
                            onChange={(e) => setNewExpense({ ...newExpense, provider: e.target.value })}
                            placeholder="e.g., GoDaddy, Namecheap"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Renewal Date</label>
                          <input
                            type="date"
                            className={fieldCls}
                            value={newExpense.renewalDate}
                            onChange={(e) => setNewExpense({ ...newExpense, renewalDate: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {newExpense.category === 'Server Purchase' && (
                      <>
                        <div>
                          <label className={labelCls}>Server Name</label>
                          <input
                            type="text"
                            className={fieldCls}
                            value={newExpense.serverName}
                            onChange={(e) => setNewExpense({ ...newExpense, serverName: e.target.value })}
                            placeholder="e.g., Production Server 1"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Provider</label>
                          <input
                            type="text"
                            className={fieldCls}
                            value={newExpense.provider}
                            onChange={(e) => setNewExpense({ ...newExpense, provider: e.target.value })}
                            placeholder="e.g., AWS, DigitalOcean, Azure"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Specifications</label>
                          <textarea
                            rows={2}
                            className={`${fieldCls} h-auto py-2.5 resize-none`}
                            value={newExpense.specifications}
                            onChange={(e) => setNewExpense({ ...newExpense, specifications: e.target.value })}
                            placeholder="e.g., 4 CPU, 8GB RAM, 100GB SSD"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Renewal Date</label>
                          <input
                            type="date"
                            className={fieldCls}
                            value={newExpense.renewalDate}
                            onChange={(e) => setNewExpense({ ...newExpense, renewalDate: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* File Upload Section */}
                {expenseConfig.uploadBills && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      Upload Bill / Receipt
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 h-10 px-4 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
                          <Upload size={16} className="text-slate-500" />
                          <span className="text-sm text-slate-600">
                            {newExpense.billFileName || 'Choose file...'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {newExpense.billFileName && (
                        <button
                          type="button"
                          onClick={() => setNewExpense({ ...newExpense, billFile: null, billFileName: '' })}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                )}

                <button
                  onClick={addExpense}
                  className="w-full h-10 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Expense
                </button>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  <DollarSign size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No expenses recorded yet</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-slate-700">Recorded Expenses</h4>
                    <span className="text-sm font-bold text-emerald-600">
                      Total: ${expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0).toFixed(2)}
                    </span>
                  </div>
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <DollarSign size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-slate-900">{expense.description}</p>
                              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                {expense.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{expense.date}</p>
                            
                            {/* Domain/Server Details Display */}
                            {expense.domainName && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs">
                                <p><span className="font-semibold">Domain:</span> {expense.domainName}</p>
                                {expense.provider && <p><span className="font-semibold">Provider:</span> {expense.provider}</p>}
                                {expense.renewalDate && <p><span className="font-semibold">Renewal:</span> {expense.renewalDate}</p>}
                              </div>
                            )}
                            {expense.serverName && (
                              <div className="mt-2 p-2 bg-purple-50 rounded-lg text-xs">
                                <p><span className="font-semibold">Server:</span> {expense.serverName}</p>
                                {expense.provider && <p><span className="font-semibold">Provider:</span> {expense.provider}</p>}
                                {expense.specifications && <p><span className="font-semibold">Specs:</span> {expense.specifications}</p>}
                                {expense.renewalDate && <p><span className="font-semibold">Renewal:</span> {expense.renewalDate}</p>}
                              </div>
                            )}
                            
                            {/* Bill/Receipt File Display */}
                            {expense.billFileName && (
                              <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                                <Upload size={14} className="text-amber-600" />
                                <span className="text-xs font-medium text-amber-900">{expense.billFileName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-slate-900">${expense.amount}</span>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Documents & Attachments Tab */}
        {activeTab === 'documents' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <File size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Documents & Attachments</h3>
                <p className="text-xs text-slate-500">Store important project files and documents</p>
              </div>
            </div>

            {/* Upload Documents Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Upload size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Upload Documents</h4>
              </div>
              
              <div className="space-y-4">
                {/* Project Files */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">Project Files</label>
                  <p className="text-xs text-slate-500 mb-3">Upload project-related documents, specifications, designs</p>
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 h-24 px-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                      <Upload size={20} className="text-slate-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">Click to upload project files</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC, XLS, PPT, ZIP (Max 10MB)</p>
                      </div>
                    </div>
                    <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" className="hidden" />
                  </label>
                </div>

                {/* Contracts */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">Contracts</label>
                  <p className="text-xs text-slate-500 mb-3">Upload signed contracts, agreements, NDAs</p>
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 h-24 px-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                      <Upload size={20} className="text-slate-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">Click to upload contracts</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC (Max 10MB)</p>
                      </div>
                    </div>
                    <input type="file" multiple accept=".pdf,.doc,.docx" className="hidden" />
                  </label>
                </div>

                {/* Notes */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-800 mb-3">Notes</label>
                  <p className="text-xs text-slate-500 mb-3">Add meeting notes, project notes, documentation</p>
                  <textarea
                    rows={4}
                    className={`${fieldCls} h-auto py-2.5 resize-none`}
                    placeholder="Type your project notes here..."
                  />
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Uploaded Documents</h4>
              {documents.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <File size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                          <File size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Drive / File Management Tab */}
        {activeTab === 'drive' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FolderOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Drive / File Management</h3>
                <p className="text-xs text-slate-500">Store and manage project files, deliverables, and documents</p>
              </div>
            </div>

            {/* Folder Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Project Folder</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {projectInfo.name || 'Project Name'}_{projectInfo.code || 'ID'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {projectInfo.status === 'Completed' && driveFolderCreated 
                        ? '✅ Folder created automatically on project completion' 
                        : '📁 Folder will be created when project is marked as completed'}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    projectInfo.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {projectInfo.status === 'Completed' ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>📊 {driveFiles.length} Files</span>
                  <span>📂 Location: /Projects/{projectInfo.name || 'Project'}_{projectInfo.code || 'ID'}</span>
                </div>
              </div>
            </div>

            {/* File Categories */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">File Categories</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Project Documents', 'Final Deliverables', 'Reports / Invoice'].map((category) => (
                  <div key={category} className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-sky-400 hover:bg-sky-50 transition">
                    <div className="flex items-center gap-2 mb-3">
                      <File size={16} className="text-sky-600" />
                      <h5 className="text-sm font-semibold text-slate-800">{category}</h5>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      {driveFiles.filter(f => f.category === category).length} files
                    </p>
                    <label className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 h-10 px-4 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm font-medium">
                        <Upload size={14} />
                        Upload Files
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleDriveFileUpload(e, category)}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Files List */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-700">All Files</h4>
                <div className="flex items-center gap-2">
                  <select
                    className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    value={selectedFileCategory}
                    onChange={(e) => setSelectedFileCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Project Documents">Project Documents</option>
                    <option value="Final Deliverables">Final Deliverables</option>
                    <option value="Reports / Invoice">Reports / Invoice</option>
                  </select>
                </div>
              </div>

              {driveFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FolderOpen size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No files uploaded yet</p>
                  <p className="text-xs mt-1">Upload files to the categories above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {driveFiles
                    .filter(file => selectedFileCategory === 'All' || file.category === selectedFileCategory)
                    .map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                            <File size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full font-medium">
                                {file.category}
                              </span>
                              <span className="text-xs text-slate-500">{file.size}</span>
                              <span className="text-xs text-slate-500">
                                📅 {file.uploadDate}
                              </span>
                              <span className="text-xs text-slate-500">
                                👤 {file.uploadedBy}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => console.log('View file:', file)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => downloadDriveFile(file)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => removeDriveFile(file.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Drive Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                <p className="text-xs text-sky-600 font-bold uppercase tracking-wider mb-1">Total Files</p>
                <p className="text-2xl font-bold text-sky-900">{driveFiles.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Project Documents</p>
                <p className="text-2xl font-bold text-blue-900">
                  {driveFiles.filter(f => f.category === 'Project Documents').length}
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Deliverables</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {driveFiles.filter(f => f.category === 'Final Deliverables').length}
                </p>
              </div>
            </div>

            {/* Auto-creation Notice */}
            {projectInfo.status !== 'Completed' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">Automatic Folder Creation</p>
                    <p className="text-xs text-amber-700">
                      When you mark this project as "Completed", a dedicated folder will be automatically created in Drive 
                      with the name "{projectInfo.name || 'Project'}_{projectInfo.code || 'ID'}". All uploaded files will be 
                      organized in this folder for easy access and management.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Notifications & Alerts Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Notifications & Alerts</h3>
                <p className="text-xs text-slate-500">Configure automation settings and alerts</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Bell size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Alert Settings</h4>
              </div>
              
              <div className="space-y-4">
                {/* Deadline Alerts */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-800">Deadline Alerts</label>
                      <p className="text-xs text-slate-500 mt-1">Get notified before project and task deadlines</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.deadlineAlerts}
                        onChange={(e) => setNotifications({ ...notifications, deadlineAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                    </label>
                  </div>
                  {notifications.deadlineAlerts && (
                    <div className="pt-3 border-t border-slate-100">
                      <label className={labelCls}>Alert Before (Days)</label>
                      <select className={selectCls}>
                        <option>1 Day</option>
                        <option>3 Days</option>
                        <option>7 Days</option>
                        <option>14 Days</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Budget Alerts */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-800">Budget Alerts</label>
                      <p className="text-xs text-slate-500 mt-1">Get notified when budget threshold is reached</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.budgetAlerts}
                        onChange={(e) => setNotifications({ ...notifications, budgetAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                    </label>
                  </div>
                  {notifications.budgetAlerts && (
                    <div className="pt-3 border-t border-slate-100">
                      <label className={labelCls}>Alert at Budget Usage (%)</label>
                      <select className={selectCls}>
                        <option>50%</option>
                        <option>75%</option>
                        <option>90%</option>
                        <option>100%</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Task Updates Notifications */}
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-800">Task Updates Notifications</label>
                      <p className="text-xs text-slate-500 mt-1">Get notified about task status changes and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.taskUpdates}
                        onChange={(e) => setNotifications({ ...notifications, taskUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002147]"></div>
                    </label>
                  </div>
                  {notifications.taskUpdates && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">Task assigned to me</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">Task status changed</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">Task comments added</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Summary */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Active Notifications</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${notifications.deadlineAlerts ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs text-slate-600">Deadline Alerts: {notifications.deadlineAlerts ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${notifications.budgetAlerts ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs text-slate-600">Budget Alerts: {notifications.budgetAlerts ? 'On' : 'Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${notifications.taskUpdates ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs text-slate-600">Task Updates: {notifications.taskUpdates ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tasks & Milestones Tab */}
        {activeTab === 'tasks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tasks & Milestones</h3>
                <p className="text-xs text-slate-500">Break project into work items and milestones</p>
              </div>
            </div>

            {/* Add Milestone Form */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Add New Milestone</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Milestone Name</label>
                  <input
                    type="text"
                    className={fieldCls}
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                    placeholder="e.g., Phase 1 Completion"
                  />
                </div>
                <div>
                  <label className={labelCls}>Milestone Deadline</label>
                  <input
                    type="date"
                    className={fieldCls}
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={addMilestone}
                className="mt-4 w-full h-10 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Milestone
              </button>
            </div>

            {/* Milestones List with Tasks */}
            <div className="space-y-4">
              {milestones.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  <Target size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No milestones created yet</p>
                </div>
              ) : (
                milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                  >
                    {/* Milestone Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{milestone.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Calendar size={12} />
                              Deadline: {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-3 py-1 bg-white rounded-full border border-purple-200 font-medium text-purple-700">
                            {milestone.tasks.length} Tasks
                          </span>
                          <button
                            onClick={() => removeMilestone(milestone.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add Task Form */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                      <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                        Add Task to this Milestone
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            className={`${fieldCls} text-xs`}
                            value={selectedMilestoneId === milestone.id ? newTask.name : ''}
                            onChange={(e) => {
                              setSelectedMilestoneId(milestone.id);
                              setNewTask({ ...newTask, name: e.target.value });
                            }}
                            placeholder="Task name"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            className={`${fieldCls} text-xs`}
                            value={selectedMilestoneId === milestone.id ? newTask.assignedTo : ''}
                            onChange={(e) => {
                              setSelectedMilestoneId(milestone.id);
                              setNewTask({ ...newTask, assignedTo: e.target.value });
                            }}
                            placeholder="Assigned to"
                          />
                        </div>
                        <div>
                          <select
                            className={`${selectCls} text-xs`}
                            value={selectedMilestoneId === milestone.id ? newTask.status : 'Pending'}
                            onChange={(e) => {
                              setSelectedMilestoneId(milestone.id);
                              setNewTask({ ...newTask, status: e.target.value });
                            }}
                          >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                          </select>
                        </div>
                        <div>
                          <select
                            className={`${selectCls} text-xs`}
                            value={selectedMilestoneId === milestone.id ? newTask.priority : 'Medium'}
                            onChange={(e) => {
                              setSelectedMilestoneId(milestone.id);
                              setNewTask({ ...newTask, priority: e.target.value });
                            }}
                          >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => addTask(milestone.id)}
                        className="mt-3 w-full h-8 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> Add Task
                      </button>
                    </div>

                    {/* Tasks List */}
                    <div className="p-4">
                      {milestone.tasks.length === 0 ? (
                        <p className="text-center text-xs text-slate-400 py-4">No tasks added yet</p>
                      ) : (
                        <div className="space-y-2">
                          {milestone.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  task.status === 'Completed' ? 'bg-green-500' :
                                  task.status === 'In Progress' ? 'bg-blue-500' :
                                  task.status === 'On Hold' ? 'bg-amber-500' :
                                  'bg-slate-300'
                                }`}></div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-slate-900">{task.name}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-slate-500">
                                      <Users size={10} className="inline mr-1" />
                                      {task.assignedTo || 'Unassigned'}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                      task.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {task.status}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      task.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                      task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => removeTask(milestone.id, task.id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Total Milestones</p>
                <p className="text-2xl font-bold text-purple-900">{milestones.length}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {milestones.reduce((sum, m) => sum + m.tasks.length, 0)}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Completed Tasks</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {milestones.reduce((sum, m) => sum + m.tasks.filter(t => t.status === 'Completed').length, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={20} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Project Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Team Members</p>
            <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Milestones</p>
            <p className="text-2xl font-bold text-slate-900">{milestones.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-slate-900">{budget.totalBudget || '0'}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-slate-900">{expenses.length}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateProjectPage;
