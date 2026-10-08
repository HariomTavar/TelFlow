import { motion } from 'framer-motion'
import { FlaskConical } from 'lucide-react'
import { useOps } from '../../context/OpsContext'
import type { DomainService, FailureMode } from '../../types'
import { Card, SectionHeader } from '../ui/primitives'

const services: { key: DomainService; label: string }[] = [
  { key: 'inventory', label: 'Inventory Failure' },
  { key: 'network', label: 'Network Failure' },
  { key: 'billing', label: 'Billing Failure' },
  { key: 'notification', label: 'Notification Failure' },
]

const modes: FailureMode[] = ['NONE', 'TRANSIENT', 'PERMANENT', 'TIMEOUT']

export function FailureInjectionPanel() {
  const { failures, setFailure } = useOps()

  return (
    <Card>
      <SectionHeader
        icon={<FlaskConical size={15} />}
        title="Failure Injection"
        meta="Operator drill · mock chaos only"
      />
      <div className="space-y-4">
        {services.map((svc) => (
          <div key={svc.key}>
            <div className="mb-2 text-xs font-medium text-slate-300">{svc.label}</div>
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-tf-bg p-1">
              {modes.map((mode) => {
                const active = failures[svc.key] === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFailure(svc.key, mode)}
                    className="relative rounded-lg px-1 py-1.5 text-[10px] font-semibold tracking-wide"
                  >
                    {active ? (
                      <motion.span
                        layoutId={`fail-${svc.key}`}
                        className={`absolute inset-0 rounded-lg ${
                          mode === 'NONE'
                            ? 'bg-tf-success/20'
                            : mode === 'TRANSIENT'
                              ? 'bg-tf-warning/20'
                              : mode === 'TIMEOUT'
                                ? 'bg-tf-primary/20'
                                : 'bg-tf-danger/20'
                        }`}
                      />
                    ) : null}
                    <span className={`relative ${active ? 'text-white' : 'text-tf-muted'}`}>{mode}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
