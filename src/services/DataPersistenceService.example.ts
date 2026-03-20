/**
 * DataPersistenceService Usage Examples
 * 
 * This file demonstrates how to use the DataPersistenceService for managing
 * application data in the browser's localStorage with comprehensive error handling,
 * data validation, and backup/restore capabilities.
 */

import DataPersistenceService from './DataPersistenceService';
import type { Company, Admin } from '../types';

// =============================================================================
// BASIC CRUD OPERATIONS
// =============================================================================

export function demonstrateBasicOperations() {
  console.log('=== Basic CRUD Operations ===');

  // Create a sample company
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
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // CREATE - Add a new company
  const addResult = DataPersistenceService.add('admin-dashboard-companies', company);
  if (addResult.success) {
    console.log('✅ Company added successfully:', addResult.data?.name);
  } else {
    console.error('❌ Failed to add company:', addResult.error?.message);
  }

  // READ - Get company by ID
  const getResult = DataPersistenceService.getById<Company>('admin-dashboard-companies', 'company-1');
  if (getResult.success) {
    console.log('✅ Company retrieved:', getResult.data?.name);
  } else {
    console.error('❌ Failed to get company:', getResult.error?.message);
  }

  // UPDATE - Modify company details
  const updateResult = DataPersistenceService.update('admin-dashboard-companies', 'company-1', {
    name: 'Acme Corp (Updated)',
    phone: '+1-555-9999'
  } as Partial<Company>);
  if (updateResult.success) {
    console.log('✅ Company updated:', (updateResult.data as Company)?.name);
  } else {
    console.error('❌ Failed to update company:', updateResult.error?.message);
  }

  // READ ALL - Load all companies
  const loadResult = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
  if (loadResult.success) {
    console.log('✅ All companies loaded:', loadResult.data?.length, 'companies');
  } else {
    console.error('❌ Failed to load companies:', loadResult.error?.message);
  }

  // DELETE - Remove company
  const deleteResult = DataPersistenceService.delete('admin-dashboard-companies', 'company-1');
  if (deleteResult.success) {
    console.log('✅ Company deleted successfully');
  } else {
    console.error('❌ Failed to delete company:', deleteResult.error?.message);
  }
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

export function demonstrateBulkOperations() {
  console.log('\n=== Bulk Operations ===');

  // Create multiple companies at once
  const companies: Company[] = [
    {
      id: 'company-1',
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '+1-555-0001',
      address: {
        street: '100 Tech Park',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94105'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'company-2',
      name: 'Global Enterprises',
      email: 'contact@global.com',
      phone: '+1-555-0002',
      address: {
        street: '200 Business Blvd',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Save all companies at once
  const saveResult = DataPersistenceService.save('admin-dashboard-companies', companies);
  if (saveResult.success) {
    console.log('✅ Bulk save successful');
  } else {
    console.error('❌ Bulk save failed:', saveResult.error?.message);
  }

  // Load and verify
  const loadResult = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
  if (loadResult.success) {
    console.log('✅ Loaded', loadResult.data?.length, 'companies');
    loadResult.data?.forEach(company => {
      console.log(`  - ${company.name} (${company.status})`);
    });
  }
}

// =============================================================================
// DATA EXPORT/IMPORT
// =============================================================================

export function demonstrateDataExportImport() {
  console.log('\n=== Data Export/Import ===');

  // First, create some test data
  const companies: Company[] = [
    {
      id: 'export-company-1',
      name: 'Export Test Company',
      email: 'test@export.com',
      phone: '+1-555-0000',
      address: {
        street: '123 Export St',
        city: 'Export City',
        state: 'EX',
        country: 'USA',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const admins: Admin[] = [
    {
      id: 'export-admin-1',
      fullName: 'Export Admin',
      email: 'admin@export.com',
      phone: '+1-555-0000',
      companyId: 'export-company-1',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Save test data
  DataPersistenceService.save('admin-dashboard-companies', companies);
  DataPersistenceService.save('admin-dashboard-admins', admins);

  // Export all data
  const exportResult = DataPersistenceService.exportData();
  if (exportResult.success) {
    console.log('✅ Data exported successfully');
    console.log('Export size:', exportResult.data?.length, 'characters');
    
    // Show a preview of the exported data
    const exportData = JSON.parse(exportResult.data!);
    console.log('Export metadata:', {
      version: exportData.version,
      exportedAt: exportData.exportedAt,
      dataKeys: Object.keys(exportData.data)
    });
  } else {
    console.error('❌ Export failed:', exportResult.error?.message);
    return;
  }

  // Clear all data
  const clearResult = DataPersistenceService.clearAllData();
  if (clearResult.success) {
    console.log('✅ All data cleared');
  }

  // Verify data is cleared
  const emptyCheck = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
  console.log('Companies after clear:', emptyCheck.data?.length || 0);

  // Import data back
  const importResult = DataPersistenceService.importData(exportResult.data!);
  if (importResult.success) {
    console.log('✅ Data imported successfully');
    
    // Verify imported data
    const restoredCompanies = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
    const restoredAdmins = DataPersistenceService.load<Admin[]>('admin-dashboard-admins');
    
    console.log('Restored companies:', restoredCompanies.data?.length || 0);
    console.log('Restored admins:', restoredAdmins.data?.length || 0);
  } else {
    console.error('❌ Import failed:', importResult.error?.message);
  }
}

// =============================================================================
// ERROR HANDLING DEMONSTRATION
// =============================================================================

export function demonstrateErrorHandling() {
  console.log('\n=== Error Handling ===');

  // Try to update a non-existent item
  const updateResult = DataPersistenceService.update('admin-dashboard-companies', 'non-existent-id', {
    name: 'This will fail'
  } as Partial<Company>);
  
  if (!updateResult.success) {
    console.log('✅ Correctly handled non-existent item update:');
    console.log('  Error code:', updateResult.error?.code);
    console.log('  Error message:', updateResult.error?.message);
  }

  // Try to delete a non-existent item
  const deleteResult = DataPersistenceService.delete('admin-dashboard-companies', 'non-existent-id');
  
  if (!deleteResult.success) {
    console.log('✅ Correctly handled non-existent item deletion:');
    console.log('  Error code:', deleteResult.error?.code);
    console.log('  Error message:', deleteResult.error?.message);
  }

  // Try to add duplicate ID
  const company: Company = {
    id: 'duplicate-test',
    name: 'Duplicate Test Company',
    email: 'test@duplicate.com',
    phone: '+1-555-0000',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      country: 'USA',
      postalCode: '12345'
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add first time (should succeed)
  const firstAdd = DataPersistenceService.add('admin-dashboard-companies', company);
  console.log('First add result:', firstAdd.success ? '✅ Success' : '❌ Failed');

  // Add second time (should fail with duplicate error)
  const secondAdd = DataPersistenceService.add('admin-dashboard-companies', company);
  if (!secondAdd.success) {
    console.log('✅ Correctly handled duplicate ID:');
    console.log('  Error code:', secondAdd.error?.code);
    console.log('  Error message:', secondAdd.error?.message);
  }

  // Try to import invalid JSON
  const invalidImport = DataPersistenceService.importData('{ invalid json }');
  if (!invalidImport.success) {
    console.log('✅ Correctly handled invalid JSON import:');
    console.log('  Error code:', invalidImport.error?.code);
    console.log('  Error message:', invalidImport.error?.message);
  }
}

// =============================================================================
// STORAGE INFORMATION
// =============================================================================

export function demonstrateStorageInfo() {
  console.log('\n=== Storage Information ===');

  const storageInfo = DataPersistenceService.getStorageInfo();
  
  console.log('Storage Status:');
  console.log('  Available:', storageInfo.isAvailable ? '✅ Yes' : '❌ No');
  console.log('  Using fallback:', storageInfo.isUsingFallback ? '⚠️ Yes' : '✅ No');
  console.log('  Estimated usage:', storageInfo.estimatedUsage, 'bytes');
  console.log('  Quota exceeded:', storageInfo.quotaExceeded ? '⚠️ Yes' : '✅ No');

  // Add some data and check usage again
  const testData = Array.from({ length: 100 }, (_, i) => ({
    id: `test-${i}`,
    name: `Test Company ${i}`,
    email: `test${i}@example.com`,
    phone: '+1-555-0000',
    address: {
      street: `${i} Test Street`,
      city: 'Test City',
      state: 'TS',
      country: 'USA',
      postalCode: '12345'
    },
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  DataPersistenceService.save('admin-dashboard-companies', testData);

  const updatedInfo = DataPersistenceService.getStorageInfo();
  console.log('\nAfter adding 100 companies:');
  console.log('  Estimated usage:', updatedInfo.estimatedUsage, 'bytes');
  console.log('  Usage increase:', updatedInfo.estimatedUsage - storageInfo.estimatedUsage, 'bytes');
}

// =============================================================================
// MAIN DEMONSTRATION FUNCTION
// =============================================================================

export function runAllDemonstrations() {
  console.log('🚀 DataPersistenceService Demonstration\n');
  
  try {
    demonstrateBasicOperations();
    demonstrateBulkOperations();
    demonstrateDataExportImport();
    demonstrateErrorHandling();
    demonstrateStorageInfo();
    
    console.log('\n✅ All demonstrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Demonstration failed:', error);
  } finally {
    // Clean up
    DataPersistenceService.clearAllData();
    console.log('\n🧹 Cleaned up test data');
  }
}

// Uncomment the line below to run the demonstrations
// runAllDemonstrations();