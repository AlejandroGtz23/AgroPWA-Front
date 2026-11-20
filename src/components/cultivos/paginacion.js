export const TAMANO_PAGINA_CULTIVOS = 20

export function calcularTotalPaginas(total, tamanoPagina) {
  const totalRegistros = Number(total)
  const tamano = Number(tamanoPagina)
  if (!Number.isFinite(totalRegistros) || totalRegistros <= 0 || !Number.isFinite(tamano) || tamano <= 0) return 1
  return Math.max(1, Math.ceil(totalRegistros / tamano))
}
