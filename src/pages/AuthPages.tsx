import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Headphones,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from 'lucide-react'
import './AuthPages.css'

type Role = 'admin' | 'customer'
type Mode = 'login' | 'signup'

const roleCopy = {
  admin: {
    label: 'Admin workspace',
    title: 'Operate every activation with confidence.',
    description: 'A focused control plane for teams orchestrating reliable telecom activations at scale.',
    loginPath: '/login/admin',
    signupPath: '/signup/admin',
    demoEmail: 'admin@telflow.io',
    accent: 'blue',
    Icon: ShieldCheck,
  },
  customer: {
    label: 'Customer portal',
    title: 'Your telecom, always in motion.',
    description: 'Track service activations, manage your account, and stay close to every milestone.',
    loginPath: '/login/user',
    signupPath: '/signup/user',
    demoEmail: 'demo@telflow.io',
    accent: 'violet',
    Icon: UserRound,
  },
} as const

function Brand() {
  return (
    <Link to="/login" className="auth-brand" aria-label="TelFlow home">
      <span className="auth-brand-mark">T</span>
      <span>
        <strong>TelFlow</strong>
        <small>Activation OS</small>
      </span>
    </Link>
  )
}

function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <header className="auth-header">
        <Brand />
        <span className="auth-secure-note">
          <LockKeyhole size={14} /> Frontend demo environment
        </span>
      </header>
      {children}
      <footer className="auth-footer">
        <span>© 2025 TelFlow</span>
        <span className="auth-footer-links"><a href="#privacy">Privacy</a><a href="#support">Support</a></span>
      </footer>
    </main>
  )
}

export function AuthLandingPage() {
  return (
    <AuthFrame>
      <section className="auth-landing">
        <motion.div
          className="auth-landing-copy"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="auth-eyebrow"><Sparkles size={14} /> The modern activation workspace</span>
          <h1>Move every connection <em>forward.</em></h1>
          <p>TelFlow brings the people, systems, and signals behind every telecom activation into one calm control plane.</p>
          <div className="auth-proof-row">
            <span><Check size={14} /> Reliable by design</span>
            <span><Check size={14} /> Built for teams</span>
          </div>
        </motion.div>

        <motion.div
          className="auth-role-grid"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <RoleCard role="admin" />
          <RoleCard role="customer" />
        </motion.div>
      </section>
    </AuthFrame>
  )
}

function RoleCard({ role }: { role: Role }) {
  const copy = roleCopy[role]
  const Icon = copy.Icon
  return (
    <article className={`role-card role-card-${copy.accent}`}>
      <div className="role-card-top">
        <span className="role-icon"><Icon size={21} /></span>
        <span className="role-badge">Demo access</span>
      </div>
      <div>
        <p className="role-label">{copy.label}</p>
        <h2>{role === 'admin' ? 'Run the operation.' : 'Stay in control.'}</h2>
        <p className="role-description">{copy.description}</p>
      </div>
      <div className="role-card-actions">
        <Link className="auth-button auth-button-primary" to={copy.loginPath}>Sign in <ArrowRight size={16} /></Link>
        <Link className="role-signup-link" to={copy.signupPath}>Create demo account</Link>
      </div>
    </article>
  )
}

export function AuthFormPage({ mode, role }: { mode: Mode; role: Role }) {
  const copy = roleCopy[role]
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const message = (location.state as { message?: string } | null)?.message

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your full name.')
      return
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (mode === 'login' && normalizedEmail !== copy.demoEmail) {
      setError(`Use the demo email ${copy.demoEmail}.`)
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (mode === 'signup') {
        navigate(copy.loginPath, { state: { message: 'Demo account ready. Sign in to continue.' } })
      } else {
        navigate(role === 'admin' ? '/dashboard' : '/portal')
      }
    }, 650)
  }

  return (
    <AuthFrame>
      <section className="auth-form-layout">
        <Link to="/login" className="auth-back-link"><ChevronLeft size={16} /> Back to account selection</Link>
        <motion.div className="auth-form-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className={`form-role-mark form-role-mark-${copy.accent}`}><copy.Icon size={21} /></div>
          <span className="auth-eyebrow">{copy.label}</span>
          <h1>{mode === 'login' ? 'Welcome back.' : 'Create your demo account.'}</h1>
          <p className="auth-form-intro">
            {mode === 'login' ? 'Sign in to your TelFlow workspace and pick up where you left off.' : 'Explore the TelFlow experience with a lightweight frontend-only account.'}
          </p>
          {message && <div className="auth-success"><Check size={16} /> {message}</div>}
          <form onSubmit={submit} noValidate>
            {mode === 'signup' && <Field label="Full name" value={name} onChange={setName} placeholder="Alex Morgan" icon={<UserRound size={17} />} />}
            <Field label="Email address" value={email} onChange={setEmail} placeholder={copy.demoEmail} type="email" icon={<Headphones size={17} />} />
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={17} />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
            </div>
            {mode === 'signup' && <Field label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat your password" type={showPassword ? 'text' : 'password'} icon={<LockKeyhole size={17} />} />}
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="auth-button auth-button-submit" type="submit" disabled={loading}>{loading ? <><span className="auth-spinner" /> Checking demo access…</> : <>{mode === 'login' ? 'Continue to workspace' : 'Create demo account'} <ArrowRight size={16} /></>}</button>
          </form>
          <p className="auth-switch">
            {mode === 'login' ? <>New to TelFlow? <Link to={copy.signupPath}>Create a demo account</Link></> : <>Already have an account? <Link to={copy.loginPath}>Sign in instead</Link></>}
          </p>
          <div className="demo-note"><Zap size={15} /><span><strong>Demo authentication</strong><br />Use <b>{copy.demoEmail}</b> with any password of 6+ characters.</span></div>
        </motion.div>
      </section>
    </AuthFrame>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', icon }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; icon: ReactNode }) {
  return (
    <div className="auth-field">
      <label htmlFor={label}>{label}</label>
      <div className="auth-input-wrap">
        {icon}
        <input id={label} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={type === 'email' ? 'email' : 'name'} />
      </div>
    </div>
  )
}
