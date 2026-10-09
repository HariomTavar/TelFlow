import { motion } from 'framer-motion'
import { GitBranch } from 'lucide-react'
import { useOps } from '../../context/OpsContext'
import { stepLabel } from '../../lib/format'
import { Card, SectionHeader, StepLamp } from '../ui/primitives'

function Gauge({ value }: { value: number }) {
  const r = 70
  const c = 2 * Math.PI * r
  const half = c / 2
  const offset = half - (value / 100) * half

  return (
    <div className="relative mx-auto w-[200px]">
      <svg viewBox="0 0 180 110" className="w-full">
        <path
          d="M20 100 A70 70 0 0 1 160 100"
          fill="none"
          stroke="#E7EBF2"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M20 100 A70 70 0 0 1 160 100"
          fill="none"
          stroke="#3978F6"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={half}
          initial={{ strokeDashoffset: half }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <div className="text-3xl font-semibold text-white">{value}%</div>
        <div className="text-[11px] text-tf-muted">Saga completion</div>
      </div>
    </div>
  )
}

export function WorkflowStatusCard() {
  const { workflow } = useOps()
  const done = workflow.filter((s) => s.state === 'SUCCESS').length
  const pct = Math.round((done / workflow.length) * 100)
  const stateCounts = [
    { label: 'Operational', count: workflow.filter((step) => step.state === 'SUCCESS').length, tone: 'text-tf-success' },
    { label: 'Retrying', count: workflow.filter((step) => step.state === 'RUNNING').length, tone: 'text-tf-warning' },
    { label: 'Degraded', count: workflow.filter((step) => step.state === 'FAILED').length, tone: 'text-tf-danger' },
    { label: 'Pending', count: workflow.filter((step) => step.state === 'PENDING').length, tone: 'text-tf-muted' },
  ]

  return (
    <Card className="h-full">
      <SectionHeader
        icon={<GitBranch size={15} />}
        title="Activation Workflow Health"
        meta="Inventory → Network → Billing → Notification"
      />
      <Gauge value={pct} />
      <div className="mb-4 grid grid-cols-4 gap-2 text-center">
        {stateCounts.map((item) => (
          <div key={item.label} className="rounded-lg bg-tf-bg px-1.5 py-2">
            <div className={`text-base font-semibold ${item.tone}`}>{item.count}</div>
            <div className="text-[10px] text-tf-muted">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {workflow.map((step) => (
          <motion.div
            key={step.step}
            layout
            className="rounded-xl border border-tf-line bg-tf-bg/50 px-3 py-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">{stepLabel(step.step)}</span>
              <StepLamp state={step.state} />
            </div>
            <div className="mt-1 text-lg font-semibold text-white">{step.throughput}</div>
            <div className="text-[10px] uppercase tracking-wide text-tf-muted">
              {step.state} · {step.latencyMs}ms
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
