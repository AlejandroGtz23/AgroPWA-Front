# Daily · Sprint 8 · Seguimiento

## Rama y alcance

- Rama activa: `Sprint8_Alejandro`, creada con autorización del usuario desde `Sprint7_Alejandro`.
- Tareas frontend analizadas en Jira: SCRUM-55 (HU-19, registrar avance) y SCRUM-57 (HU-20, cámara, galería y compresión).
- Las subtareas backend relacionadas (SCRUM-54 y SCRUM-56) aparecen como Finalizado en Jira; esto no sustituye la validación integral contra la API desplegada.

## Implementación iniciada

- SCRUM-55: formulario conectado al catálogo de tipos de actividad y al endpoint `POST /api/cultivos/{idCultivo}/avances`; validaciones de fechas, campos condicionales de riego/fertilización, errores de API y navegación desde el detalle.
- SCRUM-57: selección por cámara/galería, previsualización, límite de cinco fotos, compresión a objetivo aproximado de 1 MB, subida multipart y galería existente; se incorporó también la selección/subida de foto de portada en alta y edición de cultivo.
- Se agregaron Specs en `docs/specs/SCRUM-55-HU19.md` y `docs/specs/SCRUM-57-HU20.md`.
- El cliente autenticado admite `FormData` sin forzar `Content-Type`, para que el navegador establezca el boundary multipart.

## Límites y pendientes

1. No se implementan guardado de actividades/fotos offline ni sincronización. Continúan bloqueados hasta acordar aislamiento de datos por usuario y el contrato de cola.
2. Jira frontend permite archivos de hasta 10 MB, pero SCRUM-56 y su API fijan 5 MB. El frontend aplica provisionalmente 5 MB para evitar rechazos previsibles; confirmar y alinear formalmente el criterio.
3. Confirmar en API real catálogo, forma del detalle, respuestas de carga multipart, `idLocal` e integración de foto de portada.
4. Probar cámara/galería en un celular real y revisar los diseños responsive a 390 px y 1440 px.
5. No se modificó backend ni Jira. No hay commit, push, PR ni merge.

## Validación local

- `npm run build`: correcto.
- `node --test tests/actividadesFotografias.test.js tests/reglasActividad.test.js tests/autenticacion.test.js`: 27 pruebas correctas.
- `git diff --check`: correcto.
- `package.json` no define un script `lint`.
