import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BaseCard from '../components/ui/BaseCard'
import BaseButton from '../components/ui/BaseButton'
import BaseField from '../components/ui/BaseField'
import CerrarSesion from '../components/navigation/CerrarSesion'
import MisParcelas from '../components/parcelas/MisParcelas'
import AlertMessage from '../components/ui/AlertMessage'
import InstallAppButton from '../components/pwa/InstallAppButton'
import { actualizarContrasena, actualizarPerfil, obtenerPerfil } from '../api/perfil'

const perfilVacio = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo: '',
  telefono: '',
  comunidadMunicipio: '',
  rol: '',
}

function mensajeError(error, accion) {
  if (error.status === 0) return `No logramos conectar con Agro para ${accion}. Revisa tu conexión e inténtalo de nuevo.`
  if (error.status >= 500) return `Agro no pudo ${accion} en este momento. Tus datos siguen en el formulario; vuelve a intentarlo en unos minutos.`
  return error.message || `No se pudo ${accion}. Revisa los datos e inténtalo de nuevo.`
}

export default function ProfilePage() {
  const [perfil, setPerfil] = useState(perfilVacio)
  const [formulario, setFormulario] = useState(perfilVacio)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [cambiandoContrasena, setCambiandoContrasena] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')
  const [errorPerfil, setErrorPerfil] = useState('')
  const [mensajePerfil, setMensajePerfil] = useState('')
  const [errorContrasena, setErrorContrasena] = useState('')
  const [mensajeContrasena, setMensajeContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [contrasenas, setContrasenas] = useState({ actual: '', nueva: '', confirmar: '' })
  const nombreCompleto = useMemo(
    () => [perfil.nombre, perfil.apellidoPaterno, perfil.apellidoMaterno].filter(Boolean).join(' '),
    [perfil],
  )

  async function cargarPerfil() {
    setCargando(true)
    setErrorCarga('')
    try {
      const datos = await obtenerPerfil()
      const siguiente = { ...perfilVacio, ...datos }
      setPerfil(siguiente)
      setFormulario(siguiente)
    } catch (error) {
      setErrorCarga(mensajeError(error, 'cargar tu perfil'))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let activo = true
    obtenerPerfil().then((datos) => {
      if (!activo) return
      const siguiente = { ...perfilVacio, ...datos }
      setPerfil(siguiente)
      setFormulario(siguiente)
      setErrorCarga('')
    }).catch((error) => {
      if (activo) setErrorCarga(mensajeError(error, 'cargar tu perfil'))
    }).finally(() => {
      if (activo) setCargando(false)
    })
    return () => { activo = false }
  }, [])

  function cambiarCampo(event) {
    const { name, value } = event.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
    setErrores((actual) => ({ ...actual, [name]: '' }))
    setErrorPerfil('')
    setMensajePerfil('')
  }

  async function guardarPerfil(event) {
    event.preventDefault()
    const nuevosErrores = {}
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'Escribe tu nombre para actualizar el perfil.'
    if (!/^\d{10}$/.test(formulario.telefono.trim())) nuevosErrores.telefono = 'Captura los 10 dígitos de tu teléfono, sin espacios ni guiones.'
    setErrores(nuevosErrores)
    setErrorPerfil('')
    setMensajePerfil('')
    if (Object.keys(nuevosErrores).length) return

    const datos = {
      nombre: formulario.nombre.trim(),
      apellidoPaterno: formulario.apellidoPaterno.trim(),
      apellidoMaterno: formulario.apellidoMaterno.trim(),
      telefono: formulario.telefono.trim(),
      comunidadMunicipio: formulario.comunidadMunicipio.trim(),
    }
    setGuardando(true)
    try {
      const respuesta = await actualizarPerfil(datos)
      const actualizado = { ...perfil, ...datos, ...(respuesta || {}) }
      setPerfil(actualizado)
      setFormulario(actualizado)
      setMensajePerfil('Tu perfil quedó actualizado. Los cambios ya están guardados en tu cuenta.')
    } catch (error) {
      setErrorPerfil(mensajeError(error, 'guardar los cambios de tu perfil'))
    } finally {
      setGuardando(false)
    }
  }

  async function guardarContrasena(event) {
    event.preventDefault()
    setErrorContrasena('')
    setMensajeContrasena('')
    if (!contrasenas.actual) { setErrorContrasena('Escribe tu contraseña actual para confirmar el cambio.'); return }
    if (contrasenas.nueva.length < 8) { setErrorContrasena('La nueva contraseña debe tener al menos 8 caracteres.'); return }
    if (contrasenas.nueva !== contrasenas.confirmar) { setErrorContrasena('La nueva contraseña y su confirmación no coinciden.'); return }

    setCambiandoContrasena(true)
    try {
      await actualizarContrasena({
        contrasenaActual: contrasenas.actual,
        contrasenaNueva: contrasenas.nueva,
      })
      setContrasenas({ actual: '', nueva: '', confirmar: '' })
      setMensajeContrasena('Tu contraseña se actualizó. La próxima vez, inicia sesión con la nueva contraseña.')
    } catch (error) {
      setErrorContrasena(error.status === 400
        ? 'La contraseña actual no coincide. Revísala e inténtalo de nuevo.'
        : mensajeError(error, 'actualizar tu contraseña'))
    } finally {
      setCambiandoContrasena(false)
    }
  }

  return (
    <div className="page-shell stack">
      <div className="page-heading">
        <span className="eyebrow">P11 · Perfil</span>
        <h1>Mi perfil</h1>
        <p>Consulta y actualiza la información de tu cuenta.</p>
      </div>

      {errorCarga ? (
        <BaseCard className="stack">
          <AlertMessage title="No pudimos cargar tu perfil" tone="danger">{errorCarga}</AlertMessage>
          <BaseButton variant="secondary" onClick={cargarPerfil}>Volver a cargar</BaseButton>
        </BaseCard>
      ) : cargando ? (
        <BaseCard role="status">Cargando la información de tu perfil…</BaseCard>
      ) : (
        <>
          <BaseCard className="profile-card">
            <div className="profile-card__intro">
              <span className="profile-avatar" aria-hidden="true">{(nombreCompleto || perfil.correo || 'A').slice(0, 1).toUpperCase()}</span>
              <div><h2>{nombreCompleto || 'Tu perfil'}</h2><p className="muted">Información asociada a tu cuenta Agro</p></div>
            </div>
            <form className="form-grid" onSubmit={guardarPerfil} noValidate>
              <div className="profile-card__fields">
                <BaseField id="perfil-nombre" name="nombre" label="Nombre" value={formulario.nombre} onChange={cambiarCampo} error={errores.nombre} required disabled={guardando} />
                <BaseField id="perfil-apellido-paterno" name="apellidoPaterno" label="Apellido paterno" value={formulario.apellidoPaterno} onChange={cambiarCampo} disabled={guardando} />
                <BaseField id="perfil-apellido-materno" name="apellidoMaterno" label="Apellido materno" value={formulario.apellidoMaterno} onChange={cambiarCampo} disabled={guardando} />
                <BaseField id="perfil-correo" label="Correo electrónico" type="email" value={perfil.correo} readOnly disabled />
                <BaseField id="perfil-telefono" name="telefono" label="Teléfono (10 dígitos)" type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} value={formulario.telefono} onChange={cambiarCampo} error={errores.telefono} disabled={guardando} />
                <BaseField id="perfil-comunidad" name="comunidadMunicipio" label="Comunidad o municipio" value={formulario.comunidadMunicipio} onChange={cambiarCampo} disabled={guardando} />
                <BaseField id="perfil-rol" label="Rol" value={perfil.rol} readOnly disabled />
              </div>
              {errorPerfil && <AlertMessage title="No se guardaron los cambios" tone="danger">{errorPerfil}</AlertMessage>}
              {mensajePerfil && <AlertMessage title="Perfil actualizado" tone="info">{mensajePerfil}</AlertMessage>}
              <div className="row"><BaseButton type="submit" disabled={guardando} aria-busy={guardando}>{guardando ? 'Guardando perfil…' : 'Guardar cambios'}</BaseButton></div>
            </form>
          </BaseCard>

          <BaseCard className="stack">
            <div><h2>Cambiar contraseña</h2><p className="muted">Confirma tu contraseña actual y crea una nueva de al menos 8 caracteres.</p></div>
            <form className="form-grid" onSubmit={guardarContrasena} noValidate>
              <BaseField id="contrasena-actual" label="Contraseña actual" type="password" autoComplete="current-password" value={contrasenas.actual} onChange={(event) => setContrasenas((actual) => ({ ...actual, actual: event.target.value }))} required disabled={cambiandoContrasena} />
              <BaseField id="contrasena-nueva" label="Nueva contraseña" type="password" autoComplete="new-password" value={contrasenas.nueva} onChange={(event) => setContrasenas((actual) => ({ ...actual, nueva: event.target.value }))} required disabled={cambiandoContrasena} />
              <BaseField id="contrasena-confirmar" label="Confirmar nueva contraseña" type="password" autoComplete="new-password" value={contrasenas.confirmar} onChange={(event) => setContrasenas((actual) => ({ ...actual, confirmar: event.target.value }))} required disabled={cambiandoContrasena} />
              {errorContrasena && <AlertMessage title="No se pudo cambiar la contraseña" tone="danger">{errorContrasena}</AlertMessage>}
              {mensajeContrasena && <AlertMessage title="Contraseña actualizada" tone="info">{mensajeContrasena}</AlertMessage>}
              <div className="row"><BaseButton type="submit" disabled={cambiandoContrasena} aria-busy={cambiandoContrasena}>{cambiandoContrasena ? 'Actualizando…' : 'Cambiar contraseña'}</BaseButton></div>
            </form>
          </BaseCard>
        </>
      )}

      <BaseCard className="profile-links">
        <h2>Accesos rápidos</h2>
        <a href="#parcelas">Mis parcelas</a>
        <InstallAppButton />
        <Link to="/#contacto">Ayuda y soporte</Link>
      </BaseCard>
      <div id="parcelas"><MisParcelas /></div>
      <CerrarSesion />
    </div>
  )
}
