import type { OrderStatus, ServiceType, WorkflowStep } from '../types'

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

export function serviceLabel(type: ServiceType): string {
  const map: Record<ServiceType, string> = {
    FTTH_1G: 'FTTH 1 Gbps',
    '5G_POSTPAID': '5G Postpaid',
    VOLTE: 'VoLTE Voice',
    IPTV: 'IPTV Bundle',
    MPLS_VPN: 'MPLS VPN',
    SIM_SWAP: 'SIM Swap',
    MNP: 'Number Port-In',
  }
  return map[type]
}

export function stepLabel(step: WorkflowStep): string {
  const map: Record<WorkflowStep, string> = {
    INVENTORY: 'Inventory',
    NETWORK: 'Network',
    BILLING: 'Billing',
    NOTIFICATION: 'Notification',
  }
  return map[step]
}

export const statusTone: Record<
  OrderStatus,
  { bg: string; text: string; ring: string }
> = {
  ACTIVE: {
    bg: 'bg-tf-success/15',
    text: 'text-tf-success',
    ring: 'ring-tf-success/30',
  },
  IN_PROGRESS: {
    bg: 'bg-tf-primary/15',
    text: 'text-tf-primary',
    ring: 'ring-tf-primary/30',
  },
  RETRYING: {
    bg: 'bg-tf-warning/15',
    text: 'text-tf-warning',
    ring: 'ring-tf-warning/30',
  },
  FAILED: {
    bg: 'bg-tf-danger/15',
    text: 'text-tf-danger',
    ring: 'ring-tf-danger/30',
  },
  ROLLED_BACK: {
    bg: 'bg-tf-rollback/15',
    text: 'text-tf-rollback',
    ring: 'ring-tf-rollback/30',
  },
}
