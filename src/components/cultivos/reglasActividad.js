export function validarActividad(form, cultivo, hoy = new Date().toISOString().slice(0, 10)) {
  const errores = {}
  const fechaSiembra = String(cultivo?.fechaSiembra || '').slice(0, 10)

  if (!form.idTipoActividad) errores.idTipoActividad = 'Selecciona el tipo de actividad.'
  if (!form.fecha) errores.fecha = 'La fecha de la actividad es obligatoria.'
  else if (fechaSiembra && form.fecha < fechaSiembra) errores.fecha = 'La fecha no puede ser anterior a la siembra.'
  else if (form.fecha > hoy) errores.fecha = 'La fecha no puede ser posterior a hoy.'
  if (!form.descripcion.trim()) errores.descripcion = 'La descripción es obligatoria.'

  const tipo = String(form.nombreTipo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (tipo === 'riego') {
    const duracion = Number(form.duracionMin)
    if (!Number.isInteger(duracion) || duracion <= 0) errores.duracionMin = 'La duración debe ser un número entero mayor que 0.'
    if (!form.metodoRiego.trim()) errores.metodoRiego = 'El método de riego es obligatorio.'
  }
  if (tipo === 'fertilizacion') {
    if (!form.producto.trim()) errores.producto = 'El producto es obligatorio.'
    if (!Number.isFinite(Number(form.cantidad)) || Number(form.cantidad) <= 0) errores.cantidad = 'La cantidad debe ser mayor que 0.'
    if (!form.unidad.trim()) errores.unidad = 'La unidad es obligatoria.'
  }
  return errores
}

export function esTipoActividad(nombre, esperado) {
  return String(nombre || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === esperado
}
