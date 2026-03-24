import React from 'react';
import { User } from '../../types';
import Icon from '../ui/Icon';
import Card from '../ui/Card';

interface DashboardOverviewProps {
  user: User;
}

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: 'blue' | 'green' | 'yellow' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}

interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  stock: number;
  lastPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'inventory' | 'system';
  message: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

interface TargetProgress {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: 'blue' | 'green' | 'purple';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, iconColor, trend }) => {
  const iconColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    purple: 'bg-purple-500'
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${iconColorClasses[iconColor]} rounded-lg flex items-center justify-center`}>
            <Icon name={icon} className="text-white" size="md" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded ${trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
            <Icon 
              name={trend.isPositive ? 'chevron-up' : 'chevron-down'} 
              size="sm" 
              className="mr-1" 
            />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const RevenueChart: React.FC = () => {
  // Mock chart data - in real implementation, this would use Chart.js or similar
  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 82 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 87 },
    { month: 'Jul', value: 73 },
    { month: 'Aug', value: 91 },
    { month: 'Sep', value: 68 },
    { month: 'Oct', value: 85 },
    { month: 'Nov', value: 92 },
    { month: 'Dec', value: 88 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <p className="text-sm text-gray-500">Monthly revenue data</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Goal</span>
          </div>
        </div>
      </div>
      <div className="h-64 flex items-end justify-between space-x-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex flex-col items-center space-y-1">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(data.value / maxValue) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{data.month}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const OrdersCategoryChart: React.FC = () => {
  const categoryData = [
    { name: 'Electronics', value: 35, color: 'bg-blue-500' },
    { name: 'Clothing', value: 25, color: 'bg-green-500' },
    { name: 'Books', value: 20, color: 'bg-yellow-500' },
    { name: 'Home & Garden', value: 15, color: 'bg-purple-500' },
    { name: 'Sports', value: 5, color: 'bg-red-500' }
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Orders by Category</h3>
        <p className="text-sm text-gray-500">Distribution of orders</p>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-purple-500 to-red-500 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">100%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {categoryData.map((category, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${category.color} rounded`}></div>
              <span className="font-medium text-gray-700">{category.name}</span>
            </div>
            <span className="text-gray-600">{category.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const RecentInventoryTable: React.FC<{ items: InventoryItem[] }> = ({ items }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-600 bg-emerald-50';
      case 'Low Stock': return 'text-amber-600 bg-amber-50';
      case 'Out of Stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Inventory</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Product</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Category</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Stock</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Last Price</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Last Updated</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                <td className="py-3 text-sm text-gray-600">{item.category}</td>
                <td className="py-3 text-sm text-gray-900">{item.stock}</td>
                <td className="py-3 text-sm text-gray-900">₹{item.lastPrice}</td>
                <td className="py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const ActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <div className={`w-8 h-8 ${activity.iconColor} rounded-full flex items-center justify-center`}>
              <Icon name={activity.icon} className="text-white" size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MonthlyTargets: React.FC<{ targets: TargetProgress[] }> = ({ targets }) => {
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Targets</h3>
      <div className="space-y-4">
        {targets.map((target, index) => {
          const percentage = Math.min((target.current / target.target) * 100, 100);
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-emerald-500',
            purple: 'bg-purple-500'
          };
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{target.label}</span>
                <span className="text-sm text-gray-600">
                  {target.current.toLocaleString()} / {target.target.toLocaleString()} {target.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${colorClasses[target.color]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user }) => {
  // Mock data matching the screenshot
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₹1,89,420',
      icon: 'dollar-sign',
      iconColor: 'blue' as const,
      trend: { value: 12.5, isPositive: true, period: 'month' }
    },
    {
      title: 'Total Orders',
      value: '5,248',
      icon: 'shopping-cart',
      iconColor: 'green' as const,
      trend: { value: 8.2, isPositive: true, period: 'month' }
    },
    {
      title: 'Active Orders',
      value: '3,841',
      icon: 'clock',
      iconColor: 'yellow' as const,
      trend: { value: 3.1, isPositive: false, period: 'week' }
    },
    {
      title: 'Net Profit',
      value: '₹25,180',
      icon: 'trending-up',
      iconColor: 'purple' as const,
      trend: { value: 15.3, isPositive: true, period: 'month' }
    }
  ];

  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      productName: 'MacBook Pro 13"',
      category: 'Electronics',
      stock: 245,
      lastPrice: 1299,
      status: 'In Stock',
      lastUpdated: 'Mar 15, 2024'
    },
    {
      id: '2',
      productName: 'Samsung 55" QLED',
      category: 'Electronics',
      stock: 56,
      lastPrice: 899,
      status: 'Low Stock',
      lastUpdated: 'Mar 14, 2024'
    },
    {
      id: '3',
      productName: 'Nike Air Max 2024',
      category: 'Apparel',
      stock: 0,
      lastPrice: 179,
      status: 'Out of Stock',
      lastUpdated: 'Mar 13, 2024'
    },
    {
      id: '4',
      productName: 'Dyson V15 Detect',
      category: 'Home',
      stock: 89,
      lastPrice: 749,
      status: 'In Stock',
      lastUpdated: 'Mar 15, 2024'
    },
    {
      id: '5',
      productName: 'Sony WH-1000XM5',
      category: 'Electronics',
      stock: 156,
      lastPrice: 399,
      status: 'In Stock',
      lastUpdated: 'Mar 15, 2024'
    }
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'order',
      message: 'New order #ORD-2024-001 received',
      timestamp: '2 minutes ago',
      icon: 'shopping-bag',
      iconColor: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'user',
      message: 'Low stock alert - Samsung 55" QLED',
      timestamp: '15 minutes ago',
      icon: 'alert-triangle',
      iconColor: 'bg-amber-500'
    },
    {
      id: '3',
      type: 'inventory',
      message: 'Inventory restocked - Sony WH-1000XM5',
      timestamp: '1 hour ago',
      icon: 'package',
      iconColor: 'bg-emerald-500'
    },
    {
      id: '4',
      type: 'system',
      message: 'New supplier registration - TechDist',
      timestamp: '2 hours ago',
      icon: 'users',
      iconColor: 'bg-purple-500'
    }
  ];

  const monthlyTargets: TargetProgress[] = [
    {
      id: '1',
      label: 'Orders',
      current: 3248,
      target: 4500,
      unit: 'orders',
      color: 'blue'
    },
    {
      id: '2',
      label: 'New Members',
      current: 1456,
      target: 2000,
      unit: 'members',
      color: 'green'
    },
    {
      id: '3',
      label: 'Total Budget',
      current: 78250,
      target: 100000,
      unit: '$',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Middle Section - Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersCategoryChart />
      </div>

      {/* Bottom Section - Tables and Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentInventoryTable items={inventoryItems} />
        </div>
        <div className="space-y-6">
          <ActivityFeed activities={recentActivities} />
          <MonthlyTargets targets={monthlyTargets} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;