import {
  Activity,
  Bell,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Radio,
  Search,
  ShieldAlert,
  Siren,
  Workflow,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useOps } from '../../context/OpsContext'
import { useMemo, useState, type FormEvent } from 'react'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/workflows', label: 'Workflows', icon: Workflow },
  { to: '/health', label: 'Service Health', icon: Activity },
  { to: '/failures', label: 'Failures', icon: Siren },
  { to: '/analytics', label: 'Analytics', icon: Radio },
  { to: '/audit', label: 'Audit Logs', icon: ShieldAlert },
]

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Activation Control Center', subtitle: 'Coordinate inventory, network, billing, and notification without partial states.' },
  '/orders': { title: 'Live activation orders', subtitle: 'Every order ends ACTIVE or ROLLED_BACK.' },
  '/workflows': { title: 'Orchestration pipelines', subtitle: 'Four-step saga with compensating transactions.' },
  '/health': { title: 'Service health', subtitle: 'Uptime and latency across the activation fabric.' },
  '/failures': { title: 'Failure injection', subtitle: 'Chaos controls for operator drills — frontend simulation.' },
  '/analytics': { title: 'Activation analytics', subtitle: 'Success, failure, retry, and rollback trends.' },
  '/audit': { title: 'Audit timeline', subtitle: 'Immutable trail of orchestration events.' },
}

export function AppShell() {
  const { kpis, clock } = useOps()
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const copy = titles[location.pathname] ?? titles['/']

  const envClock = useMemo(
    () =>
      clock.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [clock],
  )

  function onSearch(e: FormEvent) {
    e.preventDefault()
    navigate(`/orders?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-tf-bg text-slate-200">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-tf-line bg-[#111c32] px-4 py-5 lg:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-tf-primary to-tf-secondary font-bold text-white shadow-[0_0_24px_rgb(59_130_246_/0.35)]">
              T
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">TelFlow</div>
              <div className="text-[11px] text-tf-muted">Activation OS</div>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-tf-line bg-white/5 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-[0.16em] text-tf-muted">Operator circle</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-medium text-white">West · MH-DL</span>
              <span className="h-2 w-2 rounded-full bg-tf-success shadow-[0_0_8px_#22c55e]" />
            </div>
            <div className="text-[11px] text-tf-muted">{kpis.activeOrders} live sagas</div>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-tf-primary/15 text-white shadow-[inset_0_0_0_1px_rgb(59_130_246_/0.35)]'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="rounded-xl border border-tf-line bg-tf-bg/50 p-3 text-[11px] text-tf-muted">
            Guarantee: activations never stay partial. Saga always resolves to{' '}
            <span className="text-tf-success">ACTIVE</span> or{' '}
            <span className="text-tf-rollback">ROLLED_BACK</span>.
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-tf-line bg-tf-bg/85 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-5 py-3.5">
              <div className="hidden min-w-0 flex-1 md:block">
                <div className="text-[11px] uppercase tracking-[0.18em] text-tf-muted">TelFlow</div>
                <h1 className="truncate text-base font-semibold text-white">{copy.title}</h1>
              </div>

              <form onSubmit={onSearch} className="relative min-w-0 flex-1 md:max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-tf-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search order, MSISDN, circle…"
                  className="h-10 w-full rounded-xl border border-tf-line bg-tf-surface pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-tf-primary/50"
                />
              </form>

              <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                PROD · IN-WEST-1
              </span>

              <button
                type="button"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-tf-line bg-tf-surface text-slate-300"
                aria-label="Notifications"
              >
                <Bell size={16} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-tf-danger" />
              </button>

              <button type="button" className="flex items-center gap-2 rounded-xl border border-tf-line bg-tf-surface py-1.5 pl-1.5 pr-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-tf-secondary/30 text-xs font-semibold text-white">
                  AR
                </div>
                <div className="hidden text-left lg:block">
                  <div className="text-xs font-medium text-white">Ananya Rao</div>
                  <div className="text-[10px] text-tf-muted">NOC Lead</div>
                </div>
                <ChevronDown size={14} className="text-tf-muted" />
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-tf-line px-5 py-2 text-xs text-tf-muted lg:hidden">
              <span>{copy.subtitle}</span>
              <span className="font-mono">{envClock}</span>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <div className="mb-5 hidden items-end justify-between lg:flex">
              <p className="max-w-2xl text-sm text-tf-muted">{copy.subtitle}</p>
              <p className="font-mono text-xs text-slate-500">{envClock} IST</p>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
