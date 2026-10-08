import { FailureInjectionPanel } from '../components/dashboard/FailureInjectionPanel'
import { LiveOrdersTable } from '../components/dashboard/LiveOrdersTable'
import { Card, SectionHeader } from '../components/ui/primitives'

export function FailuresPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <FailureInjectionPanel />
      <div className="space-y-4">
        <Card>
          <SectionHeader
            title="Failed & compensating"
            meta="PERMANENT failures force rollback. TRANSIENT and TIMEOUT stay on retry."
          />
          <LiveOrdersTable statuses={['FAILED', 'RETRYING', 'ROLLED_BACK']} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-white">Compensation contract</h3>
          <ul className="mt-3 space-y-2 text-sm text-tf-muted">
            <li>Inventory — release reserved ports, SIMs, and ONT serials.</li>
            <li>Network — tear down VLAN / bearer / HSS profile.</li>
            <li>Billing — reverse pending charges; never leave a half-rated subscription.</li>
            <li>Notification — send rollback SMS only after all prior steps compensate.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
