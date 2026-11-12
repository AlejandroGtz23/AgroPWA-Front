export function obtenerEstadoEsperaLogin(esperaMs) {
  if (esperaMs >= 5000) return {
    titulo: 'La respuesta está tardando más de lo habitual.',
    descripcion: 'Puede influir la conexión o el tiempo de respuesta del servidor. Seguimos esperando; no vuelvas a enviar el formulario.',
  }
  return {
    titulo: 'Verificando tus credenciales con Agro…',
    descripcion: 'La aplicación espera una respuesta segura del servidor. No cierres esta pantalla.',
  }
}
