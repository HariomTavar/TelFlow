export type OrderStatus =
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'RETRYING'
  | 'FAILED'
  | 'ROLLED_BACK'

export type WorkflowStep = 'INVENTORY' | 'NETWORK' | 'BILLING' | 'NOTIFICATION'

export type StepState = 'SUCCESS' | 'RUNNING' | 'PENDING' | 'FAILED' | 'SKIPPED'

export type FailureMode = 'NONE' | 'TRANSIENT' | 'PERMANENT' | 'TIMEOUT'

export type DomainService =
  | 'inventory'
  | 'network'
  | 'billing'
  | 'notification'

export type ServiceType =
  | 'FTTH_1G'
  | '5G_POSTPAID'
  | 'VOLTE'
  | 'IPTV'
  | 'MPLS_VPN'
  | 'SIM_SWAP'
  | 'MNP'

export type HealthStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE'

export interface Order {
  id: string
  customer: string
  msisdn: string
  circle: string
  serviceType: ServiceType
  currentStep: WorkflowStep
  status: OrderStatus
  attempts: number
  durationSec: number
  createdAt: string
}

export interface WorkflowStepView {
  step: WorkflowStep
  state: StepState
  latencyMs: number
  throughput: number
}

export interface ServiceHealth {
  id: string
  name: string
  status: HealthStatus
  uptime: number
  responseMs: number
  region: string
}

export interface AuditEvent {
  id: string
  time: string
  title: string
  detail: string
  tone: 'info' | 'success' | 'warning' | 'danger'
  orderId?: string
}

export interface TrendPoint {
  month: string
  successful: number
  failed: number
  rollbacks: number
}

export interface KpiSnapshot {
  totalOrders: number
  activeOrders: number
  successRate: number
  retryCount: number
  rollbackCount: number
  avgActivationSec: number
}

export type FailureMap = Record<DomainService, FailureMode>
