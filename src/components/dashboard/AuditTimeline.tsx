import { motion } from 'framer-motion'
import { useOps } from '../../context/OpsContext'

const toneDot = {
  info: 'bg-tf-primary',
  success: 'bg-tf-success',
  warning: 'bg-tf-warning',
  danger: 'bg-tf-danger',
}

export function AuditTimeline({ maxHeight = '420px' }: { maxHeight?: string }) {
  const { audit } = useOps()

  return (
    <div className="overflow-y-auto pr-1" style={{ maxHeight }}>
      <ol className="relative space-y-4 border-l border-tf-line pl-4">
        {audit.map((ev, i) => (
          <motion.li
            key={ev.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i, 8) * 0.03 }}
            className="relative"
          >
            <span
              className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${toneDot[ev.tone]}`}
            />
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-tf-muted">{ev.time}</span>
              <span className="text-sm font-medium text-white">{ev.title}</span>
            </div>
            <p className="mt-0.5 text-xs text-tf-muted">{ev.detail}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
