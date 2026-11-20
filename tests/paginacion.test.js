import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularTotalPaginas, TAMANO_PAGINA_CULTIVOS } from '../src/components/cultivos/paginacion.js'

test('calcula páginas exactas y parciales según el total', () => {
  assert.ok(TAMANO_PAGINA_CULTIVOS <= 50)
  assert.equal(calcularTotalPaginas(0, 20), 1)
  assert.equal(calcularTotalPaginas(20, 20), 1)
  assert.equal(calcularTotalPaginas(21, 20), 2)
  assert.equal(calcularTotalPaginas(50, 20), 3)
})

test('evita resultados inválidos si la respuesta o el tamaño no son utilizables', () => {
  assert.equal(calcularTotalPaginas('no disponible', 20), 1)
  assert.equal(calcularTotalPaginas(40, 0), 1)
  assert.equal(calcularTotalPaginas(-2, 20), 1)
})
