import { eliminarCultivo } from '../../api/cultivos.js'

const esperaMs = 5000
const eliminacionesPendientes = new Map()
const suscriptores = new Set()
const suscriptoresResultado = new Set()

function publicar() {
  const pendientes = [...eliminacionesPendientes.values()].map(({ timer, ...item }) => item)
  suscriptores.forEach((suscriptor) => suscriptor(pendientes))
}

export function observarEliminaciones(suscriptor) {
  suscriptores.add(suscriptor)
  suscriptor([...eliminacionesPendientes.values()].map(({ timer, ...item }) => item))
  return () => suscriptores.delete(suscriptor)
}

export function observarResultadoEliminacion(suscriptor) {
  suscriptoresResultado.add(suscriptor)
  return () => suscriptoresResultado.delete(suscriptor)
}

export function programarEliminacionCultivo(cultivo) {
  const id = String(cultivo.id)
  if (eliminacionesPendientes.has(id)) return

  const pendiente = { id, nombre: cultivo.nombre, estado: 'deshacible', venceEn: Date.now() + esperaMs }
  pendiente.timer = window.setTimeout(async () => {
    pendiente.estado = 'eliminando'
    publicar()
    try {
      await eliminarCultivo(id)
      suscriptoresResultado.forEach((suscriptor) => suscriptor({ id, ok: true }))
    } catch (error) {
      suscriptoresResultado.forEach((suscriptor) => suscriptor({ id, ok: false, error }))
    } finally {
      eliminacionesPendientes.delete(id)
      publicar()
    }
  }, esperaMs)

  eliminacionesPendientes.set(id, pendiente)
  publicar()
}

export function deshacerEliminacionCultivo(id) {
  const pendiente = eliminacionesPendientes.get(String(id))
  if (!pendiente || pendiente.estado !== 'deshacible') return false
  window.clearTimeout(pendiente.timer)
  eliminacionesPendientes.delete(String(id))
  publicar()
  return true
}

export const TIEMPO_DESHACER_ELIMINACION_MS = esperaMs
