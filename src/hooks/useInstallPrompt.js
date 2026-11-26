import { useEffect, useState } from 'react'

let eventoInstalacionPendiente = null
let instalacionConcluida = false
let listenersConectados = false
const suscriptores = new Set()

function esAplicacionInstalada() {
  return window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true
}

function esSafariEnIos() {
  const userAgent = navigator.userAgent || ''
  return /iphone|ipad|ipod/i.test(userAgent) && /safari/i.test(userAgent) && !/crios|fxios|edgios/i.test(userAgent)
}

function notificar() {
  const estado = { promptEvent: eventoInstalacionPendiente, installed: instalacionConcluida }
  suscriptores.forEach((suscriptor) => suscriptor(estado))
}

function conectarEventos() {
  if (listenersConectados) return
  listenersConectados = true
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    eventoInstalacionPendiente = event
    notificar()
  })
  window.addEventListener('appinstalled', () => {
    instalacionConcluida = true
    eventoInstalacionPendiente = null
    notificar()
  })
}

if (typeof window !== 'undefined') conectarEventos()

export default function useInstallPrompt() {
  const [estadoInstalacion, setEstadoInstalacion] = useState(() => ({
    promptEvent: eventoInstalacionPendiente,
    installed: instalacionConcluida || esAplicacionInstalada(),
  }))
  const [installed, setInstalled] = useState(() => esAplicacionInstalada())
  const [showInstructions, setShowInstructions] = useState(false)
  const [feedback, setFeedback] = useState('')
  const iosSafari = esSafariEnIos()

  useEffect(() => {
    conectarEventos()
    const suscriptor = (estado) => setEstadoInstalacion(estado)
    suscriptores.add(suscriptor)
    suscriptor({ promptEvent: eventoInstalacionPendiente, installed: instalacionConcluida || esAplicacionInstalada() })
    return () => suscriptores.delete(suscriptor)
  }, [])

  useEffect(() => {
    setInstalled(estadoInstalacion.installed || esAplicacionInstalada())
  }, [estadoInstalacion.installed])

  async function install() {
    if (iosSafari) {
      setShowInstructions((visible) => !visible)
      return
    }
    if (!estadoInstalacion.promptEvent) return

    setFeedback('')
    try {
      await estadoInstalacion.promptEvent.prompt()
      const choice = await estadoInstalacion.promptEvent.userChoice
      eventoInstalacionPendiente = null
      if (choice?.outcome === 'accepted') instalacionConcluida = true
      notificar()
      if (choice?.outcome !== 'accepted') {
        setFeedback('La instalación no se completó. Puedes seguir usando Agro y volver a instalarla desde las opciones de tu navegador.')
      }
    } catch {
      eventoInstalacionPendiente = null
      notificar()
      setFeedback('No se pudo abrir la ventana de instalación. Inténtalo desde las opciones de instalación del navegador.')
    }
  }

  return {
    installed,
    canInstall: Boolean(estadoInstalacion.promptEvent),
    iosSafari,
    showInstructions,
    feedback,
    install,
  }
}
