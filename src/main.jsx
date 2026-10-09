import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import './styles/tokens.css'
import './styles/global.css'
import { registerPwa } from './pwa/registerPwa'
import { openAgroDatabase } from './storage/agroDb'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

registerPwa()

openAgroDatabase().catch((error) => {
  console.error('No se pudo inicializar el almacenamiento local de Agro.', error)
})
