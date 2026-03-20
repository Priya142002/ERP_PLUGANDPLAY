// Service layer exports
export { default as DataPersistenceService } from './DataPersistenceService';
export { 
  StorageError, 
  StorageQuotaError, 
  StorageAccessError, 
  DataCorruptionError 
} from './DataPersistenceService';
export type { 
  StorageOperationResult 
} from './DataPersistenceService';
export { default as ValidationService } from './ValidationService';