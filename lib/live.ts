import type { MaintenanceRecord, ServiceRequest } from './data'
import type { Notice } from './data-extra'

/** Live collections the app shell needs for search and notifications. */
export type LiveData = { notices: Notice[]; requests: ServiceRequest[]; maintenance: MaintenanceRecord[] }
