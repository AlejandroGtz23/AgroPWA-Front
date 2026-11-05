# Daily · Sprint 5 · Dashboard y parcelas

## Avance en frontend

- HU-13 / SCRUM-43: consulta, alta y edición de parcelas mediante la API autenticada desde el perfil; validaciones y control de respuesta incierta con `idLocal`.
- HU-12 / SCRUM-41: dashboard con resumen, guía, actividad reciente y nombre desde el backend; sin datos inventados. La preferencia de ocultar la guía se guarda por usuario.
- El trabajo es en línea y aún requiere revisión visual y pruebas integrales contra API y navegador; no implica que esté desplegado ni finalizado en Jira.

## Pendientes para coordinar

1. HU-13: selector y atajo de parcela en el registro real de cultivo (HU-14); guardado offline y cola se aplazan hasta acordar HU-21/HU-22.
2. HU-12: resumen almacenado sin conexión y contador real por usuario. La cola actual no tiene contrato de estados ni aislamiento y por eso se muestra como no disponible.
3. Mantener explícito que cultivos, actividades, edición de perfil y sincronización todavía son pantallas de demostración.
4. Verificar en Azure y local con dos usuarios: aislamiento, 400/409, cero datos, renovaciones, errores de red y reintentos idempotentes; evitar datos personales en evidencias.
