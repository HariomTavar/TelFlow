import { Flag, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { ActivationTrends } from '../components/dashboard/ActivationTrends'
import { AuditTimeline } from '../components/dashboard/AuditTimeline'
import { FailureInjectionPanel } from '../components/dashboard/FailureInjectionPanel'
import { KpiGrid } from '../components/dashboard/KpiGrid'
import { LiveOrdersTable } from '../components/dashboard/LiveOrdersTable'
import { ServiceHealthGrid } from '../components/dashboard/ServiceHealthGrid'
import { WorkflowStatusCard } from '../components/dashboard/WorkflowStatusCard'
import { Card, SectionHeader } from '../components/ui/primitives'
import { circleMix } from '../data/mock'
import { formatNumber } from '../lib/format'
import { Link } from 'react-router-dom'

const cohort = [42, 55, 48, 61, 70, 58, 66, 72]
const loyal = [18, 22, 28, 31, 36, 40, 44, 49]

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <KpiGrid />

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <WorkflowStatusCard />
        <ActivationTrends />
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <FailureInjectionPanel />
        <Card>
          <SectionHeader
            title="Live Orders"
            meta={
              <span className="inline-flex items-center gap-2">
                Performing <span className="h-1.5 w-1.5 rounded-full bg-tf-success" /> 1s
              </span>
            }
            action={
              <Link to="/orders" className="text-xs font-medium text-tf-primary hover:underline">
                Open queue
              </Link>
            }
          />
          <LiveOrdersTable limit={6} />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <SectionHeader icon={<Flag size={15} />} title="Top Performing Circles" />
          <div className="space-y-3">
            {circleMix.map((row) => (
              <div key={row.flag} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-8 place-items-center rounded bg-white/5 font-mono text-[10px] text-tf-primary">
                    {row.flag}
                  </span>
                  <span className="text-slate-200">{row.circle}</span>
                </div>
                <span className="text-tf-muted">{row.pct.toFixed(2)}%</span>
                <span className="w-16 text-right font-mono text-xs text-white">
                  {formatNumber(row.orders)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
          <Card>
            <SectionHeader icon={<Users size={15} />} title="Activation Guarantee" meta="After 8 weeks" />
            <div className="text-5xl font-semibold tracking-tight text-white">96%</div>
            <p className="mt-1 text-xs text-tf-muted">Resolve to ACTIVE · Feb – Sep</p>
            <div className="mt-4 flex gap-4 text-[11px] text-tf-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-tf-primary" /> First-time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-slate-600" /> Recontract
              </span>
            </div>
          </Card>
          <Card className="tf-grid-line">
            <div className="flex h-[160px] items-end justify-between gap-1.5 px-1">
              {cohort.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  {Array.from({ length: 8 }).map((_, cell) => {
                    const filled = cell < Math.round(v / 12.5)
                    const loyalFill = cell < Math.round(loyal[i] / 12.5)
                    return (
                      <motion.span
                        key={cell}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 + cell * 0.02 }}
                        className={`h-3 w-full rounded-sm ${
                          loyalFill ? 'bg-slate-600' : filled ? 'bg-tf-primary' : 'bg-slate-800'
                        }`}
                      />
                    )
                  }).reverse()}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-white">Service Health</h2>
        <ServiceHealthGrid compact />
      </div>

      <Card>
        <SectionHeader
          title="Audit stream"
          meta="Scrollable control-plane feed"
          action={
            <Link to="/audit" className="text-xs font-medium text-tf-primary hover:underline">
              Full log
            </Link>
          }
        />
        <AuditTimeline maxHeight="280px" />
      </Card>
    </div>
  )
}
