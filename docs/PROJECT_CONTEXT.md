# Contexto del proyecto: AgroPWA

## Propósito

AgroPWA es una aplicación web progresiva para que productores registren y consulten la información de sus cultivos, incluso cuando la conectividad es limitada. Este repositorio alberga exclusivamente el frontend; el backend aún no tiene código y pertenece a otro repositorio.

La URL pública indicada para el proyecto es [https://gray-plant-0e406c80f.1.azurestaticapps.net](https://gray-plant-0e406c80f.1.azurestaticapps.net).

## Estado técnico actual

| Área | Decisión actual |
| --- | --- |
| Framework | React 19 con Vite 7 |
| Enrutamiento | React Router, configurado en `src/App.jsx` |
| Tipografía | Inter mediante `@fontsource/inter` |
| Estilos | Tokens CSS en `src/styles/tokens.css`, estilos globales en `src/styles/global.css` y estilos de componentes en `src/components/ui/ui.css` |
| Responsive | Diseño dirigido principalmente a 390 px y 1440 px; punto de adaptación principal en 800 px |
| Datos | Contenido de demostración local; no hay API, estado persistente ni autenticación real |
| Despliegue SPA | `public/staticwebapp.config.json` reescribe rutas de cliente a `index.html` |
| CI/CD | No existe actualmente un workflow versionado en `.github/workflows`; El sitio se encuentra publicado mediante Azure Static Web Apps. En la rama analizada no se encontró un workflow dentro de `.github/workflows`. Antes de crear o modificar uno, debe comprobarse si la configuración generada por Azure existe en `main` o en otra rama remota, para evitar duplicarla.|

## Mapa funcional de pantallas

| ID | Pantalla | Ruta | Estado actual |
| --- | --- | --- |
| P01 | Landing pública | `/` | Presentación de Agro, explicación, quiénes somos, acerca de y acceso a autenticación |
| P02 | Inicio de sesión | `/login` | Formulario visual; navega al dashboard sin validar credenciales |
| P03 | Registro | `/registro` | Formulario visual; navega al dashboard sin crear una cuenta real |
| P04 | Dashboard | `/app` | Resumen de ejemplo y accesos rápidos |
| P05 | Mis cultivos | `/app/cultivos` | Listado local de ejemplo |
| P06 | Nuevo cultivo | `/app/cultivos/nuevo` | Formulario de ejemplo; vuelve al listado al enviar |
| P07 | Detalle de cultivo | `/app/cultivos/:cropId` | Detalle e historial estáticos |
| P08 | Registrar actividad | `/app/cultivos/:cropId/actividad` | Formulario de ejemplo y navegación a fotografías |
| P09 | Fotografías | `/app/actividades/:activityId/fotos` | Marcadores visuales; no usa cámara ni almacenamiento |
| P10 | Sincronización | `/app/sincronizacion` | Indicadores y elementos pendientes estáticos |
| P11 | Perfil | `/app/perfil` | Formulario visual sin persistencia |
| P12 | No encontrada | `*` | Redirige al inicio mediante un enlace |

## Estructura relevante

- `src/main.jsx`: arranque de React, `BrowserRouter`, fuentes Inter y estilos compartidos.
- `src/App.jsx`: único mapa de rutas.
- `src/pages/`: pantallas P01 a P12.
- `src/layouts/AppLayout.jsx`: marco de las pantallas autenticadas.
- `src/components/ui/`: componentes base reutilizables.
- `src/components/navigation/`: barra lateral de escritorio y navegación inferior móvil.
- `src/styles/`: tokens y estilos globales.
- `public/staticwebapp.config.json`: fallback de navegación para Azure Static Web Apps.

## Decisiones y límites vigentes

- Mantener los componentes base y los tokens como la fuente de verdad visual. Debe evitarse crear componentes o CSS duplicados.
- Existe una duplicación heredada de reglas de UI entre `src/styles/global.css` y `src/components/ui/ui.css`. No se modifica como parte de esta documentación; debe tratarse en una tarea específica de consolidación para evitar cambios visuales accidentales.
- Las capacidades offline, sincronización, fotografías y autenticación están representadas por la interfaz, no implementadas técnicamente. Su implementación futura exige contrato de API y estrategia de almacenamiento/sincronización acordados con el backend.
- No hay variables de entorno consumidas actualmente. Cuando sean necesarias, las públicas usarán el prefijo `VITE_` y se documentarán en `.env.example` sin secretos.
- No hay script `lint` en `package.json`. La validación disponible es `npm run build`; al agregar lint, deberá ejecutarse antes de entregar cambios.

## Git, ramas y entregas

La rama local de trabajo asignada es `Sprint1_Alejandro`; no se trabaja directamente sobre `main`.

El flujo de ramas real encontrado en el remoto es:

```text
Sprint1_Alejandro → Sprint1 → develop → release → main
```

El contexto de negocio denomina a los dos pasos intermedios `Development` y `Release/Test`, mientras que las ramas existentes son `develop` y `release`. Hasta que el repositorio se renombre formalmente, deben usarse los nombres reales.

No se realizan merges, pushes, pull requests ni despliegues sin autorización explícita. Antes de entregar un cambio se ejecutan las validaciones disponibles, al menos `npm run build`.
