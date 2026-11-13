import { test } from 'node:test'
import assert from 'node:assert/strict'

class Storage {
  values = new Map()
  getItem(key) { return this.values.get(key) ?? null }
  setItem(key, value) { this.values.set(key, String(value)) }
  removeItem(key) { this.values.delete(key) }
  clear() { this.values.clear() }
}

globalThis.window = new EventTarget()
globalThis.sessionStorage = new Storage()
globalThis.localStorage = new Storage()
Object.defineProperty(globalThis, 'navigator', { value: { locks: { request: async (_name, fn) => fn() } }, configurable: true })

const { guardarSesion } = await import('../src/auth/sesion.js')
const { listarTiposActividad, registrarAvance } = await import('../src/api/actividades.js')
const { subirFotografia, eliminarFotografia } = await import('../src/api/fotografias.js')
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

test('clientes de actividad y fotografías respetan rutas, auth y multipart', async () => {
  guardarSesion({
    accessToken: 'access-sprint8',
    refreshToken: 'refresh-sprint8',
    expiraUtc: new Date(Date.now() + 600000).toISOString(),
    usuario: { id: 1 },
  })
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), options })
    if (options.method === 'DELETE') return new Response(null, { status: 204 })
    return json({ id: 13, nombre: 'Riego' }, options.method === 'POST' ? 201 : 200)
  }

  await listarTiposActividad()
  const avance = { idLocal: 'local-1', idTipoActividad: 1, fechaActividad: '2026-11-13T18:00:00Z', descripcion: 'Riego', duracionMin: 30, metodoRiego: 'Goteo', producto: null, cantidad: null, unidad: null }
  await registrarAvance(8, avance)
  const archivo = new Blob(['imagen'], { type: 'image/jpeg' })
  await subirFotografia(8, archivo, { idAvance: 13, idLocal: 'foto-local-1' })
  await eliminarFotografia(13)

  assert.equal(calls[0].url.pathname, '/api/catalogos/tipos-actividad')
  assert.equal(calls[1].url.pathname, '/api/cultivos/8/avances')
  assert.deepEqual(JSON.parse(calls[1].options.body), avance)
  assert.equal(calls[2].url.pathname, '/api/cultivos/8/fotografias')
  assert.ok(calls[2].options.body instanceof FormData)
  assert.equal(calls[2].options.body.get('idAvance'), '13')
  assert.equal(calls[2].options.body.get('idLocal'), 'foto-local-1')
  assert.equal(Object.keys(calls[2].options.headers).some((name) => name.toLowerCase() === 'content-type'), false)
  assert.equal(calls[3].url.pathname, '/api/fotografias/13')
  assert.ok(calls.every(({ options }) => options.headers.Authorization === 'Bearer access-sprint8'))
})
