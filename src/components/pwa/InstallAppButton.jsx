import BaseButton from '../ui/BaseButton'
import useInstallPrompt from '../../hooks/useInstallPrompt'

export default function InstallAppButton({ className = '' }) {
  const { installed, canInstall, iosSafari, showInstructions, feedback, install } = useInstallPrompt()

  if (installed || (!iosSafari && !canInstall && !feedback)) return null

  return (
    <div className={`install-app${className ? ` ${className}` : ''}`}>
      {(iosSafari || canInstall) && (
        <BaseButton variant="secondary" onClick={install} aria-expanded={iosSafari ? showInstructions : undefined}>
          {iosSafari ? 'Cómo instalar Agro' : 'Instalar Agro'}
        </BaseButton>
      )}
      {iosSafari && showInstructions && (
        <div className="install-app__instructions" role="status">
          <strong>Agrega Agro a tu pantalla de inicio</strong>
          <span>En Safari, toca Compartir y elige «Agregar a pantalla de inicio».</span>
        </div>
      )}
      {feedback && <div className="install-app__feedback" role="status">{feedback}</div>}
    </div>
  )
}
