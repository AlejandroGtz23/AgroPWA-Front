import { solicitarAutenticada } from '../auth/autenticacion.js'

export function listarTiposActividad(options = {}) {
  return solicitarAutenticada('/api/catalogos/tipos-actividad', options)
}

export function registrarAvance(idCultivo, datos, options = {}) {
  return solicitarAutenticada(`/api/cultivos/${encodeURIComponent(idCultivo)}/avances`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(datos),
  })
}
