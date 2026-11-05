import { solicitarAutenticada } from '../auth/autenticacion.js'

export function listarTiposCultivo(options = {}) {
  return solicitarAutenticada('/api/catalogos/tipos-cultivo', options)
}

export function listarCultivos({ buscar, estado, idTipoCultivo, pagina = 1, tamano = 20, ...options } = {}) {
  const query = new URLSearchParams({ pagina: String(pagina), tamano: String(tamano) })
  if (buscar?.trim()) query.set('buscar', buscar.trim())
  if (estado) query.set('estado', estado)
  if (idTipoCultivo) query.set('idTipoCultivo', String(idTipoCultivo))
  return solicitarAutenticada(`/api/cultivos?${query}`, options)
}

export function registrarCultivo(datos, options = {}) {
  return solicitarAutenticada('/api/cultivos', { ...options, method: 'POST', body: JSON.stringify(datos) })
}

export function obtenerDetalleCultivo(id, options = {}) {
  return solicitarAutenticada(`/api/cultivos/${encodeURIComponent(id)}`, options)
}
