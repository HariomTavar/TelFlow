import type { ReactNode } from 'react'
import { statusTone } from '../../lib/format'
import type { HealthStatus, OrderStatus, StepState } from '../../types'

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <section
      className={`rounded-2xl border border-tf-line bg-tf-surface shadow-[0_2px_10px_rgb(23_32_51_/0.04)] ${
        padded ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  icon,
  title,
  meta,
  action,
}: {
  icon?: ReactNode
  title: string
  meta?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon ? (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#F0F3F8] text-tf-primary">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h2>
          {meta ? <div className="text-xs text-tf-muted mt-0.5">{meta}</div> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone = statusTone[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace('_', ' ')}
    </span>
  )
}

export function HealthBadge({ status }: { status: HealthStatus }) {
  const map = {
    OPERATIONAL: 'text-tf-success bg-tf-success/15 ring-tf-success/30',
    DEGRADED: 'text-tf-warning bg-tf-warning/15 ring-tf-warning/30',
    OUTAGE: 'text-tf-danger bg-tf-danger/15 ring-tf-danger/30',
  } as const
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${map[status]}`}>
      {status}
    </span>
  )
}

export function StepLamp({ state }: { state: StepState }) {
  const color =
    state === 'SUCCESS'
      ? 'bg-tf-success shadow-[0_0_10px_#22c55e]'
      : state === 'RUNNING'
        ? 'bg-tf-warning shadow-[0_0_10px_#f59e0b]'
        : state === 'FAILED'
          ? 'bg-tf-danger shadow-[0_0_10px_#ef4444]'
          : 'bg-slate-500'
  return (
    <span className="relative inline-flex h-3.5 w-3.5">
      {state === 'RUNNING' ? (
        <span className="absolute inset-0 animate-ping rounded-full bg-tf-warning/70" />
      ) : null}
      <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${color}`} />
    </span>
  )
}
