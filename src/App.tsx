import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { OpsProvider } from './context/OpsContext'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AuditLogsPage } from './pages/AuditLogsPage'
import { DashboardPage } from './pages/DashboardPage'
import { FailuresPage } from './pages/FailuresPage'
import { OrdersPage } from './pages/OrdersPage'
import { ServiceHealthPage } from './pages/ServiceHealthPage'
import { WorkflowsPage } from './pages/WorkflowsPage'
import {
  AlertsPage,
  CatalogPage,
  CommandCenterPage,
  DigitalTwinPage,
  OrderDetailsPage,
  SlaPage,
  WarRoomPage,
} from './pages/FeaturePages'

export default function App() {
  return (
    <OpsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="health" element={<ServiceHealthPage />} />
            <Route path="failures" element={<FailuresPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="audit" element={<AuditLogsPage />} />
            <Route path="sla" element={<SlaPage />} />
            <Route path="war-room" element={<WarRoomPage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="command-center" element={<CommandCenterPage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </OpsProvider>
  )
}
