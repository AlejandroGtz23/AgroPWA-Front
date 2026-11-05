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
const { solicitarAutenticada, renovar, verificarSesionGuardada } = await import('../src/auth/autenticacion.js')
const { cerrarSesion } = await import('../src/auth/cerrarSesion.js')
const { contarRegistrosEnCola } = await import('../src/storage/agroDb.js')
const { validarParcela } = await import('../src/components/parcelas/reglasParcela.js')
const { listarParcelas, registrarParcela, editarParcela } = await import('../src/api/parcelas.js')
const { obtenerResumenDashboard } = await import('../src/api/dashboard.js')
const { listarTiposCultivo, listarCultivos, registrarCultivo, obtenerDetalleCultivo } = await import('../src/api/cultivos.js')
const { validarCultivo, diasDesdeSiembra } = await import('../src/components/cultivos/reglasCultivo.js')
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

test('sin sesión guardada permite acceso público sin llamar a la API', async () => {
  globalThis.fetch = async () => { throw new Error('No debe llamar a la API') }
  assert.equal(await verificarSesionGuardada(), 'sin-sesion')
})

test('restaura la sesión recordada si la API valida el token', async () => {
  guardarSesion(sesion('recordada'), true)
  globalThis.fetch = async (url, options) => {
    assert.ok(url.endsWith('/api/auth/yo'))
    assert.equal(options.headers.Authorization, 'Bearer access-recordada')
    return json({ id: 1 })
  }
  assert.equal(await verificarSesionGuardada(), 'valida')
})

test('restaurar renueva el token vencido antes de validar la sesión', async () => {
  guardarSesion(sesion('old', true), true)
  globalThis.fetch = async (url) => url.endsWith('/api/auth/renovar') ? json(sesion('new')) : json({ id: 1 })
  assert.equal(await verificarSesionGuardada(), 'valida')
  assert.equal(obtenerSesion().refreshToken, 'refresh-new')
})

test('restaurar conserva la sesión ante un error de red', async () => {
  guardarSesion(sesion('offline'), true)
  globalThis.fetch = async () => { throw new Error('sin red') }
  assert.equal(await verificarSesionGuardada(), 'no-disponible')
  assert.ok(obtenerSesion())
})

test('restaurar no redirige si la renovación fue rechazada', async () => {
  guardarSesion(sesion('vencida', true), true)
  globalThis.fetch = async () => json({ title: 'Sesión vencida' }, 401)
  assert.equal(await verificarSesionGuardada(), 'sin-sesion')
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

test('logout envía Bearer y elimina la sesión local tras respuesta 204', async () => {
  guardarSesion(sesion('logout'), true)
  globalThis.fetch = async (url, options) => {
    assert.ok(url.endsWith('/api/auth/logout'))
    assert.equal(options.method, 'POST')
    assert.equal(options.headers.Authorization, 'Bearer access-logout')
    return new Response(null, { status: 204 })
  }
  assert.deepEqual(await cerrarSesion(), { confirmado: true })
  assert.equal(obtenerSesion(), null)
})

test('logout conserva la advertencia de fallo remoto y elimina la sesión local', async () => {
  guardarSesion(sesion('logout'))
  globalThis.fetch = async () => { throw new Error('sin red') }
  assert.deepEqual(await cerrarSesion(), { confirmado: false })
  assert.equal(obtenerSesion(), null)
})

test('la comprobación de cola cuenta registros sin borrarlos', async () => {
  let closed = false
  globalThis.indexedDB = { open: () => {
    const open = {}
    const db = { close: () => { closed = true }, transaction: (name, mode) => {
      assert.equal(name, 'colaSincronizacion')
      assert.equal(mode, 'readonly')
      const transaction = { objectStore: () => ({ count: () => {
        const request = { result: 3 }
        queueMicrotask(() => { request.onsuccess(); transaction.oncomplete() })
        return request
      } }) }
      return transaction
    } }
    queueMicrotask(() => { open.result = db; open.onsuccess() })
    return open
  } }
  assert.equal(await contarRegistrosEnCola(), 3)
  assert.equal(closed, true)
})

test('validaciones de parcela coinciden con las reglas de superficie y nombre', () => {
  const valid = { nombre: 'Parcela Norte', superficieHa: '1.25', ubicacionReferencia: '' }
  assert.deepEqual(validarParcela(valid), {})
  for (const valor of ['', '0', '-1', 'abc', '1.234', '1000000']) assert.ok(validarParcela({ ...valid, superficieHa: valor }).superficieHa)
  assert.ok(validarParcela({ ...valid, nombre: '   ' }).nombre)
  assert.ok(validarParcela({ ...valid, ubicacionReferencia: 'x'.repeat(151) }).ubicacionReferencia)
})

test('clientes de parcelas y dashboard usan rutas y autorización correctas', async () => {
  guardarSesion(sesion('api'))
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return json(url.endsWith('/api/parcelas') && !options.method ? [] : { id: 4 })
  }
  const datos = { nombre: 'Parcela', superficieHa: 1.5, ubicacionReferencia: null }
  await listarParcelas()
  await registrarParcela({ ...datos, idLocal: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  await editarParcela(4, datos)
  await obtenerResumenDashboard()
  assert.equal(calls.length, 4)
  assert.ok(calls.every((call) => call.options.headers.Authorization === 'Bearer access-api'))
  assert.ok(calls[0].url.endsWith('/api/parcelas'))
  assert.equal(calls[1].options.method, 'POST')
  assert.equal(JSON.parse(calls[1].options.body).idLocal, '3fa85f64-5717-4562-b3fc-2c963f66afa6')
  assert.ok(calls[2].url.endsWith('/api/parcelas/4'))
  assert.equal(calls[2].options.method, 'PUT')
  assert.ok(calls[3].url.endsWith('/api/dashboard/resumen'))
})

test('validaciones de cultivo aplican campos requeridos, fechas y límites del contrato', () => {
  const valid = { nombre: 'Maíz criollo', idTipoCultivo: '2', fechaSiembra: '2026-06-12', idParcela: '4', variedad: 'Criollo', observaciones: 'Semilla propia' }
  assert.deepEqual(validarCultivo(valid, '2026-11-05'), {})
  assert.equal(validarCultivo({ ...valid, fechaSiembra: '2026-11-06' }, '2026-11-05').fechaSiembra, 'La fecha de siembra no puede ser posterior a hoy.')
  assert.ok(validarCultivo({ ...valid, nombre: ' ' }).nombre)
  assert.ok(validarCultivo({ ...valid, idTipoCultivo: '' }).idTipoCultivo)
  assert.ok(validarCultivo({ ...valid, idParcela: '' }).idParcela)
  assert.ok(validarCultivo({ ...valid, variedad: 'v'.repeat(81) }).variedad)
  assert.ok(validarCultivo({ ...valid, observaciones: 'x'.repeat(301) }).observaciones)
  assert.equal(diasDesdeSiembra('2026-11-01', new Date('2026-11-05T12:00:00')), 4)
})

test('clientes de cultivos usan catálogo, filtros paginados, autorización y payload acordado', async () => {
  guardarSesion(sesion('cultivos'))
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), options })
    if (url.includes('/api/catalogos/tipos-cultivo')) return json([{ id: 2, nombre: 'Maíz' }])
    if (url.includes('/api/cultivos?')) return json({ elementos: [{ id: 8, nombre: 'Maíz' }], total: 1 })
    if (options.method === 'POST') return json({ id: 8, nombre: 'Maíz', tipo: 'Maíz', parcela: 'Norte' }, 201)
    return json({ cultivo: { id: 8 }, avances: [], fotografias: [], totales: { avances: 0, fotografias: 0 } })
  }
  await listarTiposCultivo()
  await listarCultivos({ buscar: ' Maíz ', estado: 'activo', idTipoCultivo: '2', pagina: 2, tamano: 20 })
  const payload = { idLocal: '3fa85f64-5717-4562-b3fc-2c963f66afa6', nombre: 'Maíz', idTipoCultivo: 2, fechaSiembra: '2026-06-12', idParcela: 4 }
  await registrarCultivo(payload)
  await obtenerDetalleCultivo(8)
  assert.equal(calls.length, 4)
  assert.ok(calls.every(({ options }) => options.headers.Authorization === 'Bearer access-cultivos'))
  assert.equal(calls[0].url.pathname, '/api/catalogos/tipos-cultivo')
  assert.equal(calls[1].url.searchParams.get('buscar'), 'Maíz')
  assert.equal(calls[1].url.searchParams.get('estado'), 'activo')
  assert.equal(calls[1].url.searchParams.get('idTipoCultivo'), '2')
  assert.equal(calls[1].url.searchParams.get('pagina'), '2')
  assert.equal(calls[2].url.pathname, '/api/cultivos')
  assert.deepEqual(JSON.parse(calls[2].options.body), payload)
  assert.equal(calls[3].url.pathname, '/api/cultivos/8')
})
