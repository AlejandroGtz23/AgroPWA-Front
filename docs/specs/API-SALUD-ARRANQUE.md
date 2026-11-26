# Spec — Calentamiento de API al abrir Agro

**Estado:** especificación para implementación frontend  
**Motivo:** Azure puede tardar en responder al primer acceso cuando el servicio está inactivo.  
**Endpoint existente:** `GET /api/salud`, mediante `comprobarSalud()` en `src/api/cliente.js`.

## Objetivo

Iniciar una petición de salud al abrir la aplicación para que la API empiece a activarse antes de que el usuario envíe el formulario de inicio de sesión.

## Comportamiento requerido

- Disparar una comprobación desde el punto de entrada global de la app, independiente de las rutas de login, sesión o layout autenticado.
- Iniciarla sin esperar su resultado: la UI debe renderizarse y permitir escribir de inmediato.
- Reutilizar `comprobarSalud()` y su opción `cache: 'no-store'`.
- No repetir la petición inicial por remontajes de React Strict Mode, navegación entre rutas ni montaje de `ConnectionStatus`.
- Si la app se abre sin conexión, no intentar la solicitud en ese momento; iniciar una comprobación al detectar una transición real de offline a online.
- Compartir el resultado/la promesa en curso entre el arranque y `ConnectionStatus`; una reconexión puede lanzar una comprobación nueva, pero solicitudes concurrentes deben deduplicarse.
- Gestionar el fallo sin bloquear ni cerrar la app. El resultado puede alimentar el aviso existente de `ConnectionStatus`; no debe cambiar el flujo de Login ni simular una sesión validada.
- Los avisos asociados deben seguir [UX de mensajes](UX-MENSAJES-TRANSVERSALES.md): distinguir falta de Internet de API no disponible y dar una acción o expectativa realista; no afirmar que el calentamiento garantiza una respuesta rápida del login.

## Criterios de aceptación

1. En una carga online, el navegador inicia `GET /api/salud` durante el arranque, antes de cualquier envío de login.
2. La pantalla y el formulario se pueden usar mientras la solicitud está pendiente.
3. Hay como máximo una petición inicial por carga de documento, incluso en desarrollo con React Strict Mode y al entrar a rutas que renderizan `ConnectionStatus`.
4. Si el arranque es offline, no hay petición hasta recuperar conexión; al recuperarla se hace una comprobación sin duplicar solicitudes concurrentes.
5. Un error, timeout natural o respuesta no exitosa no impide navegar ni enviar Login; Login sigue realizando su propia petición normal y conserva sus errores actuales.
6. Si se muestra un aviso, indica con claridad si falta Internet o no se pudo contactar el servidor y qué puede hacer la persona; el mensaje no bloquea el uso.

## Pruebas propuestas

- Espiar `fetch` y verificar método, URL, `cache: no-store` y una sola petición inicial.
- Simular respuesta lenta y comprobar que React renderiza el formulario inmediatamente.
- Montar con Strict Mode y navegar entre landing, login y rutas autenticadas para comprobar deduplicación.
- Simular offline al abrir y `online` después; verificar que se consulta una vez tras la reconexión.
- Simular rechazo de red, respuesta no `OK` y respuesta válida: no deben alterar el flujo de autenticación.

## Fuera de alcance

- Reintentos artificiales, espera antes del login, sondeo periódico o cambios en backend/Azure.
- Cambiar la política de autenticación, crear una sesión o garantizar que el servidor seguirá despierto hasta que el usuario envíe Login.
