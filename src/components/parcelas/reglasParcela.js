export function validarParcela(values) {
  const errors = {}
  const nombre = values.nombre.trim()
  const superficie = values.superficieHa.trim()
  if (!nombre) errors.nombre = 'El nombre de la parcela es obligatorio.'
  else if (nombre.length > 80) errors.nombre = 'El nombre no puede tener más de 80 caracteres.'
  if (!/^(?:\d+)(?:\.\d{1,2})?$/.test(superficie) || Number(superficie) <= 0 || Number(superficie) > 999999.99) errors.superficieHa = 'Ingresa un número válido.'
  if (values.ubicacionReferencia.trim().length > 150) errors.ubicacionReferencia = 'La ubicación no puede tener más de 150 caracteres.'
  return errors
}
