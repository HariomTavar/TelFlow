import { motion } from 'framer-motion'
import { useOps } from '../../context/OpsContext'
import { Card, HealthBadge } from '../ui/primitives'

export function ServiceHealthGrid({ compact = false }: { compact?: boolean }) {
  const { health } = useOps()

  return (
    <div className={`grid gap-3 ${compact ? 'md:grid-cols-3 xl:grid-cols-6' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {health.map((svc, i) => (
        <motion.div
          key={svc.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Card>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-white">{svc.name}</div>
                <div className="text-[11px] text-tf-muted">{svc.region}</div>
              </div>
              <HealthBadge status={svc.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-tf-muted">Uptime</div>
                <div className="mt-0.5 font-mono text-sm text-white">{svc.uptime.toFixed(3)}%</div>
              </div>
              <div>
                <div className="text-tf-muted">Response</div>
                <div className="mt-0.5 font-mono text-sm text-white">
                  {svc.status === 'OUTAGE' ? '—' : `${svc.responseMs}ms`}
                </div>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className={`h-full ${
                  svc.status === 'OPERATIONAL'
                    ? 'bg-tf-success'
                    : svc.status === 'DEGRADED'
                      ? 'bg-tf-warning'
                      : 'bg-tf-danger'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(svc.uptime, 100)}%` }}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
