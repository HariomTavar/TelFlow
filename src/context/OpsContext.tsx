import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  defaultFailures,
  seedAudit,
  seedHealth,
  seedKpis,
  seedOrders,
  seedWorkflow,
} from '../data/mock'
import type {
  AuditEvent,
  DomainService,
  FailureMap,
  FailureMode,
  KpiSnapshot,
  Order,
  OrderStatus,
  ServiceHealth,
  WorkflowStepView,
} from '../types'

interface OpsContextValue {
  orders: Order[]
  kpis: KpiSnapshot
  workflow: WorkflowStepView[]
  health: ServiceHealth[]
  audit: AuditEvent[]
  failures: FailureMap
  setFailure: (service: DomainService, mode: FailureMode) => void
  clock: Date
}

const OpsContext = createContext<OpsContextValue | null>(null)

function applyFailures(orders: Order[], failures: FailureMap): Order[] {
  return orders.map((order) => {
    if (order.status === 'ACTIVE' || order.status === 'ROLLED_BACK') {
      return order
    }
    const mode = failures[order.currentStep.toLowerCase() as DomainService]
    if (mode === 'NONE') {
      if (order.status === 'RETRYING' || order.status === 'FAILED') {
        return { ...order, status: 'IN_PROGRESS', attempts: order.attempts }
      }
      return order
    }
    if (mode === 'TRANSIENT' || mode === 'TIMEOUT') {
      return {
        ...order,
        status: 'RETRYING' as OrderStatus,
        attempts: Math.max(order.attempts, 2),
      }
    }
    return {
      ...order,
      status: order.attempts >= 3 ? 'ROLLED_BACK' : 'FAILED',
      attempts: Math.max(order.attempts, 3),
    }
  })
}

export function OpsProvider({ children }: { children: ReactNode }) {
  const [failures, setFailures] = useState<FailureMap>(defaultFailures)
  const [orders, setOrders] = useState<Order[]>(() =>
    applyFailures(seedOrders, defaultFailures),
  )
  const [kpis, setKpis] = useState<KpiSnapshot>(seedKpis)
  const [workflow, setWorkflow] = useState<WorkflowStepView[]>(seedWorkflow)
  const [health, setHealth] = useState<ServiceHealth[]>(seedHealth)
  const [audit, setAudit] = useState<AuditEvent[]>(seedAudit)
  const [clock, setClock] = useState(() => new Date())

  const setFailure = useCallback((service: DomainService, mode: FailureMode) => {
    setFailures((prev) => ({ ...prev, [service]: mode }))
  }, [])

  useEffect(() => {
    setOrders((prev) => applyFailures(prev, failures))
    setWorkflow((prev) =>
      prev.map((step) => {
        const mode = failures[step.step.toLowerCase() as DomainService]
        if (mode === 'NONE') {
          const state =
            step.step === 'NOTIFICATION' ? 'PENDING' : step.step === 'BILLING' ? 'RUNNING' : 'SUCCESS'
          return {
            ...step,
            state: step.step === 'NOTIFICATION' ? 'PENDING' : state,
            latencyMs: step.step === 'BILLING' ? 214 : step.latencyMs,
          }
        }
        if (mode === 'TRANSIENT' || mode === 'TIMEOUT') {
          return { ...step, state: 'RUNNING', latencyMs: mode === 'TIMEOUT' ? 2400 : 890 }
        }
        return { ...step, state: 'FAILED', latencyMs: 1800 }
      }),
    )
    setHealth((prev) =>
      prev.map((svc) => {
        const key = svc.id === 'inv' ? 'inventory' : svc.id === 'net' ? 'network' : svc.id === 'bill' ? 'billing' : svc.id === 'ntf' ? 'notification' : null
        if (!key) return svc
        const mode = failures[key]
        if (mode === 'NONE') {
          return { ...svc, status: 'OPERATIONAL', responseMs: svc.id === 'bill' ? 118 : svc.responseMs, uptime: Math.max(svc.uptime, 99.9) }
        }
        if (mode === 'PERMANENT') {
          return { ...svc, status: 'OUTAGE', responseMs: 0, uptime: Math.min(svc.uptime, 97.2) }
        }
        return { ...svc, status: 'DEGRADED', responseMs: mode === 'TIMEOUT' ? 3200 : 740, uptime: 99.1 }
      }),
    )
  }, [failures])

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(new Date())
      setOrders((prev) =>
        prev.map((order) => {
          if (order.status !== 'IN_PROGRESS' && order.status !== 'RETRYING') {
            return order
          }
          return { ...order, durationSec: order.durationSec + 1 }
        }),
      )
      setKpis((prev) => ({
        ...prev,
        activeOrders: 240 + Math.floor(Math.random() * 14),
        avgActivationSec: 40 + Math.floor(Math.random() * 5),
      }))
    }, 1800)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date()
      const stamp = now.toTimeString().slice(0, 5)
      const live = orders.find((o) => o.status === 'IN_PROGRESS' || o.status === 'RETRYING')
      if (!live) return
      const step = live.currentStep
      setAudit((prev) => {
        const next: AuditEvent = {
          id: `live-${now.getTime()}`,
          time: stamp,
          title:
            live.status === 'RETRYING'
              ? `Retry on ${step}`
              : `${step.charAt(0)}${step.slice(1).toLowerCase()} heartbeat`,
          detail: `${live.id} · attempt ${live.attempts} · ${live.durationSec}s elapsed`,
          tone: live.status === 'RETRYING' ? 'warning' : 'info',
          orderId: live.id,
        }
        return [next, ...prev].slice(0, 40)
      })
    }, 7000)
    return () => window.clearInterval(id)
  }, [orders])

  const value = useMemo(
    () => ({
      orders,
      kpis,
      workflow,
      health,
      audit,
      failures,
      setFailure,
      clock,
    }),
    [orders, kpis, workflow, health, audit, failures, setFailure, clock],
  )

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>
}

export function useOps() {
  const ctx = useContext(OpsContext)
  if (!ctx) throw new Error('useOps must be used within OpsProvider')
  return ctx
}
