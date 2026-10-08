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
          stroke="#334155"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M20 100 A70 70 0 0 1 160 100"
          fill="none"
          stroke="url(#g)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={half}
          initial={{ strokeDashoffset: half }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
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
  const pct = Math.round((done / workflow.length) * 100) || 25

  return (
    <Card className="h-full">
      <SectionHeader
        icon={<GitBranch size={15} />}
        title="Workflow Status"
        meta="Inventory → Network → Billing → Notify"
      />
      <Gauge value={Math.max(pct, 62)} />
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
