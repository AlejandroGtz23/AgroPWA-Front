# AgroPWA Frontend

Repositorio del frontend para Agro, una PWA orientada al registro y seguimiento de cultivos. Registro e inicio de sesión están conectados a la API; el acceso a datos sin conexión sigue pendiente.

## Estado de producción

- El usuario confirmó que el trabajo integrado del Sprint 5 funciona correctamente en Azure Static Web Apps.
- Sprint 6 se integró en `main`; el usuario todavía no ha confirmado el resultado de ese despliegue en Azure. La confirmación más reciente de producción corresponde a Sprint 5.

## Sprint 6 · Cultivos I (integrado en main)

- HU-14 / SCRUM-45: formulario de registro conectado al catálogo, parcelas y `POST /api/cultivos`, con validaciones y resumen de resultado.
- HU-15 / SCRUM-47: listado en línea con búsqueda, filtros por estado/tipo y paginación.
- HU-16 / SCRUM-49: detalle autenticado, manejo 404, avances y galería devueltos por la API.
- HU-14/15/16 se integraron en línea. Offline y cola segura por usuario, filtro local «Pendientes», foto/cámara (HU-20) y registro de avances (HU-19) siguen pendientes.

## Sprint 7 · Cultivos II (en desarrollo)

- HU-17 / SCRUM-51: formulario para editar datos/estado en línea, validación de fecha de cosecha e indicador de cambios sin guardar.
- HU-18 / SCRUM-53: confirmación de borrado y ventana de 5 segundos para deshacer antes de enviar `DELETE`.
- HU-28 / SCRUM-67: formulario público de contacto con validación, contador, límites 429 y conservación del texto si falla la conexión.
- Mejora UX de login: muestra progreso e informa cuando la respuesta tarda; el frontend solo hace una petición de login y la latencia del servidor/red requiere medición externa.
- Pendiente: flujos offline/cola, pruebas integrales con backend y confirmación del despliegue. Sprint 7 sigue marcado `future` en Jira pese a fechas 2–7 nov 2026.
- Validación local: `npm run build` y 20 pruebas (`node --test tests/autenticacion.test.js`).

## Sprint 5 · Dashboard y parcelas (integrado y confirmado en producción)

- HU-13: consulta, registro y edición de parcelas en línea desde el perfil con API autenticada. Los reintentos de registro conservan `idLocal` para reducir duplicados.
- HU-12: dashboard conectado al resumen real, guía y actividad reciente del usuario. El contador de sincronización se muestra como no disponible: todavía no hay aislamiento de cola por usuario.
- Pendiente: aislamiento por usuario de IndexedDB y cola y sincronización real. El perfil editable, actividades y fotos siguen en demostración.

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

El estado se resume en [Memoria.md](Memoria.md), los principios en [Constitution.md](Constitution.md), las reglas de colaboración en [AGENTS.md](AGENTS.md) y las dailies [Sprint 4](docs/DAILY_SPRINT4.md), [Sprint 5](docs/DAILY_SPRINT5.md), [Sprint 6](docs/DAILY_SPRINT6.md) y [Sprint 7](docs/DAILY_SPRINT7.md). [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) conserva el mapa de rutas.

## Despliegue

La aplicación se publica en Azure Static Web Apps: [AgroPWA](https://gray-plant-0e406c80f.1.azurestaticapps.net).

El repositorio incluye el fallback de rutas de la SPA en `public/staticwebapp.config.json`. `main` conserva el workflow de Azure Static Web Apps; la rama `develop` desde la que parte Sprint 7 no incluye ese workflow. No lo dupliques ni cambies sin revisar primero las ramas de despliegue.

## Configuración segura

La URL pública de la API puede configurarse con `VITE_API_URL`; consulta `.env.example`. En desarrollo se usa `https://localhost:7095` por defecto (perfil HTTPS de la API); en producción se usa la URL pública de Azure si no se establece la variable durante la compilación. La URL de Vite queda visible en el código del navegador: nunca incluyas credenciales, tokens o cadenas de conexión.

Para probar el registro localmente, inicia la API con el perfil HTTPS y su base de datos, acepta el certificado de desarrollo si es necesario y verifica que CORS permita `http://localhost:5173`. Copia `.env.example` a `.env` solo si necesitas cambiar la URL. La compilación de Azure puede sobrescribir `VITE_API_URL` durante el build; las variables de ejecución del servidor no modifican un frontend ya compilado.

Sin Recordarme, los tokens y usuario se guardan en `sessionStorage`; con Recordarme, en `localStorage`. Ambos son accesibles desde JavaScript y vulnerables a XSS. La sesión se verifica en línea; no se guarda la contraseña. La renovación recordada entre pestañas requiere Web Locks, y si no está disponible se informa al usuario. Si falla el logout remoto, se borran los tokens locales pero no se garantiza la revocación en el servidor. Quedan por acordar cookies HttpOnly/Secure, CSRF, acceso offline, expiración real de sesión y motivos de cierre con backend. La recuperación de contraseña no está implementada.
