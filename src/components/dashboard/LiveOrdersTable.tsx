import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOps } from '../../context/OpsContext'
import { formatDuration, serviceLabel, statusTone, stepLabel } from '../../lib/format'
import type { OrderStatus } from '../../types'
import { StatusBadge } from '../ui/primitives'

export function LiveOrdersTable({
  limit,
  query = '',
  statuses,
}: {
  limit?: number
  query?: string
  statuses?: OrderStatus[]
}) {
  const { orders } = useOps()

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders
      .filter((o) => (statuses ? statuses.includes(o.status) : true))
      .filter((o) => {
        if (!q) return true
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.circle.toLowerCase().includes(q) ||
          o.msisdn.toLowerCase().includes(q) ||
          serviceLabel(o.serviceType).toLowerCase().includes(q)
        )
      })
      .slice(0, limit)
  }, [orders, query, statuses, limit])

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.12em] text-tf-muted">
            <th className="pb-3 font-medium">Order ID</th>
            <th className="pb-3 font-medium">Customer</th>
            <th className="pb-3 font-medium">Service Type</th>
            <th className="pb-3 font-medium">Current Step</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Attempts</th>
            <th className="pb-3 font-medium text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((order) => (
              <motion.tr
                key={order.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border-t border-tf-line"
              >
                <td className="py-3 font-mono text-xs text-tf-primary"><Link to={`/orders/${order.id}`} className="hover:text-white hover:underline">{order.id}</Link></td>
                <td className="py-3">
                  <div className="font-medium text-white">{order.customer}</div>
                  <div className="text-[11px] text-tf-muted">
                    {order.msisdn} · {order.circle}
                  </div>
                </td>
                <td className="py-3 text-slate-300">{serviceLabel(order.serviceType)}</td>
                <td className="py-3">
                  <span className={`text-xs ${statusTone[order.status].text}`}>
                    {stepLabel(order.currentStep)}
                  </span>
                </td>
                <td className="py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3 font-mono text-xs">{order.attempts}</td>
                <td className="py-3 text-right font-mono text-xs text-slate-300">
                  {formatDuration(order.durationSec)}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-tf-muted">No orders match this view.</p>
      ) : null}
    </div>
  )
}
