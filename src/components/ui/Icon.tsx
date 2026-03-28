import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  List, 
  Plus, 
  Link as LinkIcon, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  UserCircle, 
  BarChart3, 
  ClipboardList, 
  ChevronUp,
  ShieldCheck,
  Building,
  Archive,
  ShoppingCart,
  BarChart4,
  BookOpen,
  Calendar,
  Folder,
  CheckCircle,
  MessageSquare,
  LifeBuoy,
  Ticket,
  Clock,
  Database,
  Truck,
  Map,
  Receipt,
  RotateCcw,
  Banknote,
  PieChart,
  ArrowLeftRight,
  FileText,
  Copy,
  Undo,
  ClipboardCheck,
  BarChart,
  Undo2,
  Pencil,
  Package,
  LogOut,
  ChevronLeft,
  BellOff,
  RefreshCw,
  Tag,
  Puzzle,
  Code,
  Mail, 
  Factory,
  Lock
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const iconSizes = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

const icons: Record<string, React.ComponentType<any>> = {
  dashboard: LayoutDashboard,
  building: Building2,
  users: Users,
  'user-group': Users,
  'credit-card': CreditCard,
  cog: Settings,
  list: List,
  plus: Plus,
  link: LinkIcon,
  menu: Menu,
  x: X,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  bell: Bell,
  search: Search,
  sun: Sun,
  moon: Moon,
  'user-circle': UserCircle,
  'chart-bar': BarChart3,
  'document-text': FileText,
  'clipboard-list': ClipboardList,
  'chevron-up': ChevronUp,
  'shield-check': ShieldCheck,
  'building-simple': Building,
  'office-building': Building2,
  archive: Archive,
  'shopping-cart': ShoppingCart,
  'presentation-chart-line': BarChart4,
  'book-open': BookOpen,
  calendar: Calendar,
  folder: Folder,
  'check-circle': CheckCircle,
  'chat-alt-2': MessageSquare,
  support: LifeBuoy,
  ticket: Ticket,
  clock: Clock,
  database: Database,
  truck: Truck,
  map: Map,
  'receipt-tax': Receipt,
  refresh: RotateCcw,
  cash: Banknote,
  'chart-pie': PieChart,
  'switch-horizontal': ArrowLeftRight,
  'file-text': FileText,
  'document-duplicate': Copy,
  reply: Undo,
  'clipboard-check': ClipboardCheck,
  'document-report': BarChart,
  'list-bullet': List,
  'receipt-refund': Undo2,
  'pencil-alt': Pencil,
  cube: Package,
  package: Package,
  logout: LogOut,
  'log-out': LogOut,
  'bell-off': BellOff,
  'building-2': Building2,
  'refresh-cw': RefreshCw,
  tag: Tag,
  puzzle: Puzzle,
  code: Code,
  mail: Mail,
  factory: Factory,
  lock: Lock
};

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 'md' }) => {
  const IconComponent = icons[name as keyof typeof icons];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent className={`${iconSizes[size]} ${className}`} />
  );
};

export default Icon;
