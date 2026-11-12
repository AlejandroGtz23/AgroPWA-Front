# Daily · Sprint 7 · Cultivos II

## Ramas y alcance asignado

- Ramas creadas desde `develop`: `Sprint7_Alejandro` (personal) y `Sprint7` (integración). El checkout activo es `Sprint7_Alejandro`.
- Jira confirma las subtareas frontend asignadas: SCRUM-51 (HU-17, editar cultivo), SCRUM-53 (HU-18, eliminar cultivo) y SCRUM-67 (HU-28, contacto).
- Sprint 7 aparece `future` en Jira aunque las fechas son 2–7 de noviembre de 2026; el trabajo inicia con la autorización del usuario del 12 de noviembre.

## Implementación frontend en esta rama

- HU-17: pantalla de edición con datos precargados, validaciones compartidas, estado y fecha de cosecha; `PUT /api/cultivos/{id}`, indicador de cambios sin guardar y confirmación al cancelar.
- HU-18: diálogo con conteo de avances/fotografías; al confirmar, retorno a la lista, `DELETE` diferido 5 segundos y opción «Deshacer». Si falla la API, el cultivo se vuelve a consultar y se muestra un aviso.
- HU-28: formulario público en la landing, validación de nombre/correo/mensaje, contador de 1000 caracteres, asunto opcional, `POST /api/contacto`, aviso 429 y conserva el texto cuando no puede enviar.
- UX de login: spinner y estado anunciado a lectores de pantalla; a los 5 segundos explica que puede deberse a conexión o tiempo de respuesta del servidor y pide no reenviar.
- El análisis del frontend encontró una sola petición `POST /api/auth/login`, sin reintentos ni esperas artificiales. La latencia real requiere medición de red/API/Azure; esta mejora informa, no reduce el tiempo del servidor.
- Validación local: `npm run build` y 20 pruebas (`node --test tests/autenticacion.test.js`).

## Dependencias, límites y pendientes

1. Persistencia, edición y eliminación offline continúan fuera de alcance hasta acordar aislamiento por usuario de IndexedDB/cola. En modo sin conexión se informa que no se guardarán cambios ni se programa el borrado.
2. Los contratos Jira indican `PUT /api/cultivos/{id}`, `DELETE /api/cultivos/{id}` y `POST /api/contacto`. La copia local de backend revisada todavía no muestra esas acciones/controlador; confirmar que el backend desplegado las expone y ejecutar pruebas integrales antes de dar HU por terminadas. No se modificó el backend.
3. Sprint 6 se integró en `main`, pero el usuario aún no confirma su despliegue en Azure. Sprint 7 está en desarrollo y no se ha promovido ni desplegado.
4. La cuota de Figma no permitió obtener capturas de referencia para esta iteración; se mantuvieron componentes/tokens y patrones existentes. Falta revisión visual en navegador a 390 px y 1440 px.
5. No se modificó el estado de Jira. No hay commit, push, PR ni merge de Sprint 7.
