export function validarCultivo(values, hoy = new Date().toISOString().slice(0, 10)) {
  const errors = {}
  const nombre = values.nombre.trim()
  const variedad = values.variedad.trim()
  const observaciones = values.observaciones.trim()

  if (!nombre) errors.nombre = 'El nombre del cultivo es obligatorio.'
  else if (nombre.length > 80) errors.nombre = 'El nombre no puede tener más de 80 caracteres.'
  if (!values.idTipoCultivo) errors.idTipoCultivo = 'El tipo de cultivo es obligatorio.'
  if (!values.fechaSiembra) errors.fechaSiembra = 'La fecha de siembra es obligatoria.'
  else if (values.fechaSiembra > hoy) errors.fechaSiembra = 'La fecha de siembra no puede ser posterior a hoy.'
  if (!values.idParcela) errors.idParcela = 'La parcela es obligatoria.'
  if (variedad.length > 80) errors.variedad = 'La variedad no puede tener más de 80 caracteres.'
  if (observaciones.length > 300) errors.observaciones = 'Las observaciones admiten hasta 300 caracteres.'
  return errors
}

export function fechaActualMexico() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date())
  const valor = Object.fromEntries(partes.map(({ type, value }) => [type, value]))
  return `${valor.year}-${valor.month}-${valor.day}`
}

export function diasDesdeSiembra(fechaSiembra, ahora = new Date()) {
  const [year, month, day] = fechaSiembra.split('-').map(Number)
  const inicio = Date.UTC(year, month - 1, day)
  const hoy = Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  return Math.max(0, Math.floor((hoy - inicio) / 86_400_000))
}
