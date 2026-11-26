# Spec — SCRUM-63 · HU-26 Mi perfil (Frontend)

**Estado:** especificación para implementación; contrastada con Jira y el código actual  
**Sprint:** 10 · Complementos  
**Historia padre:** [SCRUM-30 · HU-26 Mi perfil](https://josevictormanuel619.atlassian.net/browse/SCRUM-30)  
**Subtarea:** [SCRUM-63](https://josevictormanuel619.atlassian.net/browse/SCRUM-63)  
**Dependencias:** HU-10; backend SCRUM-62 (figura Finalizado en Jira); HU-11, HU-13 y HU-23.

## Objetivo

Permitir al usuario consultar y actualizar su perfil y cambiar su contraseña con los servicios autenticados del backend.

## Estado actual relevante

`src/pages/ProfilePage.jsx` muestra información derivada de la sesión, una notificación que indica que la edición no está disponible, Mis Parcelas y Cerrar sesión. La ruta `/app/perfil` ya existe; la edición debe reemplazar la demostración sin alterar esas funciones relacionadas.

## Integración con API

Usar el cliente HTTP autenticado existente y no persistir contraseñas ni incluirlas en logs.

- `GET /api/perfil` → `{ nombre, apellidoPaterno, apellidoMaterno, correo, telefono, comunidadMunicipio, rol }`.
- `PUT /api/perfil` con `{ nombre, apellidoPaterno, apellidoMaterno, telefono, comunidadMunicipio }` → `200`.
- `PUT /api/perfil/contrasena` con `{ contrasenaActual, contrasenaNueva }` → `204`.
- En el error `400` de cambio de contraseña, mostrar «La contraseña actual no es correcta» conforme al contrato de Jira.
- El correo es de solo lectura y no se envía como campo editable.

## Alcance

- Mostrar avatar de iniciales, nombre, correo y rol; completar datos con `GET /api/perfil`.
- Permitir editar nombre, apellidos, teléfono y comunidad o municipio.
- Validar nombre obligatorio y teléfono de exactamente 10 dígitos; mostrar errores junto a los campos y un mensaje de éxito al guardar.
- Incorporar formulario de cambio de contraseña con contraseña actual, nueva y confirmación; exigir al menos 8 caracteres y coincidencia de nueva contraseña/confirmación.
- Conservar los accesos a Mis Parcelas, Instalar la app, Ayuda y Cerrar sesión, según las rutas o acciones existentes.
- Manejar carga, error de lectura, error de guardado y reintento sin presentar datos de demostración como datos reales.
- Aplicar [UX de mensajes](UX-MENSAJES-TRANSVERSALES.md): especificar qué dato falló, por qué cuando se conozca y cómo corregirlo, sin ocultar errores concretos detrás de mensajes genéricos.

## Criterios de aceptación

1. El perfil presenta los datos del usuario autenticado y el correo no se puede editar.
2. Datos válidos se guardan y la interfaz refleja la respuesta del servidor; nombre vacío o teléfono inválido se rechazan antes del envío.
3. Una contraseña actual incorrecta muestra el mensaje especificado; una nueva contraseña válida requiere al menos 8 caracteres y confirmación coincidente.
4. Un error de red/API se comunica sin descartar cambios no enviados ni fingir que se guardaron.
5. Los accesos relacionados y el cierre de sesión siguen disponibles.
6. Cada estado de carga, validación, guardado o error ofrece texto contextual y el siguiente paso útil, sin filtrar datos sensibles.

## Pruebas propuestas

- Carga correcta, perfil incompleto, error de API y reintento de `GET`.
- Actualización válida; nombre vacío; teléfono con menos o más de 10 dígitos; error de red y respuesta no exitosa.
- Cambio de contraseña válida, contraseñas que no coinciden, longitud insuficiente y respuesta `400`.
- Verificar que la solicitud de actualización no cambia el correo y que ninguna contraseña se guarda en almacenamiento web.
- Diseño responsive a 390 px y 1440 px y conservación de Mis Parcelas/Cerrar sesión.
- Revisar mensajes de éxito, validación, error de red/API y reintento con lector de pantalla y sin depender solo del color.

## Fuera de alcance y notas

- Cambiar correo electrónico o eliminar la cuenta.
- La contraseña no se conserva al navegar, recargar o cerrar la pantalla.
- El backend SCRUM-62 confirma el contrato anterior; ante diferencias con la API desplegada, registrar el desajuste antes de adaptar el cliente.
