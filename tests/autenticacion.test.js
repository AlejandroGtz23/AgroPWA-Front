import { test, beforeEach } from 'node:test'
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

const { guardarSesion, obtenerSesion, limpiarSesion, esRecordada } = await import('../src/auth/sesion.js')
const { solicitarAutenticada, renovar } = await import('../src/auth/autenticacion.js')
const sesion = (suffix, expired = false) => ({ accessToken: `access-${suffix}`, refreshToken: `refresh-${suffix}`, expiraUtc: new Date(Date.now() + (expired ? -60000 : 600000)).toISOString(), usuario: { id: 1 } })
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

beforeEach(() => { sessionStorage.clear(); localStorage.clear() })

test('persistencia distingue sesión temporal y recordada', () => {
  guardarSesion(sesion('a'))
  assert.equal(esRecordada(), false)
  guardarSesion(sesion('b'), true)
  assert.equal(esRecordada(), true)
  assert.equal(obtenerSesion().accessToken, 'access-b')
  limpiarSesion()
  assert.equal(obtenerSesion(), null)
})

test('envía Bearer, renueva y reutiliza la renovación para peticiones simultáneas', async () => {
  guardarSesion(sesion('old', true), true)
  let renewals = 0
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/api/auth/renovar')) {
      renewals++
      assert.deepEqual(JSON.parse(options.body), { refreshToken: 'refresh-old' })
      return json(sesion('new'))
    }
    assert.equal(options.headers.Authorization, 'Bearer access-new')
    return json({ id: 1 })
  }
  const result = await Promise.all([solicitarAutenticada('/api/auth/yo'), solicitarAutenticada('/api/auth/yo')])
  assert.equal(renewals, 1)
  assert.deepEqual(result, [{ id: 1 }, { id: 1 }])
  assert.equal(obtenerSesion().refreshToken, 'refresh-new')
})

test('401 al renovar elimina la sesión; un fallo de red la conserva', async () => {
  guardarSesion(sesion('a', true))
  globalThis.fetch = async () => { throw new Error('sin red') }
  await assert.rejects(renovar(), (error) => error.status === 0)
  assert.ok(obtenerSesion())
  globalThis.fetch = async () => json({ title: 'Sesión vencida' }, 401)
  await assert.rejects(renovar(), (error) => error.status === 401)
  assert.equal(obtenerSesion(), null)
})

test('un 401 protegido renueva una vez y reintenta con el token nuevo', async () => {
  guardarSesion(sesion('old'))
  let protectedCalls = 0
  let renewals = 0
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/api/auth/renovar')) { renewals++; return json(sesion('new')) }
    protectedCalls++
    if (protectedCalls === 1) return json({ title: 'No autorizado' }, 401)
    assert.equal(options.headers.Authorization, 'Bearer access-new')
    return json({ id: 1 })
  }
  assert.deepEqual(await solicitarAutenticada('/api/auth/yo'), { id: 1 })
  assert.equal(renewals, 1)
  assert.equal(protectedCalls, 2)
})

test('no renueva una sesión recordada sin bloqueo entre pestañas', async () => {
  guardarSesion(sesion('a', true), true)
  const locks = navigator.locks
  navigator.locks = undefined
  try {
    await assert.rejects(renovar(), (error) => error.status === 0)
    assert.ok(obtenerSesion())
  } finally { navigator.locks = locks }
})
