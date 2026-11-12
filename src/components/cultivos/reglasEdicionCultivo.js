import { fechaActualMexico } from './reglasCultivo.js'

export function validarEdicionCultivo(values, hoy = fechaActualMexico()) {
  const errores = {}
  const nombre = values.nombre.trim()
  const variedad = values.variedad.trim()
  const observaciones = values.observaciones.trim()

  if (!nombre) errores.nombre = 'El nombre del cultivo es obligatorio.'
  else if (nombre.length > 80) errores.nombre = 'El nombre no puede tener más de 80 caracteres.'
  if (!values.idTipoCultivo) errores.idTipoCultivo = 'El tipo de cultivo es obligatorio.'
  if (!values.fechaSiembra) errores.fechaSiembra = 'La fecha de siembra es obligatoria.'
  else if (values.fechaSiembra > hoy) errores.fechaSiembra = 'La fecha de siembra no puede ser posterior a hoy.'
  if (!values.idParcela) errores.idParcela = 'La parcela es obligatoria.'
  if (!['activo', 'finalizado', 'perdido'].includes(values.estado)) errores.estado = 'Selecciona un estado válido.'
  if (variedad.length > 80) errores.variedad = 'La variedad no puede tener más de 80 caracteres.'
  if (observaciones.length > 300) errores.observaciones = 'Las observaciones admiten hasta 300 caracteres.'

  if (values.estado === 'finalizado') {
    if (!values.fechaCosecha) errores.fechaCosecha = 'Captura la fecha de cosecha.'
    else if (values.fechaCosecha < values.fechaSiembra) errores.fechaCosecha = 'La fecha de cosecha no puede ser anterior a la siembra.'
    else if (values.fechaCosecha > hoy) errores.fechaCosecha = 'La fecha de cosecha no puede ser posterior a hoy.'
  }

  return errores
}
