import { solicitarAutenticada } from '../auth/autenticacion.js'

export function obtenerResumenDashboard(options = {}) {
  return solicitarAutenticada('/api/dashboard/resumen', options)
}
