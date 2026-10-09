import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FileText,
  Headphones,
  Home,
  Inbox,
  LifeBuoy,
  LogOut,
  Menu,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
  Wifi,
  X,
} from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import './CustomerPortal.css'

type OrderStatus = 'Pending' | 'In progress' | 'Retrying' | 'Activated' | 'Failed' | 'Rolled back'
type NotificationType = 'success' | 'warning' | 'info' | 'danger'

interface CustomerOrder {
  id: string
  service: string
  type: string
  location: string
  created: string
  eta: string
  status: OrderStatus
  progress: number
  currentStep: number
  retryCount: number
  delay?: string
}

const orders: CustomerOrder[] = [
  { id: 'TF-24891', service: 'Business Connect 500', type: 'Business internet', location: 'Mumbai, MH', created: '12 Oct 2025', eta: '14 Oct 2025', status: 'In progress', progress: 72, currentStep: 2, retryCount: 0 },
  { id: 'TF-24763', service: 'Secure Voice Pro', type: 'Voice & collaboration', location: 'Pune, MH', created: '06 Oct 2025', eta: '09 Oct 2025', status: 'Activated', progress: 100, currentStep: 4, retryCount: 1 },
  { id: 'TF-24688', service: 'Business Connect 200', type: 'Business internet', location: 'Bengaluru, KA', created: '28 Sep 2025', eta: '04 Oct 2025', status: 'Retrying', progress: 55, currentStep: 2, retryCount: 2, delay: 'Network setup is taking a little longer than expected.' },
  { id: 'TF-24512', service: 'Fleet Connect', type: 'IoT connectivity', location: 'Delhi, DL', created: '14 Sep 2025', eta: '18 Sep 2025', status: 'Failed', progress: 42, currentStep: 2, retryCount: 3, delay: 'We could not reserve the requested inventory. Our team is ready to help.' },
]

function getOrders(): CustomerOrder[] {
  try {
    const saved = localStorage.getItem('telflow-demo-orders')
    return saved ? [...JSON.parse(saved), ...orders] : orders
  } catch {
    return orders
  }
}

function addDemoOrder(service: string, type: string): CustomerOrder {
  const newOrder: CustomerOrder = {
    id: `TF-${Math.floor(25000 + Math.random() * 999)}`,
    service,
    type,
    location: 'Mumbai, MH',
    created: 'Today',
    eta: '18 Oct 2025',
    status: 'Pending',
    progress: 12,
    currentStep: 0,
    retryCount: 0,
  }
  const existing = JSON.parse(localStorage.getItem('telflow-demo-orders') ?? '[]') as CustomerOrder[]
  localStorage.setItem('telflow-demo-orders', JSON.stringify([newOrder, ...existing]))
  return newOrder
}

const notificationsSeed = [
  { id: 1, type: 'success' as NotificationType, title: 'Your activation is moving forward', text: 'Inventory has been reserved for TF-24891.', time: '18 minutes ago', read: false },
  { id: 2, type: 'warning' as NotificationType, title: 'A small delay on your order', text: 'Network setup for TF-24688 needs a little more time.', time: '2 hours ago', read: false },
  { id: 3, type: 'info' as NotificationType, title: 'Monthly statement ready', text: 'Your September demo statement is ready to view.', time: 'Yesterday', read: true },
  { id: 4, type: 'danger' as NotificationType, title: 'Activation could not complete', text: 'Fleet Connect needs a new inventory check. Contact support for help.', time: '3 days ago', read: true },
]

const steps = ['Order received', 'Inventory reserved', 'Network setup', 'Billing setup', 'Activated']

const navItems = [
  { to: '/portal', label: 'Overview', icon: Home, end: true },
  { to: '/portal/orders', label: 'My orders', icon: FileText },
  { to: '/portal/activation', label: 'Activation center', icon: PackageCheck },
  { to: '/portal/plans', label: 'Explore plans', icon: Sparkles },
]

const bottomNavItems = [
  { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  { to: '/portal/support', label: 'Help & support', icon: LifeBuoy },
  { to: '/portal/settings', label: 'Profile & settings', icon: Settings },
]

function Brand() {
  return <Link to="/portal" className="customer-brand"><span className="customer-brand-mark">T</span><span><strong>TelFlow</strong><small>Customer portal</small></span></Link>
}

export function CustomerPortalLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const unread = notificationsSeed.filter((notification) => !notification.read).length
  const [globalSearch, setGlobalSearch] = useState('')

  return (
    <main className="customer-app">
      <aside className={`customer-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="customer-sidebar-head"><Brand /><button className="customer-mobile-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
        <div className="customer-demo-pill"><span /><div><strong>Demo workspace</strong><small>Frontend-only account</small></div></div>
        <nav className="customer-nav" aria-label="Customer navigation">
          <span className="customer-nav-label">Workspace</span>
          {navItems.map((item) => <CustomerNavItem key={item.to} {...item} onNavigate={() => setMobileOpen(false)} />)}
          <span className="customer-nav-label customer-nav-label-spaced">Account</span>
          {bottomNavItems.map((item) => <CustomerNavItem key={item.to} {...item} badge={item.label === 'Notifications' ? unread : undefined} onNavigate={() => setMobileOpen(false)} />)}
        </nav>
        <div className="customer-sidebar-help"><CircleHelp size={17} /><div><strong>Need a hand?</strong><span>We’re here to help</span></div><ChevronRight size={14} /></div>
        <Link to="/login" className="customer-logout"><LogOut size={15} /> Sign out</Link>
      </aside>
      {mobileOpen && <button className="customer-sidebar-overlay" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <div className="customer-main">
        <header className="customer-topbar">
          <button className="customer-menu-button" type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="customer-breadcrumb">Customer portal <ChevronRight size={13} /> <span>{getPageTitle(location.pathname)}</span></div>
          <form className="customer-global-search" onSubmit={(event) => { event.preventDefault(); if (globalSearch.trim()) window.location.href = `/portal/orders?search=${encodeURIComponent(globalSearch.trim())}` }}>
            <Search size={15} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search orders" aria-label="Search customer orders" />
          </form>
          <div className="customer-topbar-actions">
            <Link to="/portal/notifications" className="customer-notification-button" aria-label={`${unread} unread notifications`}><Bell size={18} />{unread > 0 && <span>{unread}</span>}</Link>
            <span className="customer-topbar-divider" />
            <Link to="/portal/settings" className="customer-profile-menu"><span className="customer-avatar">AM</span><span className="customer-profile-name"><strong>Alex Morgan</strong><small>Acme Networks</small></span><ChevronDown size={14} /></Link>
          </div>
        </header>
        <section className="customer-content"><Outlet /></section>
      </div>
    </main>
  )
}

function CustomerNavItem({ to, label, icon: Icon, end, badge, onNavigate }: { to: string; label: string; icon: typeof Home; end?: boolean; badge?: number; onNavigate?: () => void }) {
  return <NavLink to={to} end={end} onClick={onNavigate} className={({ isActive }) => `customer-nav-item ${isActive ? 'active' : ''}`}><Icon size={17} /><span>{label}</span>{badge ? <b>{badge}</b> : null}</NavLink>
}

function getPageTitle(pathname: string) {
  if (pathname.includes('/orders/')) return 'Order details'
  const item = [...navItems, ...bottomNavItems].find((navItem) => navItem.to !== '/portal' && pathname.startsWith(navItem.to))
  return item?.label ?? 'Overview'
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="customer-page-header"><div><span className="customer-eyebrow">{eyebrow ?? 'Customer workspace'}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`customer-card ${className}`}>{children}</section>
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`customer-status customer-status-${status.toLowerCase().replaceAll(' ', '-')}`}><span />{status}</span>
}

function EmptyState({ icon: Icon, title, text }: { icon: typeof Inbox; title: string; text: string }) {
  return <div className="customer-empty"><span><Icon size={22} /></span><strong>{title}</strong><p>{text}</p></div>
}

export function CustomerPortalHomePage() {
  const customerOrders = getOrders()
  const pending = customerOrders.filter((order) => order.status !== 'Activated').length
  const active = customerOrders.filter((order) => order.status === 'In progress' || order.status === 'Retrying').length
  const failed = customerOrders.filter((order) => order.status === 'Failed' || order.status === 'Rolled back').length
  return <div className="customer-page">
    <PageHeader eyebrow="Monday, 13 October 2025" title="Good morning, Alex." description="Here’s what’s happening across your TelFlow services." action={<Link to="/portal/plans" className="customer-primary-button"><Plus size={16} /> Add a service</Link>} />
    <div className="customer-welcome-grid">
      <Card className="customer-hero-card"><div className="customer-hero-copy"><span className="customer-icon-tile blue"><ShieldCheck size={19} /></span><span className="customer-eyebrow">Your workspace is looking good</span><h2>Stay connected to what matters.</h2><p>Track every activation, service, and support update from one simple place.</p><Link to="/portal/activation" className="customer-text-link">Track your latest activation <ArrowRight size={14} /></Link></div><div className="customer-hero-illustration"><div className="hero-ring hero-ring-one" /><div className="hero-ring hero-ring-two" /><Wifi size={42} /></div></Card>
      <Card className="customer-profile-card"><div className="customer-profile-card-top"><span className="customer-avatar large">AM</span><Link to="/portal/settings" aria-label="Edit profile"><Settings size={16} /></Link></div><strong>Alex Morgan</strong><p>Workspace owner</p><div className="customer-profile-line"><span>Customer ID</span><b>TF-CUS-10482</b></div><div className="customer-profile-line"><span>Member since</span><b>October 2024</b></div></Card>
    </div>
    <div className="customer-stat-grid"><StatCard icon={<FileText />} label="Total orders" value={`${customerOrders.length}`} detail="Across your workspace" tone="blue" link="/portal/orders" /><StatCard icon={<PackageCheck />} label="Active activations" value={`${active}`} detail="Currently moving forward" tone="green" link="/portal/activation" /><StatCard icon={<Clock3 />} label="Pending orders" value={`${pending}`} detail="1 needs your attention" tone="amber" link="/portal/orders" /><StatCard icon={<AlertCircle />} label="Failed activations" value={`${failed}`} detail="Review recovery guidance" tone="violet" link="/portal/activation" /></div>
    <div className="customer-section-title"><div><h2>Quick actions</h2><p>Common things you may want to do</p></div></div>
    <div className="customer-quick-grid"><QuickAction icon={<Plus />} title="New activation" text="Choose a plan for your team" to="/portal/plans" /><QuickAction icon={<PackageCheck />} title="Track an order" text="See your latest activation progress" to="/portal/activation" /><QuickAction icon={<Headphones />} title="Get support" text="We’re ready to help" to="/portal/support" /></div>
    <div className="customer-section-title"><div><h2>Recent activity</h2><p>Your latest TelFlow updates</p></div><Link to="/portal/notifications" className="customer-text-link">View all <ArrowRight size={14} /></Link></div>
    <Card><ActivityList limit={3} /></Card>
  </div>
}

function StatCard({ icon, label, value, detail, tone, link }: { icon: ReactNode; label: string; value: string; detail: string; tone: string; link: string }) {
  return <Link to={link} className="customer-stat-card"><span className={`customer-icon-tile ${tone}`}>{icon}</span><span className="customer-stat-label">{label}</span><strong>{value}</strong><small>{detail}</small><ArrowRight className="customer-stat-arrow" size={15} /></Link>
}

function QuickAction({ icon, title, text, to }: { icon: ReactNode; title: string; text: string; to: string }) {
  return <Link to={to} className="customer-quick-card"><span className="customer-icon-tile blue">{icon}</span><span><strong>{title}</strong><small>{text}</small></span><ArrowRight size={15} /></Link>
}

function ActivityList({ limit }: { limit?: number }) {
  const activity = [
    { icon: <CheckCircle2 />, title: 'Inventory reserved', text: 'Equipment reserved for Business Connect 500.', time: '18 minutes ago', tone: 'success' },
    { icon: <AlertCircle />, title: 'Activation delay detected', text: 'Network setup for TF-24688 needs more time.', time: '2 hours ago', tone: 'warning' },
    { icon: <CreditCard />, title: 'Monthly statement ready', text: 'Your September demo statement is available.', time: 'Yesterday', tone: 'info' },
    { icon: <UserRound />, title: 'Profile updated', text: 'Your contact preferences were saved.', time: '08 Oct 2025', tone: 'success' },
  ]
  return <div className="customer-activity-list">{activity.slice(0, limit).map((item) => <div className="customer-activity-row" key={item.title}><span className={`customer-activity-icon ${item.tone}`}>{item.icon}</span><div><strong>{item.title}</strong><p>{item.text}</p></div><time>{item.time}</time></div>)}</div>
}

export function CustomerOrdersPage() {
  const location = useLocation()
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('search') ?? '')
  const [status, setStatus] = useState('All statuses')
  const [service, setService] = useState('All services')
  const customerOrders = getOrders()
  const filtered = customerOrders.filter((order) => `${order.id} ${order.service} ${order.type}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || order.status === status) && (service === 'All services' || order.type === service))
  return <div className="customer-page"><PageHeader title="My orders" description="Follow every request from submission to activation." action={<Link to="/portal/plans" className="customer-primary-button"><Plus size={16} /> New activation</Link>} /><Card className="customer-orders-card"><div className="customer-filter-bar"><div className="customer-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order ID or service" aria-label="Search orders" /></div><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option>All statuses</option><option>Pending</option><option>In progress</option><option>Retrying</option><option>Activated</option><option>Failed</option><option>Rolled back</option></select><select value={service} onChange={(e) => setService(e.target.value)} aria-label="Filter by service"><option>All services</option><option>Business internet</option><option>Voice & collaboration</option><option>IoT connectivity</option></select></div><div className="customer-table-wrap">{filtered.length ? <table className="customer-table"><thead><tr><th>Order</th><th>Plan</th><th>Created</th><th>Last update</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((order) => <tr key={order.id}><td><Link to={`/portal/orders/${order.id}`} className="customer-order-id">{order.id}</Link><small>{order.location}</small></td><td><strong>{order.service}</strong><small>{order.type}</small></td><td>{order.created}</td><td>{order.eta}</td><td><StatusBadge status={order.status} /></td><td><Link to={`/portal/orders/${order.id}`} className="customer-row-action" aria-label={`View ${order.id}`}><ChevronRight size={17} /></Link></td></tr>)}</tbody></table> : <EmptyState icon={Search} title="No orders found" text="Try a different search or filter." />}</div></Card></div>
}

export function CustomerOrderDetailsPage() {
  const { orderId } = useParams()
  const order = getOrders().find((item) => item.id === orderId) ?? getOrders()[0]
  return <div className="customer-page"><Link to="/portal/orders" className="customer-back-link">← Back to my orders</Link><PageHeader eyebrow="Order details" title={order.id} description={`${order.service} · ${order.location}`} action={<StatusBadge status={order.status} />} /><div className="customer-detail-grid"><Card><div className="customer-card-title"><div><h2>Activation timeline</h2><p>Order progress and recent events</p></div><Link to="/portal/activation" className="customer-text-link">Full tracker <ArrowRight size={14} /></Link></div><Timeline order={order} /><div className="customer-event-list"><div><CheckCircle2 size={16} /><span><strong>Inventory reserved</strong><small>Equipment is ready for the next step.</small></span><time>Today, 09:42</time></div><div><Activity size={16} /><span><strong>Network setup started</strong><small>Our activation workflow is working through your request.</small></span><time>Today, 09:46</time></div></div></Card><div className="customer-detail-side"><Card><div className="customer-card-title"><div><h2>Service information</h2><p>Details for this request</p></div></div><InfoRow label="Service" value={order.service} /><InfoRow label="Service type" value={order.type} /><InfoRow label="Location" value={order.location} /><InfoRow label="Requested" value={order.created} /><InfoRow label="Retries" value={`${order.retryCount} ${order.retryCount === 1 ? 'retry' : 'retries'}`} /></Card>{order.delay && <Card className="customer-notice-card"><AlertCircle size={18} /><strong>{order.status === 'Failed' || order.status === 'Rolled back' ? 'Activation needs attention' : 'A little longer than usual'}</strong><p>{order.delay}</p><Link to="/portal/support" className="customer-text-link">Contact support <ArrowRight size={14} /></Link></Card>}</div></div></div>
}

function InfoRow({ label, value }: { label: string; value: string }) { return <div className="customer-info-row"><span>{label}</span><strong>{value}</strong></div> }

function Timeline({ order }: { order: CustomerOrder }) {
  return <div className="customer-timeline">{steps.map((step, index) => { const done = index < order.currentStep || order.status === 'Activated'; const current = index === order.currentStep && order.status !== 'Activated'; return <div className={`customer-timeline-step ${done ? 'done' : ''} ${current ? 'current' : ''}`} key={step}><span className="customer-timeline-dot">{done ? <Check size={13} /> : current ? <span /> : index + 1}</span><div><strong>{step}</strong><small>{done ? (index === 0 ? '12 Oct · 10:12' : index === 1 ? 'Today · 09:42' : 'Completed') : current ? `In progress${order.retryCount ? ` · ${order.retryCount} retries` : ''}` : 'Up next'}</small></div></div> })}</div>
}

export function CustomerTrackingPage() {
  const customerOrders = getOrders()
  const [selectedId, setSelectedId] = useState(customerOrders[0].id)
  const order = customerOrders.find((item) => item.id === selectedId) ?? customerOrders[0]
  return <div className="customer-page"><PageHeader title="Activation center" description="Follow each customer-facing milestone from order to activation." action={<Link to="/portal/plans" className="customer-primary-button"><Plus size={16} /> New activation</Link>} /><div className="customer-track-select"><span>Tracking order</span><select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>{customerOrders.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.service}</option>)}</select></div><Card className="customer-tracker-card"><div className="customer-tracker-heading"><div><span className="customer-eyebrow">Simulated activation status</span><h2>{order.service}</h2><p>{order.id} · Last updated a few minutes ago</p></div><StatusBadge status={order.status} /></div><div className="customer-tracker-progress"><span style={{ width: `${order.progress}%` }} /></div><div className="customer-tracker-percent"><strong>{order.progress}% complete</strong><span>{order.status === 'Activated' ? 'Service activated' : `Estimated ${order.eta}`}</span></div><Timeline order={order} /></Card><div className="customer-track-bottom"><Card><div className="customer-card-title"><div><h2>Activation notes</h2><p>Customer-friendly updates for this request</p></div></div><div className="customer-note-row"><Clock3 size={17} /><span><strong>Current stage</strong><small>{steps[order.currentStep]} · We’re working on it now.</small></span></div><div className="customer-note-row"><Activity size={17} /><span><strong>Retries</strong><small>{order.retryCount ? `${order.retryCount} automatic retries have been attempted.` : 'No retries needed so far.'}</small></span></div>{order.delay && <div className="customer-note-row warning"><AlertCircle size={17} /><span><strong>Friendly heads-up</strong><small>{order.delay}</small></span></div>}</Card><Card><div className="customer-card-title"><div><h2>Need help?</h2><p>Our support team can review this simulated activation.</p></div></div><Link to="/portal/support" className="customer-primary-button full">Create support ticket <ArrowRight size={15} /></Link></Card></div></div>
}

const plans = [
  { name: 'Business Connect 200', eyebrow: 'Essential connectivity', price: '₹2,499', detail: 'per month', features: ['200 Mbps dedicated internet', 'Business-grade support', 'Static IP included'], tone: 'blue' },
  { name: 'Business Connect 500', eyebrow: 'Most popular', price: '₹4,999', detail: 'per month', features: ['500 Mbps dedicated internet', 'Priority support 24/7', 'Static IP + security bundle'], tone: 'featured' },
  { name: 'Enterprise Connect 1G', eyebrow: 'For growing teams', price: '₹9,999', detail: 'per month', features: ['1 Gbps dedicated internet', 'Dedicated service manager', 'Advanced network protection'], tone: 'dark' },
]

export function CustomerPlansPage() {
  const [requested, setRequested] = useState('')
  return <div className="customer-page"><PageHeader title="Explore plans" description="Flexible connectivity for the way your team works." /><div className="customer-demo-disclaimer"><Tag size={15} /><span>Demo pricing</span><p>Prices shown are sample data for this frontend experience. No payment or provisioning takes place.</p></div><div className="customer-plans-grid">{plans.map((plan) => <Card key={plan.name} className={`customer-plan-card ${plan.tone}`}><span className="customer-plan-eyebrow">{plan.eyebrow}</span><h2>{plan.name}</h2><p className="customer-plan-description">Reliable connectivity with a calm, human support experience.</p><div className="customer-plan-price"><strong>{plan.price}</strong><span>{plan.detail}<br />demo data</span></div><div className="customer-plan-features">{plan.features.map((feature) => <span key={feature}><Check size={15} /> {feature}</span>)}</div><button className={`customer-plan-button ${plan.tone === 'featured' ? 'primary' : ''}`} type="button" onClick={() => { addDemoOrder(plan.name, 'Business internet'); setRequested(plan.name) }}>{requested === plan.name ? <><Check size={15} /> Activation requested</> : <>Request activation <ArrowRight size={15} /></>}</button></Card>)}</div></div>
}

export function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsSeed)
  function markRead(id: number) { setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)) }
  return <div className="customer-page"><PageHeader title="Notifications" description="Important updates from your TelFlow workspace." action={<button className="customer-secondary-button" type="button" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}><Check size={15} /> Mark all as read</button>} /><Card className="customer-notifications-card">{notifications.length ? notifications.map((notification) => <div className={`customer-notification-row ${notification.read ? 'read' : ''}`} key={notification.id}><span className={`customer-notification-icon ${notification.type}`}>{notification.type === 'success' ? <CheckCircle2 size={17} /> : notification.type === 'warning' ? <Clock3 size={17} /> : notification.type === 'danger' ? <AlertCircle size={17} /> : <Bell size={17} />}</span><div><strong>{notification.title}</strong><p>{notification.text}</p><time>{notification.time}</time></div>{!notification.read && <button type="button" onClick={() => markRead(notification.id)}>Mark as read</button>}</div>) : <EmptyState icon={Bell} title="You’re all caught up" text="New service updates will appear here." />}</Card></div>
}

export function CustomerSupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [subject, setSubject] = useState('')
  const [orderId, setOrderId] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [description, setDescription] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    if (!subject || !description.trim()) {
      setFormError('Choose an issue type and add a short description before submitting.')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 550)
  }
  return <div className="customer-page"><PageHeader title="Help & support" description="Tell us what you need and we’ll guide you from here." /><div className="customer-support-grid"><Card><div className="customer-card-title"><div><h2>Create a support ticket</h2><p>Simulated support request — no message is sent.</p></div><Headphones size={19} className="customer-muted-icon" /></div>{submitted ? <div className="customer-form-success"><CheckCircle2 size={25} /><strong>Ticket created successfully</strong><p>Your demo ticket <b>SUP-1084</b> is now open. A support specialist would usually follow up here.</p><button className="customer-secondary-button" type="button" onClick={() => { setSubmitted(false); setSubject(''); setOrderId(''); setPriority('Normal'); setDescription('') }}>Create another ticket</button></div> : <form className="customer-form" onSubmit={submit}><label>Issue type<select value={subject} onChange={(e) => setSubject(e.target.value)}><option value="">Select an issue</option><option>Activation is delayed</option><option>Service is not working</option><option>Billing question</option><option>Update my profile</option><option>Something else</option></select></label><label>Related order (optional)<select value={orderId} onChange={(e) => setOrderId(e.target.value)}><option value="">Choose an order</option>{getOrders().map((order) => <option key={order.id} value={order.id}>{order.id} · {order.service}</option>)}</select></label><label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value)}><option>Normal</option><option>High</option><option>Urgent</option></select></label><label>How can we help?<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share a little more about what’s happening…" rows={5} /></label>{formError && <div className="customer-form-error" role="alert">{formError}</div>}<button className="customer-primary-button" type="submit" disabled={submitting}>{submitting ? <><span className="customer-button-spinner" /> Creating ticket…</> : <><SendIcon /> Create demo ticket</>}</button></form>}</Card><Card><div className="customer-card-title"><div><h2>Your tickets</h2><p>Recent simulated support requests</p></div></div><div className="customer-ticket"><span className="customer-ticket-icon"><Inbox size={16} /></span><div><strong>SUP-1081 · Activation question</strong><small>We replied 2 days ago</small></div><span className="customer-ticket-status">Resolved</span></div><div className="customer-ticket"><span className="customer-ticket-icon"><Clock3 size={16} /></span><div><strong>SUP-1074 · Plan information</strong><small>Closed 12 days ago</small></div><span className="customer-ticket-status closed">Closed</span></div></Card></div></div>
}

function SendIcon() { return <ArrowRight size={15} /> }

export function CustomerSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState(() => localStorage.getItem('telflow-demo-name') ?? 'Alex Morgan')
  const [email, setEmail] = useState('alex.morgan@example.com')
  const [updates, setUpdates] = useState(true)
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a name and valid email address.'); return } setError(''); localStorage.setItem('telflow-demo-name', name.trim()); setSaved(true); window.setTimeout(() => setSaved(false), 2200) }
  function cancel() { setName(localStorage.getItem('telflow-demo-name') ?? 'Alex Morgan'); setEmail('alex.morgan@example.com'); setError('') }
  return <div className="customer-page"><PageHeader title="Profile & settings" description="Manage your demo profile and communication preferences." action={<Link to="/login" className="customer-secondary-button"><LogOut size={15} /> Sign out</Link>} /><div className="customer-settings-grid"><Card><div className="customer-card-title"><div><h2>Profile details</h2><p>Only stored locally in this demo.</p></div></div><form className="customer-form" onSubmit={save}><label>Full name<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Email address<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></label><label>Company<input defaultValue="Acme Networks" /></label><label>Phone number<input defaultValue="+91 98765 43210" /></label>{error && <div className="customer-form-error" role="alert">{error}</div>}<div className="customer-form-actions"><button className="customer-secondary-button" type="button" onClick={cancel}>Cancel</button><button className="customer-primary-button" type="submit">{saved ? <><Check size={15} /> Saved locally</> : 'Save changes'}</button></div></form></Card><div className="customer-settings-side"><Card><div className="customer-card-title"><div><h2>Notifications</h2><p>Choose what you hear about.</p></div><Bell size={18} className="customer-muted-icon" /></div><label className="customer-toggle-row"><span><strong>Activation updates</strong><small>Progress, delays, and completion</small></span><input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} /></label><label className="customer-toggle-row"><span><strong>Product news</strong><small>New plans and helpful tips</small></span><input type="checkbox" defaultChecked /></label></Card><Card className="customer-security-card"><ShieldCheck size={19} /><div><strong>Demo account security</strong><p>This is a frontend-only workspace. No passwords, payment data, or sensitive information are stored.</p></div></Card></div></div></div>
}
