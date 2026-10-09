import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, Check, ChevronDown, CircleAlert, Clock3, FastForward, Maximize2, Pause, Play, RotateCcw, Zap } from 'lucide-react'
import './WorkflowPreviewPage.css'

type Scenario = 'success' | 'transient' | 'permanent'
type Lane = 'Inventory' | 'Network' | 'Billing' | 'Notification'
type Tone = 'success' | 'warning' | 'failure' | 'neutral'
type EventKind = 'workflow' | 'scheduled' | 'completed' | 'failed' | 'retry' | 'compensation' | 'released' | 'rolled-back'
interface SimEvent { id: string; at: number; label: string; detail: string; kind: EventKind; lane?: Lane; attempt?: number; spanId?: string }
interface Span { id: string; lane: Lane; attempt: number; start: number; end: number; tone: Tone; compensation?: boolean; relation?: string; error?: string }
interface ScenarioData { label: string; workflowId: string; orderId: string; duration: number; spans: Span[]; events: SimEvent[] }

const scenarios: Record<Scenario, ScenarioData> = {
  success: {
    label: 'SUCCESS', workflowId: 'activation-saga-7f3a9c2', orderId: 'ORD-2025-08421', duration: 12000,
    spans: [
      { id: 'inv-1', lane: 'Inventory', attempt: 1, start: 800, end: 2800, tone: 'success' },
      { id: 'net-1', lane: 'Network', attempt: 1, start: 3300, end: 6500, tone: 'success' },
      { id: 'bill-1', lane: 'Billing', attempt: 1, start: 7000, end: 9200, tone: 'success' },
      { id: 'not-1', lane: 'Notification', attempt: 1, start: 9700, end: 11300, tone: 'success' },
    ],
    events: [
      { id: 's1', at: 0, label: 'Workflow started', detail: 'Activation saga accepted for execution.', kind: 'workflow' },
      { id: 's2', at: 800, label: 'Activity scheduled', detail: 'Inventory reservation scheduled.', kind: 'scheduled', lane: 'Inventory', attempt: 1, spanId: 'inv-1' },
      { id: 's3', at: 2800, label: 'Activity completed', detail: 'Inventory reservation confirmed.', kind: 'completed', lane: 'Inventory', attempt: 1, spanId: 'inv-1' },
      { id: 's4', at: 3300, label: 'Activity scheduled', detail: 'Network provisioning scheduled.', kind: 'scheduled', lane: 'Network', attempt: 1, spanId: 'net-1' },
      { id: 's5', at: 6500, label: 'Activity completed', detail: 'Network resources provisioned.', kind: 'completed', lane: 'Network', attempt: 1, spanId: 'net-1' },
      { id: 's6', at: 7000, label: 'Activity scheduled', detail: 'Billing account activation scheduled.', kind: 'scheduled', lane: 'Billing', attempt: 1, spanId: 'bill-1' },
      { id: 's7', at: 9200, label: 'Activity completed', detail: 'Billing account activated.', kind: 'completed', lane: 'Billing', attempt: 1, spanId: 'bill-1' },
      { id: 's8', at: 9700, label: 'Activity scheduled', detail: 'Customer notification scheduled.', kind: 'scheduled', lane: 'Notification', attempt: 1, spanId: 'not-1' },
      { id: 's9', at: 11300, label: 'Activity completed', detail: 'Customer notification delivered.', kind: 'completed', lane: 'Notification', attempt: 1, spanId: 'not-1' },
      { id: 's10', at: 12000, label: 'Workflow completed', detail: 'All activation steps completed successfully.', kind: 'completed' },
    ],
  },
  transient: {
    label: 'TRANSIENT BILLING FAILURE', workflowId: 'activation-saga-a91d02e', orderId: 'ORD-2025-08437', duration: 16000,
    spans: [
      { id: 'inv-1', lane: 'Inventory', attempt: 1, start: 700, end: 2300, tone: 'success' },
      { id: 'net-1', lane: 'Network', attempt: 1, start: 2800, end: 5200, tone: 'success' },
      { id: 'bill-1', lane: 'Billing', attempt: 1, start: 5700, end: 7300, tone: 'failure', error: 'Gateway timeout after 3,000 ms' },
      { id: 'bill-2', lane: 'Billing', attempt: 2, start: 8800, end: 11300, tone: 'success' },
      { id: 'not-1', lane: 'Notification', attempt: 1, start: 12000, end: 14600, tone: 'success' },
    ],
    events: [
      { id: 't1', at: 0, label: 'Workflow started', detail: 'Activation saga accepted for execution.', kind: 'workflow' },
      { id: 't2', at: 700, label: 'Activity scheduled', detail: 'Inventory reservation scheduled.', kind: 'scheduled', lane: 'Inventory', attempt: 1, spanId: 'inv-1' },
      { id: 't3', at: 2300, label: 'Activity completed', detail: 'Inventory reservation confirmed.', kind: 'completed', lane: 'Inventory', attempt: 1, spanId: 'inv-1' },
      { id: 't4', at: 2800, label: 'Activity scheduled', detail: 'Network provisioning scheduled.', kind: 'scheduled', lane: 'Network', attempt: 1, spanId: 'net-1' },
      { id: 't5', at: 5200, label: 'Activity completed', detail: 'Network resources provisioned.', kind: 'completed', lane: 'Network', attempt: 1, spanId: 'net-1' },
      { id: 't6', at: 5700, label: 'Activity scheduled', detail: 'Billing activation scheduled. Attempt 1 of 3.', kind: 'scheduled', lane: 'Billing', attempt: 1, spanId: 'bill-1' },
      { id: 't7', at: 7300, label: 'Billing timeout', detail: 'Transient gateway timeout; retry policy will apply.', kind: 'failed', lane: 'Billing', attempt: 1, spanId: 'bill-1' },
      { id: 't8', at: 7300, label: 'Retry scheduled', detail: 'Exponential backoff: waiting 1.5 seconds.', kind: 'retry', lane: 'Billing', attempt: 2, spanId: 'bill-2' },
      { id: 't9', at: 8800, label: 'Activity scheduled', detail: 'Billing activation scheduled. Attempt 2 of 3.', kind: 'scheduled', lane: 'Billing', attempt: 2, spanId: 'bill-2' },
      { id: 't10', at: 11300, label: 'Activity completed', detail: 'Billing activated on retry.', kind: 'completed', lane: 'Billing', attempt: 2, spanId: 'bill-2' },
      { id: 't11', at: 12000, label: 'Activity scheduled', detail: 'Customer notification scheduled.', kind: 'scheduled', lane: 'Notification', attempt: 1, spanId: 'not-1' },
      { id: 't12', at: 14600, label: 'Activity completed', detail: 'Customer notification delivered.', kind: 'completed', lane: 'Notification', attempt: 1, spanId: 'not-1' },
      { id: 't13', at: 16000, label: 'Workflow completed', detail: 'Activation completed after a successful billing retry.', kind: 'completed' },
    ],
  },
  permanent: {
    label: 'PERMANENT BILLING FAILURE', workflowId: 'activation-saga-cc2e1b4', orderId: 'ORD-2025-08452', duration: 15000,
    spans: [
      { id: 'inv-1', lane: 'Inventory', attempt: 1, start: 700, end: 2300, tone: 'success' },
      { id: 'net-1', lane: 'Network', attempt: 1, start: 2800, end: 5200, tone: 'success', relation: 'comp-net' },
      { id: 'bill-1', lane: 'Billing', attempt: 1, start: 5700, end: 8100, tone: 'failure', error: 'Permanent rejection: account is in credit hold' },
      { id: 'comp-net', lane: 'Network', attempt: 1, start: 9300, end: 11500, tone: 'warning', compensation: true, relation: 'net-1' },
      { id: 'comp-inv', lane: 'Inventory', attempt: 1, start: 12000, end: 13900, tone: 'warning', compensation: true, relation: 'inv-1' },
    ],
    events: [
      { id: 'p1', at: 0, label: 'Workflow started', detail: 'Activation saga accepted for execution.', kind: 'workflow' },
      { id: 'p2', at: 700, label: 'Activity scheduled', detail: 'Inventory reservation scheduled.', kind: 'scheduled', lane: 'Inventory', attempt: 1, spanId: 'inv-1' },
      { id: 'p3', at: 2300, label: 'Activity completed', detail: 'Inventory reservation confirmed.', kind: 'completed', lane: 'Inventory', attempt: 1, spanId: 'inv-1' },
      { id: 'p4', at: 2800, label: 'Activity scheduled', detail: 'Network provisioning scheduled.', kind: 'scheduled', lane: 'Network', attempt: 1, spanId: 'net-1' },
      { id: 'p5', at: 5200, label: 'Activity completed', detail: 'Network resources provisioned.', kind: 'completed', lane: 'Network', attempt: 1, spanId: 'net-1' },
      { id: 'p6', at: 5700, label: 'Activity scheduled', detail: 'Billing activation scheduled.', kind: 'scheduled', lane: 'Billing', attempt: 1, spanId: 'bill-1' },
      { id: 'p7', at: 8100, label: 'Billing rejected', detail: 'Permanent credit hold rejection. Retry is not applicable.', kind: 'failed', lane: 'Billing', attempt: 1, spanId: 'bill-1' },
      { id: 'p8', at: 9000, label: 'Compensation started', detail: 'Rolling back provisioned network resources.', kind: 'compensation', lane: 'Network', attempt: 1, spanId: 'comp-net' },
      { id: 'p9', at: 11500, label: 'Activity completed', detail: 'Network resources deprovisioned.', kind: 'completed', lane: 'Network', attempt: 1, spanId: 'comp-net' },
      { id: 'p10', at: 12000, label: 'Compensation started', detail: 'Releasing the reserved inventory.', kind: 'compensation', lane: 'Inventory', attempt: 1, spanId: 'comp-inv' },
      { id: 'p11', at: 13900, label: 'Inventory released', detail: 'Reserved inventory returned to available stock.', kind: 'released', lane: 'Inventory', attempt: 1, spanId: 'comp-inv' },
      { id: 'p12', at: 15000, label: 'Workflow rolled back', detail: 'Compensation completed; activation did not proceed.', kind: 'rolled-back' },
    ],
  },
}

const laneOrder: Lane[] = ['Inventory', 'Network', 'Billing', 'Notification']
const toneColor: Record<Tone, string> = { success: '#16A765', warning: '#E9A11B', failure: '#E45454', neutral: '#3978F6' }
const eventTone = (kind: EventKind): Tone => kind === 'failed' || kind === 'rolled-back' ? 'failure' : kind === 'retry' || kind === 'compensation' || kind === 'released' ? 'warning' : kind === 'completed' ? 'success' : 'neutral'
const formatClock = (ms: number) => `00:${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(Math.floor(ms % 1000 / 100)).padStart(1, '0')}`
const durationLabel = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`

export function WorkflowPreviewPage() {
  const [scenario, setScenario] = useState<Scenario>('transient')
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const timelineViewport = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)
  const lastTick = useRef<number | null>(null)
  const data = scenarios[scenario]
  const visibleEvents = useMemo(() => data.events.filter(event => event.at <= elapsed), [data, elapsed])
  const activeSpan = data.spans.find(span => span.id === selectedSpan || span.id === hovered)
  const progress = Math.min(1, elapsed / data.duration)
  const finished = elapsed >= data.duration

  useEffect(() => {
    if (!playing || finished) { lastTick.current = null; return }
    const tick = (now: number) => {
      if (lastTick.current === null) lastTick.current = now
      const delta = now - lastTick.current
      lastTick.current = now
      setElapsed(current => Math.min(data.duration, current + delta * speed))
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; lastTick.current = null }
  }, [playing, finished, speed, data.duration])

  const restart = (next = scenario) => { setScenario(next); setElapsed(0); setSelectedEvent(null); setSelectedSpan(null); setHovered(null); setPlaying(true); lastTick.current = null }
  const fitTimeline = () => {
    const availableWidth = timelineViewport.current?.clientWidth ?? 1040
    setZoom(Math.max(.75, Math.min(1.75, availableWidth / 1040)))
  }
  const timelineWidth = Math.round(1040 * zoom)
  const left = 178
  const chartWidth = timelineWidth - left - 30
  const xAt = (ms: number) => left + Math.max(0, Math.min(1, ms / data.duration)) * chartWidth
  const currentLabel = finished ? scenario === 'permanent' ? 'ROLLED BACK' : 'COMPLETED' : elapsed > 0 ? 'RUNNING' : 'QUEUED'

  return <div className="preview-page">
    <div className="preview-topline"><div><div className="preview-eyebrow"><span className="preview-pulse" /> EXECUTION PREVIEW <span className="preview-sim-label">SIMULATION</span></div><h1>Workflow execution</h1><p>Temporal inspired history and activity waterfall for a telecom service activation.</p></div><div className="preview-breadcrumb"><span>Workflows</span><span>/</span><strong>Execution preview</strong></div></div>
    <section className="preview-card execution-card" aria-label="Execution controls">
      <div className="execution-ident"><div className="execution-icon"><Activity size={19} /></div><div className="execution-titles"><div className="execution-id">{data.workflowId}<span className="copy-dot" title="Simulation identifier">SIM</span></div><div className="execution-meta">Order <b>{data.orderId}</b><span>·</span> Activation saga <span>·</span> us-east-1</div></div></div>
      <div className="execution-state"><span className={`state-pill ${currentLabel.toLowerCase().replace(' ', '-')}`}><i />{currentLabel}</span><div><strong>{formatClock(elapsed)}</strong><small>elapsed</small></div></div>
      <div className="execution-actions"><button className="icon-action primary-action" type="button" onClick={() => { if (finished) restart(); else setPlaying(value => !value) }} aria-label={playing ? 'Pause simulation' : finished ? 'Restart simulation' : 'Resume simulation'} title={playing ? 'Pause' : finished ? 'Restart' : 'Resume'}>{playing && !finished ? <Pause size={15} /> : <Play size={15} />}</button><button className="icon-action" type="button" onClick={() => restart()} aria-label="Restart simulation" title="Restart"><RotateCcw size={15} /></button><label className="speed-control"><FastForward size={14} /><select aria-label="Playback speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select><ChevronDown size={12} /></label><label className="scenario-select"><select aria-label="Demo scenario" value={scenario} onChange={e => restart(e.target.value as Scenario)}><option value="success">SUCCESS</option><option value="transient">TRANSIENT BILLING FAILURE</option><option value="permanent">PERMANENT BILLING FAILURE</option></select><ChevronDown size={14} /></label></div>
      <div className="execution-progress"><span style={{ width: `${progress * 100}%` }} /></div>
    </section>

    <div className="preview-section-heading"><div><h2>Execution timeline</h2><p>Activity spans and workflow events in chronological order</p></div><div className="timeline-tools"><span className="timeline-elapsed"><Clock3 size={14} /> {formatClock(elapsed)}</span><button type="button" onClick={() => setZoom(value => Math.max(.75, value - .25))} aria-label="Zoom out">−</button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom(value => Math.min(1.75, value + .25))} aria-label="Zoom in">+</button><button type="button" onClick={fitTimeline} title="Fit timeline to available width" aria-label="Fit timeline to available width"><Maximize2 size={14} /></button></div></div>
    <section className="preview-card timeline-card" aria-label="Workflow timeline">
      <div className="timeline-legend"><span><i className="legend-success"/>Completed</span><span><i className="legend-warning"/>Retry / compensation</span><span><i className="legend-failure"/>Failed</span><span><i className="legend-marker"/>History event</span></div>
      <div className="timeline-scroll" ref={timelineViewport}><svg className="timeline-svg" width={timelineWidth} height="342" viewBox={`0 0 ${timelineWidth} 342`} role="img" aria-label="Chronological workflow execution waterfall">
        <defs><pattern id="backoff-pattern" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#FFF8E8"/><rect width="2" height="7" fill="#F1D9A8"/></pattern></defs>
        {Array.from({ length: 6 }, (_, i) => { const at = data.duration * i / 5; const x = xAt(at); return <g key={i}><line x1={x} x2={x} y1="49" y2="324" className="axis-grid"/><text x={x} y="31" className="axis-label" textAnchor={i === 0 ? 'start' : i === 5 ? 'end' : 'middle'}>{formatClock(at)}</text></g> })}
        <text x="18" y="80" className="lane-caption">WORKFLOW</text><text x="18" y="98" className="lane-name">Activation saga</text><rect x={left} y="65" width={Math.max(0, xAt(Math.min(elapsed, data.duration)) - left)} height="26" rx="6" fill="#3978F6" opacity=".15"/><rect x={left} y="65" width={Math.max(0, xAt(Math.min(elapsed, data.duration)) - left)} height="26" rx="6" fill="#3978F6" opacity=".85"/><text x={left + 9} y="82" className="bar-title" fill="white">{elapsed > 0 ? 'Activation execution' : 'Waiting to start'}</text>
        {laneOrder.map((lane, index) => { const y = 125 + index * 48; return <g key={lane}><text x="18" y={y - 5} className="lane-caption">ACTIVITY</text><text x="18" y={y + 13} className="lane-name">{lane}</text><line x1={left} x2={timelineWidth - 18} y1={y + 12} y2={y + 12} className="lane-track"/>{data.spans.filter(span => span.lane === lane).map(span => { const shownEnd = Math.min(elapsed, span.end); if (shownEnd <= span.start) return null; const x = xAt(span.start); const endX = xAt(shownEnd); const w = Math.max(5, endX - x); const active = selectedSpan === span.id || hovered === span.id; const completed = elapsed >= span.end; return <g key={span.id} className="span-group" tabIndex={0} role="button" aria-label={`${lane} attempt ${span.attempt}, ${span.tone}${span.compensation ? ', compensation' : ''}`} onClick={() => { setSelectedSpan(span.id); setSelectedEvent(null) }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSpan(span.id); setSelectedEvent(null) } }} onMouseEnter={() => setHovered(span.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(span.id)} onBlur={() => setHovered(null)}><rect x={x} y={y - 2} width={w} height="27" rx="6" fill={span.tone === 'warning' ? 'url(#backoff-pattern)' : toneColor[span.tone]} opacity={span.tone === 'warning' ? 1 : .13}/><rect x={x} y={y - 2} width={w} height="27" rx="6" fill={toneColor[span.tone]} opacity={span.tone === 'warning' ? .18 : .78}/>{active && <rect x={x - 2} y={y - 4} width={w + 4} height="31" rx="7" fill="none" stroke={toneColor[span.tone]} strokeWidth="2"/>}<line x1={x} x2={x} y1={y - 6} y2={y + 29} stroke={toneColor[span.tone]} strokeWidth="2"/><circle cx={x} cy={y - 7} r="3" fill={toneColor[span.tone]}/>{completed && <><line x1={endX} x2={endX} y1={y - 6} y2={y + 29} stroke={toneColor[span.tone]} strokeWidth="2"/><text x={endX + 6} y={y + 15} className="span-duration">{durationLabel(span.end - span.start)}</text></>}{w > 100 && <text x={x + 8} y={y + 15} className="span-label">{span.compensation ? 'Compensate' : span.tone === 'failure' ? 'Failed' : lane}{span.attempt > 1 || span.tone === 'failure' ? ` · attempt ${span.attempt}` : ''}</text>}{span.compensation && completed && <text x={x + 5} y={y - 8} className="relation-tag">↶ compensation</text>}{hovered === span.id && <g className="timeline-tooltip"><rect x={Math.min(x, timelineWidth - 250)} y={y - 48} width="236" height="37" rx="7"/><text x={Math.min(x, timelineWidth - 250) + 10} y={y - 32}>{lane} · attempt {span.attempt} · {span.tone}</text><text x={Math.min(x, timelineWidth - 250) + 10} y={y - 17}>{durationLabel(span.end - span.start)}{span.compensation ? ' · compensation' : ''}</text></g>}</g> })}</g> })}
        {scenario === 'transient' && elapsed > 7300 && <g><rect x={xAt(7300)} y="215" width={Math.max(0, xAt(Math.min(elapsed, 8800)) - xAt(7300))} height="27" rx="5" fill="url(#backoff-pattern)" stroke="#e9a11b" strokeDasharray="3 2"/><text x={xAt(7300) + 5} y="212" className="backoff-caption">RETRY BACKOFF</text>{elapsed >= 8800 && <text x={xAt(7300) + 5} y="232" className="backoff-duration">1.5 s</text>}</g>}
        {visibleEvents.map(event => { const x = xAt(event.at); const y = event.lane ? 125 + laneOrder.indexOf(event.lane) * 48 - 10 : 60; return <g key={event.id} className={`event-marker ${selectedEvent === event.id ? 'event-selected' : ''}`} tabIndex={0} role="button" aria-label={`${event.label} at ${formatClock(event.at)}`} onClick={() => { setSelectedEvent(event.id); setSelectedSpan(event.spanId ?? null); setHovered(null) }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEvent(event.id); setSelectedSpan(event.spanId ?? null); setHovered(null) } }}><line x1={x} x2={x} y1={y} y2="324" stroke={toneColor[eventTone(event.kind)]} strokeWidth={selectedEvent === event.id ? 2 : 1} strokeDasharray="3 4" opacity=".72"/><circle cx={x} cy={y} r={selectedEvent === event.id ? 5 : 3.5} fill={toneColor[eventTone(event.kind)]} stroke="white" strokeWidth="2"/><title>{event.label} · {formatClock(event.at)}</title></g> })}
        {progress > 0 && <g className="playhead"><line x1={xAt(elapsed)} x2={xAt(elapsed)} y1="49" y2="326"/><path d={`M ${xAt(elapsed)-5} 49 L ${xAt(elapsed)+5} 49 L ${xAt(elapsed)} 56 Z`}/></g>}
      </svg></div>
      <div className="timeline-footer"><span><i className="footer-dot"/> {data.spans.length} activity spans</span><span>{visibleEvents.length} of {data.events.length} events shown</span><span>{finished ? 'Execution finished' : playing ? 'Playback running' : 'Playback paused'}</span></div>
    </section>

    <div className="detail-grid">
      <section className="preview-card history-card"><div className="panel-heading"><div><h2>Event history</h2><p>{visibleEvents.length} events · chronological</p></div><span className="history-badge">{scenario === 'permanent' ? 'ROLLBACK PATH' : scenario === 'transient' ? 'RETRY PATH' : 'HAPPY PATH'}</span></div><div className="history-list" role="list" aria-label="Execution event history">{visibleEvents.map(event => <button className={`history-row ${selectedEvent === event.id ? 'selected' : ''}`} key={event.id} type="button" onClick={() => { setSelectedEvent(event.id); setSelectedSpan(event.spanId ?? null); setHovered(null) }} role="listitem"><span className={`history-dot ${eventTone(event.kind)}`}><span/></span><time>{formatClock(event.at)}</time><span className="history-copy"><strong>{event.label}{event.attempt && event.kind === 'scheduled' ? <em>Attempt {event.attempt}</em> : null}</strong><small>{event.detail}</small></span><span className="history-chevron">›</span></button>)}</div></section>
      <section className="preview-card inspector-card"><div className="panel-heading"><div><h2>Activity inspector</h2><p>{activeSpan ? 'Selected timeline activity' : 'Select a span or event to inspect'}</p></div><span className="inspector-icon"><Zap size={15}/></span></div>{activeSpan ? <div className="inspector-content"><div className="inspector-title-row"><div className="inspector-activity-icon"><Activity size={17}/></div><div><h3>{activeSpan.compensation ? `${activeSpan.lane} compensation` : `${activeSpan.lane} activity`}</h3><span>{activeSpan.id}</span></div></div><div className="inspector-status-row"><span className={`inspector-status ${activeSpan.tone}`}><i/>{elapsed < activeSpan.start ? 'SCHEDULED' : elapsed < activeSpan.end ? 'RUNNING' : activeSpan.tone === 'failure' ? 'FAILED' : 'COMPLETED'}</span><span>Attempt {activeSpan.attempt}</span></div><div className="inspector-details"><div><small>START TIME</small><strong>{formatClock(activeSpan.start)}</strong></div><div><small>DURATION</small><strong>{elapsed < activeSpan.start ? '—' : elapsed >= activeSpan.end ? durationLabel(activeSpan.end - activeSpan.start) : durationLabel(Math.max(0, elapsed - activeSpan.start))}</strong></div></div>{activeSpan.error ? <div className="inspector-callout failure"><CircleAlert size={15}/><div><small>ERROR</small><p>{activeSpan.error}</p></div></div> : null}{activeSpan.compensation ? <div className="inspector-callout warning"><RotateCcw size={15}/><div><small>COMPENSATION FOR</small><p>{activeSpan.relation} · reverses previously completed {activeSpan.lane.toLowerCase()} work</p></div></div> : activeSpan.relation ? <div className="inspector-callout neutral"><Check size={15}/><div><small>COMPENSATION TARGET</small><p>Reversed by {activeSpan.relation} if a later activity fails.</p></div></div> : null}<div className="inspector-range"><span>Activity window</span><span>{formatClock(activeSpan.start)} — {formatClock(activeSpan.end)}</span></div></div> : <div className="inspector-empty"><div><Activity size={20}/></div><strong>No activity selected</strong><span>Select an activity span on the timeline or an event in the history.</span></div>}</section>
    </div>
    <footer className="preview-footnote"><span><span className="footnote-dot"/> Mock execution data · Simulation only</span><span>Events are illustrative and do not represent a live Temporal workflow.</span></footer>
  </div>
}
