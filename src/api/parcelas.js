import { solicitarAutenticada } from '../auth/autenticacion.js'

export function listarParcelas(options = {}) {
  return solicitarAutenticada('/api/parcelas', options)
}

export function registrarParcela(datos, options = {}) {
  return solicitarAutenticada('/api/parcelas', { ...options, method: 'POST', body: JSON.stringify(datos) })
}

export function editarParcela(id, datos, options = {}) {
  return solicitarAutenticada(`/api/parcelas/${encodeURIComponent(id)}`, { ...options, method: 'PUT', body: JSON.stringify(datos) })
}
