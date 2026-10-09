import { Outlet } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import BottomNav from '../components/navigation/BottomNav'
import ConnectionStatus from '../components/ui/ConnectionStatus'

export default function AppLayout() {
  return (
    <>
      <Sidebar />
      <main className="app-content">
        <ConnectionStatus />
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}
