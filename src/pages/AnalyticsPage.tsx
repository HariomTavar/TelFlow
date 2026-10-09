import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, SectionHeader } from '../components/ui/primitives'
import { retryBuckets, rollbackTrend, seedTrends } from '../data/mock'
import { formatNumber } from '../lib/format'

const pieData = [
  { name: 'Success', value: 96.4, color: '#16A765' },
  { name: 'Failure', value: 3.6, color: '#E45454' },
]

const failTrend = seedTrends.map((d) => ({
  month: d.month,
  rate: Number(((d.failed / (d.successful + d.failed)) * 100).toFixed(2)),
}))

function ChartTip({
  label,
  value,
  suffix = '',
}: {
  label?: string | number
  value?: number
  suffix?: string
}) {
  return (
    <div className="rounded-lg border border-tf-line bg-white px-3 py-2 text-xs text-slate-900 shadow-lg">
      <div className="text-tf-muted">{label}</div>
      <div className="text-sm font-semibold">
        {value}
        {suffix}
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionHeader title="Success rate" meta="Completed ACTIVE vs attempted" />
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={72} outerRadius={100} paddingAngle={3}>
                {pieData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  const p = payload?.[0]
                  if (!p) return null
                  return <ChartTip label={String(p.name)} value={Number(p.value)} suffix="%" />
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-sm text-tf-muted">96.4% of sagas terminate ACTIVE</div>
      </Card>

      <Card>
        <SectionHeader title="Failure rate" meta="Failed activations by month" />
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={failTrend}>
              <CartesianGrid stroke="#E7EBF2" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                content={({ label, payload }) => {
                  const v = payload?.[0]?.value
                  return <ChartTip label={String(label)} value={Number(v ?? 0)} suffix="%" />
                }}
              />
              <Area type="monotone" dataKey="rate" stroke="#E45454" fill="#E4545433" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Retry distribution" meta="Attempts before terminal state" />
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retryBuckets}>
              <CartesianGrid stroke="#E7EBF2" vertical={false} />
              <XAxis dataKey="attempt" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ label, payload }) => (
                  <ChartTip label={`Attempt ${label}`} value={Number(payload?.[0]?.value ?? 0)} />
                )}
              />
              <Bar dataKey="count" fill="#3978F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Rollback trends" meta="Compensating transactions / week" />
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rollbackTrend}>
              <CartesianGrid stroke="#E7EBF2" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ label, payload }) => (
                  <ChartTip label={String(label)} value={Number(payload?.[0]?.value ?? 0)} />
                )}
              />
              <Line type="monotone" dataKey="count" stroke="#F28C45" strokeWidth={2} dot={{ r: 3, fill: '#F28C45' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <SectionHeader title="Volume overlay" meta="Successful vs failed vs rollback" />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seedTrends}>
              <CartesianGrid stroke="#E7EBF2" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => formatNumber(Number(value))}
                contentStyle={{ background: '#FFFFFF', border: '1px solid #E7EBF2', borderRadius: 12, color: '#172033' }}
              />
              <Bar dataKey="successful" stackId="a" fill="#3978F6" />
              <Bar dataKey="failed" stackId="a" fill="#E45454" />
              <Bar dataKey="rollbacks" stackId="a" fill="#F28C45" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
