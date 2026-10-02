import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CropsPage from './pages/CropsPage'
import CropFormPage from './pages/CropFormPage'
import CropDetailPage from './pages/CropDetailPage'
import ActivityFormPage from './pages/ActivityFormPage'
import PhotosPage from './pages/PhotosPage'
import SyncPage from './pages/SyncPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="cultivos" element={<CropsPage />} />
        <Route path="cultivos/nuevo" element={<CropFormPage />} />
        <Route path="cultivos/:cropId" element={<CropDetailPage />} />
        <Route path="cultivos/:cropId/actividad" element={<ActivityFormPage />} />
        <Route path="actividades/:activityId/fotos" element={<PhotosPage />} />
        <Route path="sincronizacion" element={<SyncPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>

      <Route path="/inicio" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
