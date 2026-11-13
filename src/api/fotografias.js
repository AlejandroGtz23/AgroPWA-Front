import { solicitarAutenticada } from '../auth/autenticacion.js'

export function subirFotografia(idCultivo, archivo, { idAvance, esPortada = false, idLocal, ...options } = {}) {
  const body = new FormData()
  body.append('archivo', archivo)
  if (idAvance !== undefined && idAvance !== null) body.append('idAvance', String(idAvance))
  body.append('esPortada', String(esPortada))
  if (idLocal) body.append('idLocal', idLocal)

  return solicitarAutenticada(`/api/cultivos/${encodeURIComponent(idCultivo)}/fotografias`, {
    ...options,
    method: 'POST',
    body,
  })
}

export function eliminarFotografia(id, options = {}) {
  return solicitarAutenticada(`/api/fotografias/${encodeURIComponent(id)}`, {
    ...options,
    method: 'DELETE',
  })
}
