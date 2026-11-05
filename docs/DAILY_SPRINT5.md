# Daily · Sprint 5 · Dashboard y parcelas

## Avance en frontend

- HU-13 / SCRUM-43: consulta, alta y edición de parcelas mediante la API autenticada desde el perfil; validaciones y control de respuesta incierta con `idLocal`.
- HU-12 / SCRUM-41: dashboard con resumen, guía, actividad reciente y nombre desde el backend; sin datos inventados. La preferencia de ocultar la guía se guarda por usuario.
- El usuario confirmó el 5 de noviembre de 2026 que el trabajo integrado funciona correctamente en Azure. No se modificó el estado de Jira.

## Pendientes para coordinar

1. HU-13: selector de parcela integrado en el formulario online de HU-14 (Sprint 6); guardado offline y cola se aplazan hasta acordar HU-21/HU-22.
2. HU-12: resumen almacenado sin conexión y contador real por usuario. La cola actual no tiene contrato de estados ni aislamiento y por eso se muestra como no disponible.
3. El registro/listado/detalle de cultivos se trabaja online en Sprint 6; actividades, edición de perfil y sincronización siguen siendo demostrativas.
4. Pendientes de verificación integral: aislamiento, 400/409, cero datos, renovaciones, errores de red y reintentos idempotentes; evitar datos personales en evidencias.
