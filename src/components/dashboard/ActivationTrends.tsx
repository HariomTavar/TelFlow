import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { seedTrends, serviceMix } from '../../data/mock'
import { formatNumber } from '../../lib/format'
import { Card, SectionHeader } from '../ui/primitives'
import { BarChart3 } from 'lucide-react'

const ranges = ['Daily', 'Weekly', 'Monthly', 'Annually'] as const

export function ActivationTrends() {
  const [range, setRange] = useState<(typeof ranges)[number]>('Monthly')

  return (
    <Card className="h-full">
      <SectionHeader
        icon={<BarChart3 size={15} />}
        title="Activation Trends"
        meta="Successful · Failed · Rollbacks"
        action={
          <div className="flex rounded-full bg-tf-bg p-1 text-[11px]">
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-full px-2.5 py-1 ${
                  range === r ? 'bg-tf-primary text-white' : 'text-tf-muted hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
        <div>
          <div className="text-xs text-tf-muted">Completed activations</div>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-white">18,416</span>
            <span className="mb-1 text-xs text-tf-success">+11%</span>
          </div>
          <div className="mt-5 space-y-4">
            {serviceMix.map((row) => (
              <div key={row.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="h-2 w-2 rounded-sm" style={{ background: row.color }} />
                    {row.name}
                  </span>
                  <span className="text-tf-muted">
                    {row.share}% · {formatNumber(row.tickets)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.share}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seedTrends} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="ok" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E7EBF2" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const row = payload[0].payload as (typeof seedTrends)[0]
                  const total = row.successful + row.failed + row.rollbacks
                  return (
                    <div className="rounded-xl border border-tf-line bg-white px-3 py-2.5 text-xs shadow-lg">
                      <div className="mb-1 font-medium text-slate-900">15 {label} 2026</div>
                      <div className="text-lg font-semibold text-white">{formatNumber(total)}</div>
                      <div className="text-[11px] text-tf-muted">activations</div>
                      <div className="mt-2 space-y-1 text-[11px]">
                        <div className="flex justify-between gap-6 text-tf-primary">
                          Successful <span>{formatNumber(row.successful)}</span>
                        </div>
                        <div className="flex justify-between gap-6 text-tf-danger">
                          Failed <span>{formatNumber(row.failed)}</span>
                        </div>
                        <div className="flex justify-between gap-6 text-tf-rollback">
                          Rollbacks <span>{formatNumber(row.rollbacks)}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Area type="monotone" dataKey="successful" stroke="#3b82f6" fill="url(#ok)" strokeWidth={2} />
              <Area type="monotone" dataKey="failed" stroke="#ef4444" fill="url(#fail)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="rollbacks" stroke="#f97316" fill="url(#rb)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-tf-line pt-4 text-xs">
        {[
          { label: 'Successful', value: '43.2% · 7,961', color: 'bg-tf-primary' },
          { label: 'Failed', value: '27.5% · 506', color: 'bg-tf-danger' },
          { label: 'Rolled back', value: '29.3% · 184', color: 'bg-tf-rollback' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-tf-bg/60 px-3 py-2">
            <div className="flex items-center gap-2 text-tf-muted">
              <span className={`h-2 w-2 rounded-sm ${item.color}`} />
              {item.label}
            </div>
            <div className="mt-1 font-medium text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
