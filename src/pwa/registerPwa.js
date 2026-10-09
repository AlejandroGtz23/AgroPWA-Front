import { registerSW } from 'virtual:pwa-register'

export function registerPwa() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.error('No se pudo registrar el service worker de Agro.', error)
    },
  })
}
