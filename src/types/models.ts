// Data model interfaces - placeholder for Task 2
export interface Company {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  gstNumber?: string;
  taxNumber?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyId: string;
  role: 'admin';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  planName: string;
  planType: 'monthly' | 'yearly';
  price: number;
  currency: string;
  maxUsers: number;
  maxModules: number;
  features: string[];
  startDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySubscription {
  id: string;
  companyId: string;
  subscriptionId: string;
  startDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended';
  assignedAt: Date;
}

export interface SuperAdmin {
  id: string;
  fullName: string;
  email: string;
  role: 'super_admin';
  permissions: string[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'admin';
  companyId?: string;
}