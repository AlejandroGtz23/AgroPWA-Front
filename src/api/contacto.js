import { solicitarApi } from './cliente.js'

export function enviarContacto(datos, options = {}) {
  return solicitarApi('/api/contacto', { ...options, method: 'POST', body: JSON.stringify(datos) })
}
