# AgroPWA Frontend

Repositorio del frontend para Agro, una PWA orientada al registro y seguimiento de cultivos. Registro e inicio de sesión están conectados a la API; el acceso a datos sin conexión sigue pendiente.

## Estado de producción

- El usuario confirmó que el trabajo integrado del Sprint 5 funciona correctamente en Azure Static Web Apps.
- Las modificaciones del Sprint 6 están en desarrollo local y no se consideran desplegadas.

## Sprint 6 · Cultivos I (en desarrollo)

- HU-14 / SCRUM-45: formulario de registro conectado al catálogo, parcelas y `POST /api/cultivos`, con validaciones y resumen de resultado.
- HU-15 / SCRUM-47: listado en línea con búsqueda, filtros por estado/tipo y paginación.
- HU-16 / SCRUM-49: detalle autenticado, manejo 404, avances y galería devueltos por la API.
- Validación local: `npm run build` y `node --test tests/autenticacion.test.js` (17 pruebas).
- Pendiente: offline y cola segura por usuario, filtro local «Pendientes», foto/cámara (HU-20), editar/eliminar (HU-17/18), registro de avances (HU-19), pruebas integrales y despliegue.

## Sprint 5 · Dashboard y parcelas (integrado y confirmado en producción)

- HU-13: consulta, registro y edición de parcelas en línea desde el perfil con API autenticada. Los reintentos de registro conservan `idLocal` para reducir duplicados.
- HU-12: dashboard conectado al resumen real, guía y actividad reciente del usuario. El contador de sincronización se muestra como no disponible: todavía no hay aislamiento de cola por usuario.
- Pendiente: aislamiento por usuario de IndexedDB y cola, sincronización real y el selector de parcela ahora en trabajo de HU-14. El perfil editable, actividades y fotos siguen en demostración.

## Sprint 4 · Autenticación

- HU-09: registro con validaciones y creación de sesión; el usuario confirmó la creación de una cuenta en Azure y su base de datos.
- HU-10: login en línea, Recordarme, restauración, rutas protegidas, Bearer y renovación con rotación integrados y confirmados en Azure. El acceso sin conexión de la historia sigue pendiente.
- HU-11: cierre local/remoto y aviso conservador de cola integrados; sincronización real y pruebas integrales de escenarios offline siguen pendientes.
- Cultivos, fotos y sincronización aún usan datos de demostración. No se implementó el acceso offline de HU-10.

## Sprint 1

La base inicial incluye:

- React con Vite.
- Doce rutas de interfaz identificadas de P01 a P12.
- Variables de diseño para colores, tipografía Inter y espaciados.
- Componentes reutilizables para botones, campos, tarjetas, etiquetas de estado y mensajes.
- Menú lateral en escritorio y barra inferior en móvil.
- Diseño adaptable a 390 px y 1440 px.

La correspondencia completa de pantallas y rutas se encuentra en [SPRINT_1_FRONTEND.md](SPRINT_1_FRONTEND.md).

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Instalación

```bash
npm install
npm run dev
```

## Verificación

```bash
npm run build
node --test tests/autenticacion.test.js
```

## Documentación del proyecto

El estado se resume en [Memoria.md](Memoria.md), los principios en [Constitution.md](Constitution.md), las reglas de colaboración en [AGENTS.md](AGENTS.md) y las dailies [Sprint 4](docs/DAILY_SPRINT4.md), [Sprint 5](docs/DAILY_SPRINT5.md) y [Sprint 6](docs/DAILY_SPRINT6.md). [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) conserva el mapa de rutas.

## Despliegue

La aplicación se publica en Azure Static Web Apps: [AgroPWA](https://gray-plant-0e406c80f.1.azurestaticapps.net).

El repositorio incluye el fallback de rutas de la SPA en `public/staticwebapp.config.json`. El sitio se encuentra publicado mediante Azure Static Web Apps. En la rama analizada no se encontró un workflow dentro de `.github/workflows`. Antes de crear o modificar uno, debe comprobarse si la configuración generada por Azure existe en `main` o en otra rama remota, para evitar duplicarla.

## Configuración segura

La URL pública de la API puede configurarse con `VITE_API_URL`; consulta `.env.example`. En desarrollo se usa `https://localhost:7095` por defecto (perfil HTTPS de la API); en producción se usa la URL pública de Azure si no se establece la variable durante la compilación. La URL de Vite queda visible en el código del navegador: nunca incluyas credenciales, tokens o cadenas de conexión.

Para probar el registro localmente, inicia la API con el perfil HTTPS y su base de datos, acepta el certificado de desarrollo si es necesario y verifica que CORS permita `http://localhost:5173`. Copia `.env.example` a `.env` solo si necesitas cambiar la URL. La compilación de Azure puede sobrescribir `VITE_API_URL` durante el build; las variables de ejecución del servidor no modifican un frontend ya compilado.

Sin Recordarme, los tokens y usuario se guardan en `sessionStorage`; con Recordarme, en `localStorage`. Ambos son accesibles desde JavaScript y vulnerables a XSS. La sesión se verifica en línea; no se guarda la contraseña. La renovación recordada entre pestañas requiere Web Locks, y si no está disponible se informa al usuario. Si falla el logout remoto, se borran los tokens locales pero no se garantiza la revocación en el servidor. Quedan por acordar cookies HttpOnly/Secure, CSRF, acceso offline, expiración real de sesión y motivos de cierre con backend. La recuperación de contraseña no está implementada.
