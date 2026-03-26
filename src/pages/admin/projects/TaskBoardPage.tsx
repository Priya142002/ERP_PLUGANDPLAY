import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, X, Clock, MessageSquare,
  MoreVertical, Edit, CheckCircle2, Calendar
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  startDate: string;
  dueDate: string;
  tags: string[];
  comments: number;
  createdDate: string;
  statusUpdates?: StatusUpdate[];
  projectId: string;
}

interface StatusUpdate {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  type: 'comment' | 'status_change';
}

interface Project {
  id: string;
  name: string;
  code: string;
  color: string;
}

const TaskBoardPage: React.FC = () => {
  // Sample projects
  const [projects] = useState<Project[]>([
    { id: '1', name: 'ERP System Redesign', code: 'ERP-001', color: 'bg-blue-500' },
    { id: '2', name: 'Mobile App Development', code: 'MOB-002', color: 'bg-green-500' },
    { id: '3', name: 'Cloud Migration', code: 'CLD-003', color: 'bg-purple-500' },
    { id: '4', name: 'Security Audit', code: 'SEC-004', color: 'bg-red-500' },
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0].id);

  // Sample team members for assignee dropdown
  const teamMembers = [
    'Jordan T.',
    'Sarah M.',
    'Alex K.',
    'Maria G.',
    'David L.',
    'Emma W.',
    'John Doe',
    'Jane Smith'
  ];

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Sync architecture patterns with core engine standards',
      description: 'Review and align architecture patterns',
      status: 'backlog',
      priority: 'medium',
      assignee: 'Jordan T.',
      startDate: '2026-03-20',
      dueDate: '2026-03-28',
      tags: ['Backend', 'Architecture'],
      comments: 3,
      createdDate: '2026-03-20',
      projectId: '1',
      statusUpdates: [
        {
          id: '1',
          user: 'Jordan T.',
          message: 'Started working on the architecture review',
          timestamp: '2026-03-20T10:30:00',
          type: 'comment'
        },
        {
          id: '2',
          user: 'System',
          message: 'Status changed from "To Do" to "Backlog"',
          timestamp: '2026-03-20T14:15:00',
          type: 'status_change'
        },
        {
          id: '3',
          user: 'Sarah M.',
          message: 'Please review the core engine documentation before proceeding',
          timestamp: '2026-03-21T09:00:00',
          type: 'comment'
        }
      ]
    },
    {
      id: '2',
      title: 'Implement user authentication flow',
      description: 'Add OAuth2 and JWT authentication',
      status: 'inprogress',
      priority: 'urgent',
      assignee: 'Sarah M.',
      startDate: '2026-03-21',
      dueDate: '2026-03-27',
      tags: ['Security', 'Frontend'],
      comments: 5,
      createdDate: '2026-03-21',
      projectId: '1',
      statusUpdates: [
        {
          id: '1',
          user: 'Sarah M.',
          message: 'OAuth2 integration completed',
          timestamp: '2026-03-22T11:00:00',
          type: 'comment'
        },
        {
          id: '2',
          user: 'System',
          message: 'Status changed from "Backlog" to "In Progress"',
          timestamp: '2026-03-22T11:30:00',
          type: 'status_change'
        },
        {
          id: '3',
          user: 'Alex K.',
          message: 'Great progress! Let me know if you need help with JWT',
          timestamp: '2026-03-23T14:20:00',
          type: 'comment'
        },
        {
          id: '4',
          user: 'Sarah M.',
          message: 'JWT token generation is working. Testing refresh tokens now.',
          timestamp: '2026-03-24T10:45:00',
          type: 'comment'
        },
        {
          id: '5',
          user: 'Jordan T.',
          message: 'Looks good! Make sure to add rate limiting.',
          timestamp: '2026-03-25T16:00:00',
          type: 'comment'
        }
      ]
    },
    {
      id: '3',
      title: 'Design mobile app UI mockups',
      description: 'Create wireframes and high-fidelity designs',
      status: 'backlog',
      priority: 'high',
      assignee: 'Emma W.',
      startDate: '2026-03-22',
      dueDate: '2026-03-30',
      tags: ['Design', 'UI/UX'],
      comments: 0,
      createdDate: '2026-03-22',
      projectId: '2',
      statusUpdates: []
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'backlog' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignee: '',
    startDate: '',
    dueDate: '',
    tags: [] as string[],
    projectId: selectedProjectId,
  });

  const columns = [
    { id: 'backlog', label: 'BACKLOG', color: 'bg-slate-400', count: tasks.filter(t => t.status === 'backlog' && t.projectId === selectedProjectId).length },
    { id: 'inprogress', label: 'IN PROGRESS', color: 'bg-blue-500', count: tasks.filter(t => t.status === 'inprogress' && t.projectId === selectedProjectId).length },
    { id: 'done', label: 'DONE', color: 'bg-emerald-500', count: tasks.filter(t => t.status === 'done' && t.projectId === selectedProjectId).length },
  ];

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600 border-slate-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const priorityColorsDark = {
    low: 'bg-slate-600 text-slate-100 border-slate-500',
    medium: 'bg-yellow-600 text-yellow-100 border-yellow-500',
    high: 'bg-orange-600 text-orange-100 border-orange-500',
    urgent: 'bg-rose-600 text-rose-100 border-rose-500',
  };

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      projectId: selectedProjectId,
      comments: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, task]);
    setShowCreateModal(false);
    setNewTask({
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      assignee: '',
      startDate: '',
      dueDate: '',
      tags: [],
      projectId: selectedProjectId,
    });
  };

  const handleEditTask = () => {
    if (editTask) {
      setTasks(tasks.map(task => task.id === editTask.id ? editTask : task));
      setShowEditModal(false);
      setSelectedTask(null);
      setEditTask(null);
    }
  };

  const handleOpenEditModal = () => {
    if (selectedTask) {
      setEditTask({ ...selectedTask });
      setShowEditModal(true);
      setSelectedTask(null);
    }
  };

  const handleOpenCommentsModal = (task: Task) => {
    setSelectedTask(task);
    setShowCommentsModal(true);
  };

  const handleAddComment = () => {
    if (selectedTask && commentText.trim()) {
      const newComment: StatusUpdate = {
        id: Date.now().toString(),
        user: 'Current User', // Replace with actual logged-in user
        message: commentText,
        timestamp: new Date().toISOString(),
        type: 'comment'
      };
      
      const updatedTask = {
        ...selectedTask,
        statusUpdates: [...(selectedTask.statusUpdates || []), newComment],
        comments: (selectedTask.statusUpdates || []).filter(u => u.type === 'comment').length + 1
      };
      
      setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
      setSelectedTask(updatedTask);
      setCommentText('');
    }
  };

  const handleReassignTask = (taskId: string, newAssignee: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, assignee: newAssignee } : task
    ));
    setShowAssigneeDropdown(null);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Task Board</h1>
          <p className="text-slate-500 text-sm mt-1">Assign, track, and execute collaborative tasks</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Project Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.code} - {project.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 h-10 bg-[#002147] hover:bg-[#003366] text-white rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} /> Create & Assign Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 h-[calc(100vh-220px)] min-h-[600px]">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[320px] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task['status'])}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {column.label}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {column.count}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasks
                .filter(task => task.status === column.id && task.projectId === selectedProjectId)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task.id)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-move group"
                    onClick={() => setSelectedTask(task)}
                  >
                    {/* Project Badge & Priority */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${projects.find(p => p.id === task.projectId)?.color || 'bg-gray-500'} text-white`}>
                          {projects.find(p => p.id === task.projectId)?.code}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      <button className="p-1 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition">
                        <MoreVertical size={14} className="text-slate-400" />
                      </button>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2 line-clamp-2">
                      {task.title}
                    </h4>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {task.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAssigneeDropdown(showAssigneeDropdown === task.id ? null : task.id);
                          }}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold hover:ring-2 hover:ring-blue-300 transition cursor-pointer"
                        >
                          {task.assignee.charAt(0)}
                        </button>
                        
                        {/* Assignee Dropdown */}
                        {showAssigneeDropdown === task.id && (
                          <div 
                            className="absolute left-0 top-8 z-50 bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-[180px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="px-3 py-1.5 border-b border-slate-100">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Reassign to</p>
                            </div>
                            {teamMembers.map((member) => (
                              <button
                                key={member}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReassignTask(task.id, member);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 transition flex items-center gap-2 ${
                                  task.assignee === member ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-900'
                                }`}
                              >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[9px]">
                                  {member.charAt(0)}
                                </div>
                                {member}
                                {task.assignee === member && (
                                  <span className="ml-auto text-blue-600 font-bold">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <span className="text-[10px] font-medium text-slate-600">
                          {task.assignee}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {task.comments > 0 && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <MessageSquare size={12} />
                            <span className="text-[10px] font-medium">{task.comments}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-rose-500">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Plus size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project *</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.code} - {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Implement user authentication"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe the task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assignee *</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select assignee</option>
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Backend, API, Security"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title || !newTask.assignee || !newTask.startDate || !newTask.dueDate}
                className="px-6 py-2.5 text-sm font-medium bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Task Details</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 bg-white">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedTask.title}</h3>
                <p className="text-sm text-slate-600">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{selectedTask.status}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedTask.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assignee</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedTask.assignee}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {selectedTask.tags.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCommentsModal(selectedTask);
                  }}
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
                >
                  <MessageSquare size={16} />
                  <span className="text-sm">{selectedTask.comments} Comments</span>
                </button>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} />
                  <span className="text-sm">Created {new Date(selectedTask.createdDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={handleOpenEditModal}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition"
              >
                <Edit size={16} />
                Edit Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Edit size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Task</h2>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditTask(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Implement user authentication"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe the task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={editTask.status}
                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value as Task['status'] })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={editTask.startDate}
                    onChange={(e) => setEditTask({ ...editTask, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assignee *</label>
                  <select
                    value={editTask.assignee}
                    onChange={(e) => setEditTask({ ...editTask, assignee: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select assignee</option>
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={editTask.dueDate}
                    onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTask.tags.join(', ')}
                  onChange={(e) => setEditTask({ ...editTask, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Backend, API, Security"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditTask(null);
                }}
                className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTask}
                disabled={!editTask.title || !editTask.assignee || !editTask.startDate || !editTask.dueDate}
                className="px-6 py-2.5 text-sm font-medium bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comments & Status Updates Modal */}
      {showCommentsModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MessageSquare size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Comments & Updates</h2>
                  <p className="text-xs text-slate-500">{selectedTask.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCommentsModal(false);
                  setCommentText('');
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body - Comments List */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
              {selectedTask.statusUpdates && selectedTask.statusUpdates.length > 0 ? (
                selectedTask.statusUpdates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-4 rounded-xl ${
                      update.type === 'status_change'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {update.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">{update.user}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(update.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {update.type === 'status_change' && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                              Status Update
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700">{update.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Add Comment */}
            <div className="p-6 bg-white border-t border-slate-200">
              <div className="flex gap-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Add a comment or status update..."
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-6 py-2.5 text-sm font-medium bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskBoardPage;
