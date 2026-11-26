# Spec — SCRUM-65 · HU-27 Recuperar contraseña (Frontend)

**Estado:** especificación para implementación; contrastada con Jira  
**Sprint:** 10 · Complementos  
**Historia padre:** [SCRUM-31 · HU-27 Recuperar contraseña](https://josevictormanuel619.atlassian.net/browse/SCRUM-31)  
**Subtarea:** [SCRUM-65](https://josevictormanuel619.atlassian.net/browse/SCRUM-65)  
**Dependencias:** HU-10; backend SCRUM-64 (figura Finalizado en Jira); servicio de correo configurado por backend. La opción Google requiere confirmar OAuth, vinculación de cuentas y soporte backend.

## Objetivo

Permitir solicitar por correo un enlace de recuperación y establecer una contraseña nueva mediante un enlace válido de un solo uso.

## Integración con API

- `POST /api/auth/recuperar` con `{ correo }` → `200` con mensaje genérico «Te enviamos un enlace a tu correo», tanto si el correo existe como si no.
- `POST /api/auth/restablecer` con `{ token, contrasenaNueva }` → `204`.
- Para `400` al restablecer, mostrar que el enlace expiró o ya se usó y ofrecer solicitar uno nuevo.
- El backend envía el enlace al frontend en `/restablecer?token=…`; el token se usa solo para la solicitud y no se registra ni persiste.
- La opción de recuperar acceso con Google no forma parte del contrato SCRUM-64. No simular un restablecimiento de contraseña desde el frontend: requiere autenticación OAuth validada por backend y una política segura de vinculación de la cuenta Google con la cuenta Agro.

## Alcance

- Añadir desde Login el enlace «¿Olvidaste tu contraseña?» hacia una pantalla para capturar correo.
- Validar el formato del correo en cliente; al enviar, mostrar estado ocupado y el mismo mensaje genérico indicado por el contrato.
- Añadir la ruta pública `/restablecer` para ingresar y confirmar la nueva contraseña.
- Añadir Google como alternativa para recuperar el acceso solo después de acordar el flujo OAuth con producto y backend. Si la cuenta ya está vinculada, la acción debe permitir autenticarse con Google; si no lo está, no asociar cuentas automáticamente solo por coincidencia de correo. La posibilidad de establecer además una contraseña Agro tras validar Google queda pendiente de contrato y decisión de producto.
- Exigir mínimo 8 caracteres y que ambas entradas coincidan.
- En éxito, regresar a Login con mensaje de confirmación; no iniciar sesión automáticamente.
- Si el enlace falta, expiró, ya se usó o el servidor rechaza el token, explicar qué pasó y ofrecer el siguiente paso: solicitar otro enlace o volver al acceso con Google si la cuenta está vinculada.
- Si no hay conexión, informar que la recuperación requiere Internet y permitir reintentar.
- Aplicar las pautas de [UX de mensajes](UX-MENSAJES-TRANSVERSALES.md): mensajes claros, situacionales y accionables, preservando la protección contra enumeración de cuentas.

## Criterios de aceptación

1. La pantalla de Login ofrece el enlace de recuperación y abre el formulario de correo.
2. Solicitar recuperación produce el mismo mensaje claro y útil tanto si el correo existe como si no, sin revelar si está registrado. Texto propuesto: «Si hay una cuenta asociada a este correo, recibirás instrucciones para recuperar el acceso. Revisa tu bandeja de entrada y correo no deseado».
3. Un enlace válido permite guardar una contraseña de al menos 8 caracteres y regresar a Login con confirmación.
4. Un token vencido o usado muestra el estado de enlace expirado/no válido y una acción para pedir otro.
5. La UI valida campos y comunica errores de red sin afirmar que se envió o cambió la contraseña cuando la API no lo confirmó.
6. Google se presenta como opción de recuperación solo cuando el flujo OAuth/backend esté disponible; nunca se vinculan cuentas automáticamente por coincidencia de correo.

## Pruebas propuestas

- Correo válido/inválido, respuesta `200`, rechazo de red y respuesta inesperada; el texto no debe enumerar usuarios.
- Token válido, ausente, vencido/usado y respuesta `204`/`400`.
- Contraseñas con menos de 8 caracteres, confirmación distinta y valores válidos.
- Recarga directa en `/restablecer?token=…`, navegación de regreso a Login y solicitud de otro enlace.
- Verificar ausencia de token y contraseña en localStorage, sessionStorage, IndexedDB y logs de aplicación.
- Cuando backend habilite Google OAuth: probar cuenta ya vinculada, rechazo/cancelación del proveedor, error de callback y cuenta no vinculada; verificar que no se cree una vinculación silenciosa.
- Diseño responsive a 390 px y 1440 px; acceso por teclado y mensajes anunciados de forma accesible.

## Fuera de alcance y notas

- Recuperación por SMS.
- Google OAuth no se puede implementar de forma segura solo en frontend. La integración queda condicionada a contrato/backend, configuración del proveedor, URLs de retorno y política de vinculación de cuentas.
- El vencimiento de 30 minutos y el uso único los aplica el servidor; el cliente no puede declararlos válidos por cuenta propia.
- El backend SCRUM-64 contempla límites de solicitudes y cierre de sesiones existentes al cambiar la contraseña.
