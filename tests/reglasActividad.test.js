import { test } from 'node:test'
import assert from 'node:assert/strict'
import { esTipoActividad, validarActividad } from '../src/components/cultivos/reglasActividad.js'

const cultivo = { fechaSiembra: '2026-10-01', estado: 'Activo' }
const base = {
  idTipoActividad: '1',
  nombreTipo: 'Avance',
  fecha: '2026-11-10',
  descripcion: 'Se observó crecimiento.',
  duracionMin: '',
  metodoRiego: '',
  producto: '',
  cantidad: '',
  unidad: '',
}

test('acepta actividad general con fecha entre siembra y hoy', () => {
  assert.deepEqual(validarActividad(base, cultivo, '2026-11-13'), {})
})

test('requiere tipo, fecha y descripción', () => {
  const errores = validarActividad({ ...base, idTipoActividad: '', fecha: '', descripcion: ' ' }, cultivo, '2026-11-13')
  assert.ok(errores.idTipoActividad)
  assert.ok(errores.fecha)
  assert.ok(errores.descripcion)
})

test('rechaza fechas anteriores a siembra y posteriores a hoy', () => {
  assert.match(validarActividad({ ...base, fecha: '2026-09-30' }, cultivo, '2026-11-13').fecha, /anterior/)
  assert.match(validarActividad({ ...base, fecha: '2026-11-14' }, cultivo, '2026-11-13').fecha, /posterior/)
})

test('riego requiere duración entera positiva y método', () => {
  const errores = validarActividad({ ...base, nombreTipo: 'Riego', duracionMin: '1.5' }, cultivo, '2026-11-13')
  assert.ok(errores.duracionMin)
  assert.ok(errores.metodoRiego)
  assert.deepEqual(validarActividad({ ...base, nombreTipo: 'Riego', duracionMin: '1', metodoRiego: 'Goteo' }, cultivo, '2026-11-13'), {})
})

test('fertilización requiere producto, cantidad positiva y unidad', () => {
  const errores = validarActividad({ ...base, nombreTipo: 'Fertilización', cantidad: '0' }, cultivo, '2026-11-13')
  assert.ok(errores.producto)
  assert.ok(errores.cantidad)
  assert.ok(errores.unidad)
  assert.deepEqual(validarActividad({ ...base, nombreTipo: 'Fertilización', producto: 'Composta', cantidad: '2.5', unidad: 'kg' }, cultivo, '2026-11-13'), {})
})

test('normaliza acentos en el tipo de actividad', () => {
  assert.equal(esTipoActividad('Fertilización', 'fertilizacion'), true)
})
