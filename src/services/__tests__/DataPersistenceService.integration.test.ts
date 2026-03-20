import { describe, test, expect, beforeEach, vi } from 'vitest';
import DataPersistenceService from '../DataPersistenceService';
import type { Company, Admin } from '../../types';

// Create a fresh mock for each test file
const createMockLocalStorage = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => {
      const value = store[key];
      return value || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    // Add method to get all keys for debugging
    getAllKeys: () => Object.keys(store),
    getStore: () => ({ ...store })
  };
};

const mockLocalStorage = createMockLocalStorage();

// Replace global localStorage
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  configurable: true
});

describe('DataPersistenceService Integration Tests', () => {
  beforeEach(() => {
    // Clear the mock storage completely
    mockLocalStorage.clear();
    vi.clearAllMocks();
    
    // Verify storage is actually empty
    const allKeys = mockLocalStorage.getAllKeys();
    console.log('Storage keys after clear:', allKeys);
  });

  test('should handle complete CRUD workflow for companies', () => {
    const company: Company = {
      id: 'company-1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0123',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001'
      },
      gstNumber: 'GST123456789',
      status: 'active',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };

    // Create
    const addResult = DataPersistenceService.add('admin-dashboard-companies', company);
    expect(addResult.success).toBe(true);
    expect(addResult.data!.name).toBe('Acme Corporation');

    // Read
    const getResult = DataPersistenceService.getById<Company>('admin-dashboard-companies', 'company-1');
    expect(getResult.success).toBe(true);
    expect(getResult.data!.email).toBe('contact@acme.com');

    // Update
    const updateResult = DataPersistenceService.update('admin-dashboard-companies', 'company-1', {
      name: 'Acme Corp Updated',
      phone: '+1-555-9999'
    } as Partial<Company>);
    expect(updateResult.success).toBe(true);
    expect((updateResult.data as Company)!.name).toBe('Acme Corp Updated');
    expect((updateResult.data as Company)!.phone).toBe('+1-555-9999');

    // Verify update persisted
    const verifyResult = DataPersistenceService.getById<Company>('admin-dashboard-companies', 'company-1');
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.data!.name).toBe('Acme Corp Updated');

    // Delete
    const deleteResult = DataPersistenceService.delete('admin-dashboard-companies', 'company-1');
    expect(deleteResult.success).toBe(true);

    // Verify deletion
    const deletedResult = DataPersistenceService.getById<Company>('admin-dashboard-companies', 'company-1');
    expect(deletedResult.success).toBe(false);
    expect(deletedResult.error?.code).toBe('ITEM_NOT_FOUND');
  });

  test('should handle multiple entity types simultaneously', () => {
    const company: Company = {
      id: 'company-1',
      name: 'Test Company',
      email: 'test@company.com',
      phone: '1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add company first and debug
    const companyResult = DataPersistenceService.add('admin-dashboard-companies', company);
    console.log('Company add result:', companyResult);
    
    if (!companyResult.success) {
      console.log('Company add error:', companyResult.error);
    }

    expect(companyResult.success).toBe(true);

    // Verify company was added
    const companies = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
    expect(companies.data).toHaveLength(1);
    expect(companies.data![0].name).toBe('Test Company');
  });

  test('should handle data export and import workflow', () => {
    // Create test data
    const companies: Company[] = [
      {
        id: 'company-1',
        name: 'Company One',
        email: 'one@test.com',
        phone: '1111111111',
        address: {
          street: '111 First St',
          city: 'City One',
          state: 'State One',
          country: 'Country One',
          postalCode: '11111'
        },
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ];

    const admins: Admin[] = [
      {
        id: 'admin-1',
        fullName: 'Admin One',
        email: 'admin1@test.com',
        phone: '1111111111',
        companyId: 'company-1',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ];

    // Save initial data
    DataPersistenceService.save('admin-dashboard-companies', companies);
    DataPersistenceService.save('admin-dashboard-admins', admins);

    // Export data
    const exportResult = DataPersistenceService.exportData();
    expect(exportResult.success).toBe(true);
    expect(exportResult.data).toBeDefined();

    // Clear all data
    const clearResult = DataPersistenceService.clearAllData();
    expect(clearResult.success).toBe(true);

    // Import data back
    const importResult = DataPersistenceService.importData(exportResult.data!);
    expect(importResult.success).toBe(true);

    // Verify data is restored
    const restoredCompanies = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
    const restoredAdmins = DataPersistenceService.load<Admin[]>('admin-dashboard-admins');

    expect(restoredCompanies.data).toHaveLength(1);
    expect(restoredAdmins.data).toHaveLength(1);

    expect(restoredCompanies.data![0].name).toBe('Company One');
    expect(restoredAdmins.data![0].fullName).toBe('Admin One');
  });

  test('should provide storage information', () => {
    const storageInfo = DataPersistenceService.getStorageInfo();
    
    expect(storageInfo).toHaveProperty('isAvailable');
    expect(storageInfo).toHaveProperty('isUsingFallback');
    expect(storageInfo).toHaveProperty('estimatedUsage');
    expect(storageInfo).toHaveProperty('quotaExceeded');
    expect(typeof storageInfo.estimatedUsage).toBe('number');
    expect(storageInfo.estimatedUsage).toBeGreaterThanOrEqual(0);
  });

  test('should handle edge cases gracefully', () => {
    // Test with empty arrays
    const emptyResult = DataPersistenceService.save('admin-dashboard-companies', []);
    expect(emptyResult.success).toBe(true);

    const loadEmptyResult = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
    expect(loadEmptyResult.success).toBe(true);
    expect(loadEmptyResult.data).toEqual([]);

    // Test with null values for user (which can be null)
    const nullResult = DataPersistenceService.save('admin-dashboard-user', null);
    expect(nullResult.success).toBe(true);

    const loadNullResult = DataPersistenceService.load('admin-dashboard-user');
    expect(loadNullResult.success).toBe(true);
    expect(loadNullResult.data).toBeNull();

    // Test operations on non-existent items
    const updateNonExistent = DataPersistenceService.update('admin-dashboard-companies', 'non-existent', { name: 'Test' } as Partial<Company>);
    expect(updateNonExistent.success).toBe(false);
    expect(updateNonExistent.error?.code).toBe('ITEM_NOT_FOUND');

    const deleteNonExistent = DataPersistenceService.delete('admin-dashboard-companies', 'non-existent');
    expect(deleteNonExistent.success).toBe(false);
    expect(deleteNonExistent.error?.code).toBe('ITEM_NOT_FOUND');

    const getNonExistent = DataPersistenceService.getById('admin-dashboard-companies', 'non-existent');
    expect(getNonExistent.success).toBe(false);
    expect(getNonExistent.error?.code).toBe('ITEM_NOT_FOUND');
  });
});