# AgroPWA Frontend

Repositorio del frontend para Agro, una PWA orientada al registro y seguimiento de cultivos. Registro e inicio de sesión están conectados a la API; el acceso a datos sin conexión sigue pendiente.

## Sprint 4 · Autenticación

- HU-09: registro con validaciones y creación de sesión; el usuario confirmó la creación de una cuenta en Azure y su base de datos.
- HU-10: login en línea, Recordarme, rutas protegidas, Bearer y renovación con rotación implementados en esta rama; pendientes de prueba integral y despliegue.
- El dashboard, los cultivos, fotos y sincronización aún usan datos de demostración. No se implementó el acceso offline de HU-10 ni el cierre de sesión de HU-11.

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

El estado se resume en [Memoria.md](Memoria.md), los principios en [Constitution.md](Constitution.md), las reglas de colaboración en [AGENTS.md](AGENTS.md) y los puntos pendientes en [docs/DAILY_SPRINT4.md](docs/DAILY_SPRINT4.md). [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) conserva el mapa de rutas.

## Despliegue

La aplicación se publica en Azure Static Web Apps: [AgroPWA](https://gray-plant-0e406c80f.1.azurestaticapps.net).

El repositorio incluye el fallback de rutas de la SPA en `public/staticwebapp.config.json`. El sitio se encuentra publicado mediante Azure Static Web Apps. En la rama analizada no se encontró un workflow dentro de `.github/workflows`. Antes de crear o modificar uno, debe comprobarse si la configuración generada por Azure existe en `main` o en otra rama remota, para evitar duplicarla.

## Configuración segura

La URL pública de la API puede configurarse con `VITE_API_URL`; consulta `.env.example`. En desarrollo se usa `https://localhost:7095` por defecto (perfil HTTPS de la API); en producción se usa la URL pública de Azure si no se establece la variable durante la compilación. La URL de Vite queda visible en el código del navegador: nunca incluyas credenciales, tokens o cadenas de conexión.

Para probar el registro localmente, inicia la API con el perfil HTTPS y su base de datos, acepta el certificado de desarrollo si es necesario y verifica que CORS permita `http://localhost:5173`. Copia `.env.example` a `.env` solo si necesitas cambiar la URL. La compilación de Azure puede sobrescribir `VITE_API_URL` durante el build; las variables de ejecución del servidor no modifican un frontend ya compilado.

Sin Recordarme, los tokens y usuario se guardan en `sessionStorage`; con Recordarme, en `localStorage`. Ambos son accesibles desde JavaScript y vulnerables a XSS. La sesión se verifica en línea; no se guarda la contraseña. La renovación recordada entre pestañas requiere Web Locks, y si no está disponible se informa al usuario. Quedan por acordar cookies HttpOnly/Secure, CSRF, acceso offline, expiración real de sesión y motivos de cierre con backend. La recuperación de contraseña y el logout no están implementados.
