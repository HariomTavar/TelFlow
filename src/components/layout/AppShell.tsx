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
  BrainCircuit,
  Boxes,
  Cable,
  Command,
  Layers3,
  PlayCircle,
  ShieldCheck,
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
  { to: '/replay', label: 'Workflow Replay', icon: PlayCircle },
  { to: '/sla', label: 'SLA Center', icon: ShieldCheck },
  { to: '/war-room', label: 'Incident War Room', icon: Siren },
  { to: '/digital-twin', label: 'Digital Twin', icon: Cable },
  { to: '/command-center', label: 'Command Center', icon: Command },
  { to: '/catalog', label: 'Service Catalog', icon: Boxes },
  { to: '/alerts', label: 'Alert Center', icon: BrainCircuit },
  { to: '/demo', label: 'Demo Mode', icon: PlayCircle },
  { to: '/architecture', label: 'Architecture', icon: Layers3 },
]

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Activation Control Center', subtitle: 'Coordinate inventory, network, billing, and notification without partial states.' },
  '/orders': { title: 'Live activation orders', subtitle: 'Every order ends ACTIVE or ROLLED_BACK.' },
  '/workflows': { title: 'Orchestration pipelines', subtitle: 'Four-step saga with compensating transactions.' },
  '/health': { title: 'Service health', subtitle: 'Uptime and latency across the activation fabric.' },
  '/failures': { title: 'Failure injection', subtitle: 'Chaos controls for operator drills — frontend simulation.' },
  '/analytics': { title: 'Activation analytics', subtitle: 'Success, failure, retry, and rollback trends.' },
  '/audit': { title: 'Audit timeline', subtitle: 'Immutable trail of orchestration events.' },
  '/replay': { title: 'Workflow replay center', subtitle: 'Replay a saga without touching live systems.' },
  '/sla': { title: 'SLA monitoring center', subtitle: 'Activation commitments by service family.' },
  '/war-room': { title: 'Incident war room', subtitle: 'Coordinate recovery across affected telecom services.' },
  '/digital-twin': { title: 'Telecom digital twin', subtitle: 'Visual topology and predicted activation risk.' },
  '/command-center': { title: 'Executive command center', subtitle: 'Business outcomes protected by orchestration.' },
  '/catalog': { title: 'Telecom service catalog', subtitle: 'Commercial services and activation performance.' },
  '/alerts': { title: 'NOC alert center', subtitle: 'Operational signals requiring acknowledgement.' },
  '/demo': { title: 'Hackathon demo mode', subtitle: 'Trigger observable saga journeys on demand.' },
  '/architecture': { title: 'Architecture center', subtitle: 'Event-driven activation fabric.' },
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
    <div className="min-h-screen bg-tf-bg text-slate-700">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-tf-line bg-white px-4 py-5 lg:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-tf-primary font-bold text-white shadow-sm">
              T
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-900">TelFlow</div>
              <div className="text-[11px] text-tf-muted">Activation OS</div>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-tf-line bg-tf-bg px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-[0.16em] text-tf-muted">Operator circle</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">West · MH-DL</span>
              <span className="h-2 w-2 rounded-full bg-tf-success" />
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
                        ? 'bg-tf-primary/10 text-tf-primary'
                        : 'text-slate-500 hover:bg-tf-bg hover:text-slate-900'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="rounded-xl border border-tf-line bg-tf-bg p-3 text-[11px] text-tf-muted">
            Guarantee: activations never stay partial. Saga always resolves to{' '}
            <span className="text-tf-success">ACTIVE</span> or{' '}
            <span className="text-tf-rollback">ROLLED_BACK</span>.
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-tf-line bg-white/95 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3.5 md:gap-4 md:px-5">
              <div className="hidden min-w-0 flex-1 md:block">
                <div className="text-[11px] uppercase tracking-[0.18em] text-tf-muted">TelFlow · Activation OS</div>
                <h1 className="truncate text-base font-semibold text-slate-900">{copy.title}</h1>
              </div>

              <form onSubmit={onSearch} className="relative min-w-0 flex-1 md:max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-tf-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search order, MSISDN, circle…"
                  className="h-10 w-full rounded-xl border border-tf-line bg-tf-bg pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-tf-primary/50"
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
              <span className="min-w-0">
                <span className="block truncate font-semibold text-slate-900">{copy.title}</span>
                <span className="block truncate">{copy.subtitle}</span>
              </span>
              <span className="font-mono">{envClock}</span>
            </div>
            <nav aria-label="Primary navigation" className="flex gap-1 overflow-x-auto border-t border-tf-line px-3 py-2 lg:hidden">
              {nav.slice(0, 7).map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${isActive ? 'bg-tf-primary/10 text-tf-primary' : 'text-slate-500 hover:bg-tf-bg'}`}
                  >
                    <Icon size={14} />{item.label}
                  </NavLink>
                )
              })}
            </nav>
          </header>

          <main className="flex-1 p-3 sm:p-4 md:p-6">
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
