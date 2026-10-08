import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock3,
  RefreshCcw,
  RotateCcw,
  Target,
  Zap,
} from 'lucide-react'
import { useOps } from '../../context/OpsContext'
import { formatNumber } from '../../lib/format'

const items = [
  { key: 'totalOrders', label: 'Total Orders', icon: Target, format: (v: number) => formatNumber(v), delta: '+4.2%' },
  { key: 'activeOrders', label: 'Active Orders', icon: Zap, format: (v: number) => formatNumber(v), delta: 'live' },
  { key: 'successRate', label: 'Success Rate', icon: CheckCircle2, format: (v: number) => `${v.toFixed(1)}%`, delta: '+0.4%' },
  { key: 'retryCount', label: 'Retry Count', icon: RefreshCcw, format: (v: number) => formatNumber(v), delta: '-8%' },
  { key: 'rollbackCount', label: 'Rollback Count', icon: RotateCcw, format: (v: number) => formatNumber(v), delta: '1.0%' },
  { key: 'avgActivationSec', label: 'Avg Activation', icon: Clock3, format: (v: number) => `${v}s`, delta: '-3s' },
] as const

export function KpiGrid() {
  const { kpis } = useOps()

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
      {items.map((item, i) => {
        const Icon = item.icon
        const value = kpis[item.key]
        return (
          <motion.article
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="rounded-2xl border border-tf-line bg-tf-surface p-4"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-tf-primary/10 text-tf-primary">
                <Icon size={15} />
              </span>
              <span className="text-[11px] font-medium text-tf-success">{item.delta}</span>
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {item.format(value)}
            </div>
            <div className="mt-1 text-xs text-tf-muted">{item.label}</div>
          </motion.article>
        )
      })}
    </div>
  )
}
