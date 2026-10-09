# AgroPWA Frontend

Repositorio del frontend para Agro, una PWA orientada al registro y seguimiento de cultivos. El trabajo sin conexión forma parte del alcance futuro; actualmente está representado únicamente mediante la interfaz de demostración.

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
```

## Documentación del proyecto

El alcance funcional, las rutas, las decisiones técnicas y las reglas de colaboración se documentan en [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) y [AGENTS.md](AGENTS.md).

## Despliegue

La aplicación se publica en Azure Static Web Apps: [AgroPWA](https://gray-plant-0e406c80f.1.azurestaticapps.net).

El repositorio incluye el fallback de rutas de la SPA en `public/staticwebapp.config.json`. El sitio se encuentra publicado mediante Azure Static Web Apps. En la rama analizada no se encontró un workflow dentro de `.github/workflows`. Antes de crear o modificar uno, debe comprobarse si la configuración generada por Azure existe en `main` o en otra rama remota, para evitar duplicarla.

## Configuración segura

No se usan variables de entorno en la versión actual. Cuando se requieran variables públicas de Vite, deberán usar el prefijo `VITE_` y documentarse en `.env.example` sin secretos. Nunca agregues credenciales, tokens o cadenas de conexión al repositorio.
