# Guía de trabajo para AgroPWA

## Alcance y arquitectura

- Este repositorio contiene únicamente el frontend de AgroPWA. El backend pertenece a otro repositorio y no debe implementarse ni simularse como servicio dentro de este proyecto.
- La aplicación usa React 19, Vite 7 y React Router. Mantén las rutas P01 a P12 definidas en `src/App.jsx`.
- La landing pública es la ruta `/`; ofrece información de la aplicación y acceso a `/registro` y `/login`. Las rutas autenticadas viven bajo `/app` y comparten `src/layouts/AppLayout.jsx`.
- La interfaz actual emplea datos y navegación de demostración. No presentar esta información como integración real con un backend hasta que exista una API acordada.

## Diseño y componentes

- Conserva la guía visual: fuente Inter, tokens en `src/styles/tokens.css`, estilos globales en `src/styles/global.css`, y adaptación principal a 390 px y 1440 px.
- Reutiliza los componentes de `src/components/ui`: `BaseButton`, `BaseField`, `BaseCard`, `StatusTag` y `AlertMessage`. Para la navegación autenticada utiliza `Sidebar` y `BottomNav`.
- Evita duplicar estilos, componentes y patrones de interfaz. Antes de crear una variante, revisa los componentes y tokens existentes.
- No realices cambios visuales significativos al diseño aprobado sin consultar previamente. Mantén las pantallas y los flujos existentes salvo que la tarea lo solicite de forma explícita.

## Configuración y seguridad

- Nunca incluir credenciales, tokens, claves ni cadenas de conexión en Git, código fuente, documentación o archivos de ejemplo.
- Toda variable que pueda exponerse al cliente debe usar el prefijo `VITE_` y documentarse en `.env.example` sin valores secretos. No crear una variable de entorno si no existe una necesidad concreta y acordada.
- Respeta `.gitignore`; no versionar `.env`, `dist`, `node_modules` ni archivos locales.
- Azure Static Web Apps requiere conservar la configuración SPA en `public/staticwebapp.config.json`.

## Validación y dependencias

- Antes de entregar cambios, ejecuta las validaciones disponibles en `package.json`. Actualmente `npm run build` es obligatorio; ejecuta `npm run lint` cuando el script exista.
- No agregues dependencias, plugins ni herramientas de compilación sin explicar antes su necesidad y obtener aprobación cuando cambien el alcance técnico.
- No modifiques pantallas ni lógica de negocio durante tareas exclusivamente documentales o de configuración, salvo autorización explícita.

## Git y colaboración

- Antes de modificar archivos, confirmar la rama actual con `git branch --show-current`.
- La rama personal de trabajo sigue el patrón `Sprint{número}_Alejandro`.
- La rama de integración del Sprint sigue el patrón `Sprint{número}`.
- El flujo general es:
  `Sprint{número}_Alejandro` → `Sprint{número}` → `develop` → `release` → `main`.
- No trabajar directamente sobre `develop`, `release` o `main`.
- No cambiar de rama, realizar merge, push, pull request ni eliminar ramas sin autorización explícita.
- Verificar que la rama corresponda al Sprint y a la historia actual antes de modificar código.