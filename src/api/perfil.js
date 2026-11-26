import { solicitarAutenticada } from '../auth/autenticacion.js'

export function obtenerPerfil(options = {}) {
  return solicitarAutenticada('/api/perfil', options)
}

export function actualizarPerfil(datos, options = {}) {
  return solicitarAutenticada('/api/perfil', {
    ...options,
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}

export function actualizarContrasena(datos, options = {}) {
  return solicitarAutenticada('/api/perfil/contrasena', {
    ...options,
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}
