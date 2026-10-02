import { Outlet } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import BottomNav from '../components/navigation/BottomNav'

export default function AppLayout() {
  return (
    <>
      <Sidebar />
      <main className="app-content"><Outlet /></main>
      <BottomNav />
    </>
  )
}
