import type { LocalStorageSchema } from '../types';

// =============================================================================
// STORAGE ERROR TYPES
// =============================================================================

export class StorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageQuotaError extends StorageError {
  constructor() {
    super('Storage quota exceeded. Please clear some data or export your data for backup.', 'QUOTA_EXCEEDED');
  }
}

export class StorageAccessError extends StorageError {
  constructor() {
    super('Unable to access browser storage. Please check your browser settings.', 'ACCESS_DENIED');
  }
}

export class DataCorruptionError extends StorageError {
  constructor(key: string) {
    super(`Data corruption detected for key: ${key}. The data will be reset.`, 'DATA_CORRUPTION');
  }
}

// =============================================================================
// STORAGE OPERATION RESULT TYPES
// =============================================================================

export interface StorageOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: StorageError;
  fallbackUsed?: boolean;
}

// =============================================================================
// DATA PERSISTENCE SERVICE
// =============================================================================

class DataPersistenceService {
  private readonly STORAGE_PREFIX = 'admin-dashboard-';
  private readonly BACKUP_SUFFIX = '-backup';
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 100; // milliseconds
  
  // In-memory fallback storage for when localStorage is unavailable
  private memoryStorage: Map<string, string> = new Map();
  private isUsingMemoryFallback = false;

  // =============================================================================
  // CORE STORAGE OPERATIONS
  // =============================================================================

  /**
   * Save data to storage with error handling and automatic backup
   */
  save<T>(key: keyof LocalStorageSchema, data: T): StorageOperationResult<void> {
    try {
      const serializedData = this.serializeData(data);
      const fullKey = this.getFullKey(key);
      
      // Create backup before saving new data
      this.createBackup(fullKey);
      
      // Attempt to save with retry logic
      const result = this.performStorageOperation(() => {
        this.setStorageItem(fullKey, serializedData);
      });

      if (result.success) {
        // Verify the data was saved correctly
        const verification = this.verifyDataIntegrity(fullKey, serializedData);
        if (!verification.success) {
          this.restoreFromBackup(fullKey);
          return { success: false, error: verification.error };
        }
      }

      return result;
    } catch (error) {
      return this.handleStorageError(error, 'save');
    }
  }

  /**
   * Load data from storage with fallback and error recovery
   */
  load<T>(key: keyof LocalStorageSchema): StorageOperationResult<T> {
    try {
      const fullKey = this.getFullKey(key);
      
      const result = this.performStorageOperation(() => {
        const serializedData = this.getStorageItem(fullKey);
        if (serializedData === null) {
          return { __notFound: true };
        }
        return this.deserializeData<T>(serializedData);
      });

      if (result.success) {
        // Check if data was found
        if (result.data && typeof result.data === 'object' && '__notFound' in result.data) {
          // Data was not found, try backup or return default
        } else {
          // Data was found (including null values)
          return { success: true, data: result.data, fallbackUsed: this.isUsingMemoryFallback };
        }
      }

      // Try to restore from backup if main data is corrupted or missing
      const backupResult = this.loadFromBackup<T>(fullKey);
      if (backupResult.success) {
        // Restore main data from backup
        this.save(key, backupResult.data!);
        return { success: true, data: backupResult.data, fallbackUsed: this.isUsingMemoryFallback };
      }

      return { success: true, data: this.getDefaultValue<T>(key), fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'load');
    }
  }

  /**
   * Update specific item in an array-based storage entry
   */
  update<T extends { id: string; createdAt?: Date; updatedAt?: Date }>(key: keyof LocalStorageSchema, id: string, updates: Partial<T>): StorageOperationResult<T> {
    try {
      const loadResult = this.load<T[]>(key);
      if (!loadResult.success) {
        return { success: false, error: loadResult.error };
      }

      const data = loadResult.data || [];
      const itemIndex = data.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        return { 
          success: false, 
          error: new StorageError(`Item with id ${id} not found`, 'ITEM_NOT_FOUND') 
        };
      }

      // Create updated item with timestamp
      const updatedItem = {
        ...data[itemIndex],
        ...updates,
        updatedAt: new Date()
      } as T;

      // Update the array
      const updatedData = [...data];
      updatedData[itemIndex] = updatedItem;

      // Save the updated array
      const saveResult = this.save(key, updatedData);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedItem, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'update');
    }
  }

  /**
   * Delete specific item from an array-based storage entry
   */
  delete(key: keyof LocalStorageSchema, id: string): StorageOperationResult<void> {
    try {
      const loadResult = this.load<Array<{ id: string }>>(key);
      if (!loadResult.success) {
        return { success: false, error: loadResult.error };
      }

      const data = loadResult.data || [];
      const itemExists = data.some(item => item.id === id);
      
      if (!itemExists) {
        return { 
          success: false, 
          error: new StorageError(`Item with id ${id} not found`, 'ITEM_NOT_FOUND') 
        };
      }

      // Remove the item
      const updatedData = data.filter(item => item.id !== id);

      // Save the updated array
      const saveResult = this.save(key, updatedData);
      return saveResult;
    } catch (error) {
      return this.handleStorageError(error, 'delete');
    }
  }

  // =============================================================================
  // SPECIALIZED CRUD OPERATIONS
  // =============================================================================

  /**
   * Add new item to an array-based storage entry
   */
  add<T extends { id: string; createdAt?: Date; updatedAt?: Date }>(key: keyof LocalStorageSchema, item: T): StorageOperationResult<T> {
    try {
      const loadResult = this.load<T[]>(key);
      if (!loadResult.success) {
        return { success: false, error: loadResult.error };
      }

      const data = loadResult.data || [];
      
      // Check for duplicate IDs
      if (data.some(existingItem => existingItem.id === item.id)) {
        return { 
          success: false, 
          error: new StorageError(`Item with id ${item.id} already exists`, 'DUPLICATE_ID') 
        };
      }

      // Add timestamps if not present
      const itemWithTimestamps = {
        ...item,
        createdAt: (item as any).createdAt || new Date(),
        updatedAt: (item as any).updatedAt || new Date()
      } as T;

      const updatedData = [...data, itemWithTimestamps];
      
      const saveResult = this.save(key, updatedData);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: itemWithTimestamps, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'add');
    }
  }

  /**
   * Get specific item by ID from an array-based storage entry
   */
  getById<T extends { id: string }>(key: keyof LocalStorageSchema, id: string): StorageOperationResult<T> {
    try {
      const loadResult = this.load<T[]>(key);
      if (!loadResult.success) {
        return { success: false, error: loadResult.error };
      }

      const data = loadResult.data || [];
      const item = data.find(item => item.id === id);
      
      if (!item) {
        return { 
          success: false, 
          error: new StorageError(`Item with id ${id} not found`, 'ITEM_NOT_FOUND') 
        };
      }

      return { success: true, data: item, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'getById');
    }
  }

  // =============================================================================
  // DATA EXPORT/IMPORT FUNCTIONALITY
  // =============================================================================

  /**
   * Export all data as JSON string for backup or integration
   */
  exportData(): StorageOperationResult<string> {
    try {
      const exportData: Partial<LocalStorageSchema> = {};
      const keys: (keyof LocalStorageSchema)[] = [
        'admin-dashboard-companies',
        'admin-dashboard-admins',
        'admin-dashboard-subscriptions',
        'admin-dashboard-company-subscriptions',
        'admin-dashboard-user',
        'admin-dashboard-settings'
      ];

      for (const key of keys) {
        const result = this.load(key);
        if (result.success && result.data !== null && result.data !== undefined) {
          (exportData as any)[key] = result.data;
        }
      }

      // Add metadata
      const exportObject = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: exportData
      };

      const jsonString = JSON.stringify(exportObject, null, 2);
      return { success: true, data: jsonString, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'export');
    }
  }

  /**
   * Import data from JSON string with validation and error recovery
   */
  importData(jsonData: string): StorageOperationResult<void> {
    try {
      // Validate JSON format
      let importObject: any;
      try {
        importObject = JSON.parse(jsonData);
      } catch {
        return { 
          success: false, 
          error: new StorageError('Invalid JSON format', 'INVALID_JSON') 
        };
      }

      // Validate structure
      if (!importObject.data || typeof importObject.data !== 'object') {
        return { 
          success: false, 
          error: new StorageError('Invalid import data structure', 'INVALID_STRUCTURE') 
        };
      }

      // Create backup of current data before import
      const backupResult = this.createFullBackup();
      if (!backupResult.success) {
        return { success: false, error: backupResult.error };
      }

      // Import each data type with validation
      const importResults: Array<{ key: string; success: boolean; error?: StorageError }> = [];
      
      for (const [key, value] of Object.entries(importObject.data)) {
        if (this.isValidStorageKey(key)) {
          const result = this.save(key as keyof LocalStorageSchema, value as any);
          importResults.push({
            key,
            success: result.success,
            error: result.error
          });
        }
      }

      // Check if any imports failed
      const failedImports = importResults.filter(result => !result.success);
      if (failedImports.length > 0) {
        // Restore from backup if any imports failed
        this.restoreFullBackup();
        return { 
          success: false, 
          error: new StorageError(
            `Import failed for ${failedImports.length} items. Data restored from backup.`, 
            'IMPORT_PARTIAL_FAILURE'
          ) 
        };
      }

      return { success: true, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'import');
    }
  }

  /**
   * Clear all application data with confirmation
   */
  clearAllData(): StorageOperationResult<void> {
    try {
      const keys: (keyof LocalStorageSchema)[] = [
        'admin-dashboard-companies',
        'admin-dashboard-admins',
        'admin-dashboard-subscriptions',
        'admin-dashboard-company-subscriptions',
        'admin-dashboard-user',
        'admin-dashboard-settings'
      ];

      // Create backup before clearing
      const backupResult = this.createFullBackup();
      if (!backupResult.success) {
        return { success: false, error: backupResult.error };
      }

      // Clear each key
      for (const key of keys) {
        const fullKey = this.getFullKey(key);
        this.removeStorageItem(fullKey);
      }

      // Clear memory fallback if being used
      if (this.isUsingMemoryFallback) {
        this.memoryStorage.clear();
      }

      return { success: true, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'clearAll');
    }
  }

  // =============================================================================
  // STORAGE QUOTA AND ERROR MANAGEMENT
  // =============================================================================

  /**
   * Check available storage space
   */
  getStorageInfo(): { 
    isAvailable: boolean; 
    isUsingFallback: boolean; 
    estimatedUsage: number;
    quotaExceeded: boolean;
  } {
    let estimatedUsage = 0;
    let quotaExceeded = false;

    try {
      if (this.isUsingMemoryFallback) {
        // Calculate memory storage usage
        for (const [key, value] of this.memoryStorage) {
          estimatedUsage += key.length + value.length;
        }
      } else {
        // Calculate localStorage usage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.STORAGE_PREFIX)) {
            const value = localStorage.getItem(key);
            estimatedUsage += key.length + (value?.length || 0);
          }
        }
      }

      // Test if we can write to storage
      const testKey = `${this.STORAGE_PREFIX}test`;
      try {
        this.setStorageItem(testKey, 'test');
        this.removeStorageItem(testKey);
      } catch (error) {
        if (this.isQuotaExceededError(error)) {
          quotaExceeded = true;
        }
      }
    } catch (error) {
      // Storage access error
    }

    return {
      isAvailable: !this.isUsingMemoryFallback,
      isUsingFallback: this.isUsingMemoryFallback,
      estimatedUsage,
      quotaExceeded
    };
  }

  /**
   * Cleanup old data to free storage space
   */
  cleanupOldData(daysToKeep: number = 30): StorageOperationResult<number> {
    try {
      let cleanedItems = 0;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Clean up old backup data
      const backupKeys = this.getBackupKeys();
      for (const key of backupKeys) {
        try {
          const backupData = this.getStorageItem(key);
          if (backupData) {
            const parsed = JSON.parse(backupData);
            if (parsed.timestamp && new Date(parsed.timestamp) < cutoffDate) {
              this.removeStorageItem(key);
              cleanedItems++;
            }
          }
        } catch {
          // Remove corrupted backup
          this.removeStorageItem(key);
          cleanedItems++;
        }
      }

      return { success: true, data: cleanedItems, fallbackUsed: this.isUsingMemoryFallback };
    } catch (error) {
      return this.handleStorageError(error, 'cleanup');
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  private getFullKey(key: keyof LocalStorageSchema): string {
    return key; // Keys already include the prefix in the schema
  }

  private serializeData<T>(data: T): string {
    return JSON.stringify(data, (_key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });
  }

  private deserializeData<T>(serializedData: string): T {
    return JSON.parse(serializedData, (_key, value) => {
      // Handle Date objects
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  }

  private performStorageOperation<T>(operation: () => T): StorageOperationResult<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        const result = operation();
        return { success: true, data: result };
      } catch (error) {
        lastError = error as Error;
        
        if (this.isQuotaExceededError(error)) {
          // Try cleanup and retry once
          if (attempt === 1) {
            this.cleanupOldData(7); // Keep only 7 days of backups
            continue;
          }
          return { success: false, error: new StorageQuotaError() };
        }

        if (this.isStorageAccessError(error)) {
          // Switch to memory fallback
          this.switchToMemoryFallback();
          try {
            const result = operation();
            return { success: true, data: result, fallbackUsed: true };
          } catch (fallbackError) {
            return { success: false, error: new StorageAccessError() };
          }
        }

        // Wait before retry
        if (attempt < this.MAX_RETRY_ATTEMPTS) {
          this.sleep(this.RETRY_DELAY * attempt);
        }
      }
    }

    return { success: false, error: new StorageError(`Operation failed after retries: ${lastError?.message}`, 'OPERATION_FAILED') };
  }

  private setStorageItem(key: string, value: string): void {
    if (this.isUsingMemoryFallback) {
      this.memoryStorage.set(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  private getStorageItem(key: string): string | null {
    if (this.isUsingMemoryFallback) {
      return this.memoryStorage.get(key) || null;
    } else {
      return localStorage.getItem(key);
    }
  }

  private removeStorageItem(key: string): void {
    if (this.isUsingMemoryFallback) {
      this.memoryStorage.delete(key);
    } else {
      localStorage.removeItem(key);
    }
  }

  private switchToMemoryFallback(): void {
    if (!this.isUsingMemoryFallback) {
      this.isUsingMemoryFallback = true;
      console.warn('DataPersistenceService: Switched to memory fallback storage');
    }
  }

  private createBackup(key: string): void {
    try {
      const existingData = this.getStorageItem(key);
      if (existingData) {
        const backupKey = `${key}${this.BACKUP_SUFFIX}`;
        const backupData = {
          data: existingData,
          timestamp: new Date().toISOString()
        };
        this.setStorageItem(backupKey, JSON.stringify(backupData));
      }
    } catch {
      // Backup creation failed, continue with main operation
    }
  }

  private restoreFromBackup(key: string): void {
    try {
      const backupKey = `${key}${this.BACKUP_SUFFIX}`;
      const backupData = this.getStorageItem(backupKey);
      if (backupData) {
        const parsed = JSON.parse(backupData);
        this.setStorageItem(key, parsed.data);
      }
    } catch {
      // Backup restoration failed
    }
  }

  private loadFromBackup<T>(key: string): StorageOperationResult<T> {
    try {
      const backupKey = `${key}${this.BACKUP_SUFFIX}`;
      const backupData = this.getStorageItem(backupKey);
      if (backupData) {
        const parsed = JSON.parse(backupData);
        const data = this.deserializeData<T>(parsed.data);
        return { success: true, data };
      }
      return { success: false, error: new StorageError('No backup found', 'NO_BACKUP') };
    } catch (error) {
      return { success: false, error: new StorageError('Backup restoration failed', 'BACKUP_FAILED') };
    }
  }

  private verifyDataIntegrity(key: string, expectedData: string): StorageOperationResult<void> {
    try {
      const actualData = this.getStorageItem(key);
      if (actualData !== expectedData) {
        return { 
          success: false, 
          error: new DataCorruptionError(key) 
        };
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: new DataCorruptionError(key) 
      };
    }
  }

  private createFullBackup(): StorageOperationResult<void> {
    try {
      const exportResult = this.exportData();
      if (exportResult.success && exportResult.data) {
        const backupKey = `${this.STORAGE_PREFIX}full-backup-${Date.now()}`;
        this.setStorageItem(backupKey, exportResult.data);
        return { success: true };
      }
      return { success: false, error: exportResult.error };
    } catch (error) {
      return this.handleStorageError(error, 'fullBackup');
    }
  }

  private restoreFullBackup(): void {
    try {
      const backupKeys = this.getBackupKeys().filter(key => key.includes('full-backup'));
      if (backupKeys.length > 0) {
        // Get the most recent backup
        const latestBackup = backupKeys.sort().pop()!;
        const backupData = this.getStorageItem(latestBackup);
        if (backupData) {
          this.importData(backupData);
        }
      }
    } catch {
      // Restoration failed
    }
  }

  private getBackupKeys(): string[] {
    const keys: string[] = [];
    if (this.isUsingMemoryFallback) {
      for (const key of this.memoryStorage.keys()) {
        if (key.includes(this.BACKUP_SUFFIX) || key.includes('full-backup')) {
          keys.push(key);
        }
      }
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(this.BACKUP_SUFFIX) || key.includes('full-backup'))) {
          keys.push(key);
        }
      }
    }
    return keys;
  }

  private getDefaultValue<T>(key: keyof LocalStorageSchema): T {
    const defaults: Partial<LocalStorageSchema> = {
      'admin-dashboard-companies': [],
      'admin-dashboard-admins': [],
      'admin-dashboard-subscriptions': [],
      'admin-dashboard-company-subscriptions': [],
      'admin-dashboard-settings': {
        theme: 'light',
        pageSize: 10,
        language: 'en'
      }
    };
    return (defaults[key] as T) || ([] as T);
  }

  private isValidStorageKey(key: string): key is keyof LocalStorageSchema {
    const validKeys: (keyof LocalStorageSchema)[] = [
      'admin-dashboard-companies',
      'admin-dashboard-admins',
      'admin-dashboard-subscriptions',
      'admin-dashboard-company-subscriptions',
      'admin-dashboard-user',
      'admin-dashboard-settings'
    ];
    return validKeys.includes(key as keyof LocalStorageSchema);
  }

  private isQuotaExceededError(error: any): boolean {
    return error?.name === 'QuotaExceededError' || 
           error?.code === 22 || 
           error?.code === 1014;
  }

  private isStorageAccessError(error: any): boolean {
    return error?.name === 'SecurityError' || 
           error?.message?.includes('access') ||
           error?.message?.includes('denied');
  }

  private handleStorageError(error: any, operation: string): StorageOperationResult<never> {
    if (error instanceof StorageError) {
      return { success: false, error };
    }

    if (this.isQuotaExceededError(error)) {
      return { success: false, error: new StorageQuotaError() };
    }

    if (this.isStorageAccessError(error)) {
      return { success: false, error: new StorageAccessError() };
    }

    return { 
      success: false, 
      error: new StorageError(`${operation} operation failed: ${error.message}`, 'OPERATION_ERROR') 
    };
  }

  private sleep(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait
    }
  }
}

export default new DataPersistenceService();