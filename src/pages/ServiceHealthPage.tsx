import { ServiceHealthGrid } from '../components/dashboard/ServiceHealthGrid'

export function ServiceHealthPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-tf-muted">
        Health probes every 5s from the control plane. Degraded billing currently gates a subset of FTTH activations;
        sagas pause at the billing step, then retry or compensate.
      </p>
      <ServiceHealthGrid />
    </div>
  )
}
