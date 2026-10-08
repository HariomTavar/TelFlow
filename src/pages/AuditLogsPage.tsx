import { AuditTimeline } from '../components/dashboard/AuditTimeline'
import { Card, SectionHeader } from '../components/ui/primitives'
import { useOps } from '../context/OpsContext'

export function AuditLogsPage() {
  const { audit } = useOps()

  return (
    <Card>
      <SectionHeader
        title="Control-plane activity"
        meta={`${audit.length} events in the current window · append-only mock feed`}
      />
      <div className="mb-4 rounded-xl border border-tf-line bg-tf-bg/50 p-3 font-mono text-[11px] text-tf-muted">
        10:01 Order Created → 10:02 Inventory Reserved → 10:03 Network Activated → 10:04 Billing Failed → 10:05 Retry
        Started
      </div>
      <AuditTimeline maxHeight="640px" />
    </Card>
  )
}
