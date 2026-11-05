# Daily · Sprint 6 · Cultivos I

## Alcance asignado y estado

- Sprint 6 de Jira agrupa HU-14/15/16. Las subtareas frontend SCRUM-45, SCRUM-47 y SCRUM-49 están asignadas a Jesus Alejandro.
- HU-14 / SCRUM-45: selector de tipo y parcela conectado a catálogo/API, validación, envío online con `idLocal` idempotente y pantalla de resultado implementados.
- HU-15 / SCRUM-47: lista online con búsqueda, filtros de estado/tipo y paginación implementada. «Pendientes» se muestra no disponible: la cola aún no distingue usuarios y no puede consultarse de forma segura.
- HU-16 / SCRUM-49: detalle online, 404 de cultivo ajeno/no existente, avances y galería consumen DTO del backend. Edición, eliminación y nuevo avance permanecen deshabilitados hasta HU-17/18/19.
- Validación local realizada: `npm run build` y 17 pruebas (`node --test tests/autenticacion.test.js`). No se hicieron cambios en backend.

## Límites y pendientes

1. La rama de trabajo es `Sprint6_Alejandro`, creada desde `develop`; la rama de integración `Sprint6` también fue creada. Sprint 5 permanece intacto.
2. Jira tiene una inconsistencia temporal: Sprint 6 aparece `future` aunque sus fechas fueron 26–31 oct 2026; Sprint 7 tiene fechas 2–7 nov pero también aparece `future`. Se eligió Sprint 6 por secuencia tras la confirmación del Sprint 5.
3. Las historias piden persistencia y consulta offline, pero IndexedDB/cola todavía no están aisladas por usuario. No se cachean ni se guardan cultivos localmente hasta acordar identidad, revocación, dispositivos compartidos y recuperación de sincronización.
4. Pendientes HU-14/15/16: selector visual de «Pendientes» real, guardar/leer catálogo y cultivos offline con contrato seguro, orden global requerido por HU-15 y pruebas integrales con API y navegador.
5. Foto de portada corresponde a HU-20; editar/eliminar y registrar avances son HUs posteriores. No se simulan como funcionalidades listas.
6. HU-17, HU-18 y HU-28 asignadas a la persona aparecen en Sprint 7; se dejan fuera de este alcance para mantener la secuencia acordada.
7. Sprint 5 fue confirmado por el usuario como correcto en Azure. Sprint 6 todavía es desarrollo local y no está desplegado ni marcado en Jira.
