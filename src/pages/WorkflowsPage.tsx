import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, SectionHeader, StatusBadge, StepLamp } from '../components/ui/primitives'
import { useOps } from '../context/OpsContext'
import { serviceLabel, stepLabel } from '../lib/format'
import type { WorkflowStep } from '../types'

const lanes: WorkflowStep[] = ['INVENTORY', 'NETWORK', 'BILLING', 'NOTIFICATION']

export function WorkflowsPage() {
  const { orders, workflow } = useOps()

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {workflow.map((step, i) => (
          <motion.div key={step.step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">{stepLabel(step.step)}</div>
                <StepLamp state={step.state} />
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">{step.throughput}</div>
              <div className="text-xs text-tf-muted">{step.latencyMs}ms p95 · compensating on fail</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <SectionHeader title="Saga lanes" meta="Orders never skip compensation. Terminal states: ACTIVE or ROLLED_BACK." />
        <div className="grid gap-3 md:grid-cols-4">
          {lanes.map((lane, i) => (
            <div key={lane} className="rounded-xl border border-tf-line bg-tf-bg/40 p-3">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-tf-muted">
                {stepLabel(lane)}
                {i < 3 ? <ArrowRight size={12} /> : null}
              </div>
              <div className="space-y-2">
                {orders
                  .filter((o) => o.currentStep === lane)
                  .map((o) => (
                    <div key={o.id} className="rounded-lg border border-tf-line bg-tf-surface p-2.5">
                      <div className="font-mono text-[11px] text-tf-primary">{o.id}</div>
                      <div className="mt-1 text-xs text-white">{o.customer}</div>
                      <div className="mt-1 text-[11px] text-tf-muted">{serviceLabel(o.serviceType)}</div>
                      <div className="mt-2">
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
