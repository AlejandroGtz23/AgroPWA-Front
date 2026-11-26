# Spec — SCRUM-61 · HU-23 Instalar la aplicación (Frontend)

**Estado:** especificación para implementación; contrastada con Jira y la configuración PWA vigente  
**Sprint:** 10 · Complementos  
**Historia padre:** [SCRUM-27 · HU-23 Instalar la aplicación](https://josevictormanuel619.atlassian.net/browse/SCRUM-27)  
**Subtarea:** [SCRUM-61](https://josevictormanuel619.atlassian.net/browse/SCRUM-61)  
**Dependencias:** HTTPS y manifiesto PWA válido; HU-06/HU-07.

## Objetivo

Permitir instalar Agro desde la interfaz cuando el navegador lo admita y ofrecer instrucciones para iPhone/Safari, sin depender de una tienda de aplicaciones.

## Estado actual relevante

- `vite.config.js` ya genera `manifest.json` con nombre y nombre corto «Agro», `display: standalone`, ámbito `/` e iconos de 192 y 512 px, incluido uno maskable.
- El registro del service worker se realiza desde `src/main.jsx`.
- El flujo visible de instalación aún debe implementarse.

## Alcance

- Capturar `beforeinstallprompt` y conservar el evento para habilitar la acción «Instalar app».
- Mostrar la acción en la landing, el submenú «Acceder» y Mi perfil, reutilizando los componentes y estilos existentes.
- Al activarla, invocar el prompt nativo del navegador y respetar el resultado del usuario.
- Ocultar la acción si la aplicación ya está instalada (`display-mode: standalone` y, cuando aplique, `navigator.standalone`) o después de `appinstalled`.
- En iPhone/Safari, donde no se ofrece `beforeinstallprompt`, mostrar instrucciones: «Compartir › Agregar a pantalla de inicio».
- Verificar el manifiesto e iconos existentes; modificar solo lo necesario si la comprobación descubre una discrepancia.
- Mantener los avisos de instalación claros y contextuales según [UX de mensajes](UX-MENSAJES-TRANSVERSALES.md); no mostrar mensajes de error vagos ni avisos de éxito si el usuario canceló el prompt.

## Criterios de aceptación

1. En un navegador compatible y con HTTPS, se ofrece la opción de instalación y el clic abre el diálogo nativo.
2. Si el usuario cancela, la app sigue disponible y la acción puede volver a intentarse mientras el navegador lo permita.
3. Al instalarse o abrirse en modo independiente, no se presenta una acción de instalación redundante.
4. En iPhone/Safari se muestran instrucciones comprensibles para agregar Agro a la pantalla de inicio.
5. La instalación abre Agro en una ventana independiente y utiliza el nombre e iconos configurados en el manifiesto.

## Pruebas propuestas

- Chromium en escritorio y Android: prompt aceptado, cancelado y evento `appinstalled`.
- iPhone/Safari real: instrucciones y flujo manual de «Agregar a pantalla de inicio».
- App ya instalada o abierta en modo `standalone`: acción oculta.
- Verificar manifiesto, iconos, scope, service worker y rutas de inicio en Azure Static Web Apps sobre HTTPS.
- Diseño responsive a 390 px y 1440 px, incluyendo landing, menú de acceso y perfil.
- Validar textos para prompt disponible, instalación completada, cancelación, navegador no compatible e instrucciones de iPhone.

## Fuera de alcance y notas

- Publicación en Google Play o App Store.
- No asumir que todos los navegadores exponen el prompt programático; conservar la alternativa de instrucciones manuales.
- No agregar dependencias.
