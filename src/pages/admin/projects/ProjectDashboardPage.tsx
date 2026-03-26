import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Plus,
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Zap
} from 'lucide-react';

const ProjectDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Q1 2026');

  // Summary Cards Data
  const summaryCards = [
    {
      title: 'Total Projects',
      value: '48',
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+8 Weekly',
      trend: 'up',
      icon: Activity,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Completed Projects',
      value: '18',
      change: '+3 This Month',
      trend: 'up',
      icon: CheckCircle,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    {
      title: 'Total Tasks',
      value: '184',
      change: '+32 Weekly',
      trend: 'up',
      icon: Target,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Project Budget',
      value: '₹2,40,000',
      change: '72% Used',
      trend: 'neutral',
      icon: DollarSign,
      color: '#06b6d4',
      bgColor: '#cffafe'
    },
    {
      title: 'Resource Utilization',
      value: '88%',
      change: 'Optimal',
      trend: 'up',
      icon: Users,
      color: '#ec4899',
      bgColor: '#fce7f3'
    }
  ];

  // Project Status Breakdown
  const projectStatus = [
    { label: 'Ongoing', count: 24, percentage: 50, color: '#3b82f6' },
    { label: 'Completed', count: 18, percentage: 37.5, color: '#10b981' },
    { label: 'Delayed', count: 6, percentage: 12.5, color: '#ef4444' }
  ];

  // Task Summary
  const taskSummary = [
    { label: 'Pending', count: 68, percentage: 37, color: '#f59e0b' },
    { label: 'Completed', count: 98, percentage: 53, color: '#10b981' },
    { label: 'Overdue', count: 18, percentage: 10, color: '#ef4444' }
  ];

  // Financial Overview
  const financialData = {
    totalBudget: 240000,
    totalExpenses: 172800,
    remaining: 67200,
    percentageUsed: 72
  };

  // High Priority Projects
  const highPriorityProjects = [
    {
      id: 1,
      name: 'Infrastructure Modernization',
      status: 'On Track',
      progress: 75,
      lead: 'Jordan T.',
      deadline: 'Mar 30, 2026',
      budget: '₹80,000',
      tasks: { completed: 45, total: 60 }
    },
    {
      id: 2,
      name: 'Core ERP Migration',
      status: 'In Review',
      progress: 42,
      lead: 'Alex M.',
      deadline: 'Apr 15, 2026',
      budget: '₹70,000',
      tasks: { completed: 21, total: 50 }
    },
    {
      id: 3,
      name: 'Supply Chain Sync',
      status: 'Finishing',
      progress: 90,
      lead: 'Sara K.',
      deadline: 'Mar 25, 2026',
      budget: '₹60,000',
      tasks: { completed: 54, total: 60 }
    }
  ];

  // Upcoming Deadlines
  const upcomingDeadlines = [
    { project: 'Supply Chain Sync', date: 'Mar 25, 2026', daysLeft: 2, priority: 'high' },
    { project: 'Infrastructure Modernization', date: 'Mar 30, 2026', daysLeft: 7, priority: 'medium' },
    { project: 'Mobile App Development', date: 'Apr 10, 2026', daysLeft: 18, priority: 'medium' },
    { project: 'Core ERP Migration', date: 'Apr 15, 2026', daysLeft: 23, priority: 'low' }
  ];

  // Recent Activities
  const recentActivities = [
    { action: 'Project Created', project: 'Cloud Migration', user: 'John D.', time: '2 hours ago', type: 'create' },
    { action: 'Task Completed', project: 'Infrastructure Modernization', user: 'Jordan T.', time: '4 hours ago', type: 'complete' },
    { action: 'Budget Updated', project: 'Core ERP Migration', user: 'Alex M.', time: '6 hours ago', type: 'update' },
    { action: 'Milestone Reached', project: 'Supply Chain Sync', user: 'Sara K.', time: '1 day ago', type: 'milestone' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Strategic project management and resource tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#002147]"
          >
            <option>Q1 2026</option>
            <option>Q2 2026</option>
            <option>Q3 2026</option>
            <option>Q4 2026</option>
          </select>
          <button
            onClick={() => navigate('/admin/projects/create')}
            className="flex items-center gap-2 px-6 h-10 rounded-xl bg-[#002147] hover:bg-[#003366] text-white text-sm font-bold transition shadow-lg"
          >
            <Plus size={16} />
            Create Project
          </button>
          <button
            className="flex items-center gap-2 px-6 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition"
          >
            <Download size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              {card.trend === 'up' && (
                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <ArrowUp size={12} />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium">{card.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Status Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Project Status Breakdown</h3>
              <BarChart3 size={20} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {projectStatus.map((status, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">{status.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">{status.count}</span>
                      <span className="text-xs text-slate-500">{status.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${status.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Task Summary</h3>
              <Target size={20} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {taskSummary.map((task, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">{task.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">{task.count}</span>
                      <span className="text-xs text-slate-500">{task.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Priority Projects */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">High Priority Projects</h3>
              <Zap size={20} className="text-amber-500" />
            </div>
            <div className="space-y-4">
              {highPriorityProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{project.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {project.lead}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {project.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          {project.budget}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === 'On Track'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'In Review'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Tasks: {project.tasks.completed}/{project.tasks.total}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Financial Overview */}
          <div className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Financial Overview</h3>
              <DollarSign size={20} className="opacity-80" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs opacity-70 mb-1">Total Budget</p>
                <p className="text-2xl font-bold">₹{(financialData.totalBudget / 1000).toFixed(0)}K</p>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  style={{ width: `${financialData.percentageUsed}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70 mb-1">Expenses</p>
                  <p className="text-lg font-bold">₹{(financialData.totalExpenses / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">Remaining</p>
                  <p className="text-lg font-bold">₹{(financialData.remaining / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget Used</span>
                  <span className="text-lg font-bold">{financialData.percentageUsed}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h3>
              <Clock size={20} className="text-slate-400" />
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 mb-1">{deadline.project}</p>
                    <p className="text-xs text-slate-500">{deadline.date}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      deadline.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : deadline.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {deadline.daysLeft}d
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
              <Activity size={20} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'create'
                        ? 'bg-blue-100 text-blue-600'
                        : activity.type === 'complete'
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'update'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {activity.type === 'create' && <Plus size={14} />}
                    {activity.type === 'complete' && <CheckCircle size={14} />}
                    {activity.type === 'update' && <FileText size={14} />}
                    {activity.type === 'milestone' && <TrendingUp size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.project}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;
