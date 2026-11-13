# Spec — SCRUM-55 · HU-19 Registrar avance (Frontend)

**Estado:** implementación frontend en curso; alcance basado en Jira, Sprint 8 · Seguimiento
**Historia padre:** [SCRUM-23 · HU-19 Registrar avance](https://josevictormanuel619.atlassian.net/browse/SCRUM-23)
**Subtarea:** [SCRUM-55](https://josevictormanuel619.atlassian.net/browse/SCRUM-55)
**Diseño de referencia:** Figma, P09 · Registrar avance
**Dependencias:** HU-14 (cultivos), HU-16 (detalle del cultivo), SCRUM-54 (API; figura Finalizado en Jira), HU-20 para fotos.

## Objetivo

Permitir que el productor registre una actividad de un cultivo activo y consulte el resultado en la línea de tiempo del detalle de ese cultivo.

## Alcance

- Formulario accesible desde el detalle del cultivo.
- Cultivo preseleccionado si se abrió desde su detalle; solo deben ofrecerse cultivos activos cuando el formulario se abre sin un cultivo preseleccionado.
- Campos comunes:
  - cultivo: obligatorio;
  - tipo de actividad: obligatorio; catálogo de la API;
  - fecha: obligatoria;
  - descripción: obligatoria.
- Tipos de actividad: riego, fertilización, avance, plaga o enfermedad y otra.
- Campos condicionales:
  - **Riego:** duración entera en minutos, mayor que cero, y método.
  - **Fertilización:** producto, cantidad mayor que cero y unidad.
- Tras una respuesta exitosa, volver al detalle o actualizarlo para que el nuevo avance aparezca en la línea de tiempo.
- No incluye fotografías, edición/borrado de avances ni recordatorios.

## Reglas y validaciones

1. Reutilizar las validaciones y componentes de formulario disponibles; mostrar el error junto al campo y conservar lo ingresado.
2. La fecha no puede ser anterior a la siembra ni posterior a hoy.
3. No permitir registrar avances en cultivos que no estén activos. La API es autoridad final para esta regla.
4. Validar duración del riego como entero `> 0`; cantidad de fertilización como número `> 0`.
5. No inventar valores para los campos específicos de un tipo: los campos que no correspondan se envían como `null`.

## Integración con API

### Catálogo

`GET /api/catalogos/tipos-actividad` → `[{ "id": 1, "nombre": "Riego" }]`.

Mostrar estado de carga y un error recuperable si no se puede obtener el catálogo; no sustituirlo con datos de demostración.

### Crear avance

`POST /api/cultivos/{idCultivo}/avances`

```json
{
  "idLocal": "uuid",
  "idTipoActividad": 1,
  "fechaActividad": "2026-10-08T07:30:00Z",
  "descripcion": "Riego por la mañana",
  "duracionMin": 40,
  "metodoRiego": "Goteo",
  "producto": null,
  "cantidad": null,
  "unidad": null
}
```

- `201`: tratar como creado y refrescar la línea de tiempo.
- `400`: asociar `errores` del servidor a los campos; presentar el texto de validación, incluido «La fecha no puede ser anterior a la siembra».
- `409`: informar que solo se pueden registrar avances en cultivos activos.
- Otros errores o pérdida de conexión: mostrar un mensaje comprensible, conservar el formulario y permitir reintentar sin duplicar el registro.

## Offline: decisión pendiente / bloqueo

Jira solicita crear un `idLocal`, guardar en IndexedDB y mostrar «Guardado en tu dispositivo» cuando no hay conexión. Sin embargo, la memoria vigente del proyecto establece que el guardado offline y la cola siguen pendientes hasta acordar el aislamiento de datos por usuario; IndexedDB no tiene todavía contrato de estados ni aislamiento confirmado.

**Por tanto, no dar por aprobado ni implementar el guardado offline únicamente a partir de esta spec.** Antes de habilitarlo se debe acordar el aislamiento por usuario, el ciclo de vida de los registros locales y su integración con HU-22. Hasta entonces, no afirmar que un registro quedó guardado si solo permanece en el estado temporal del formulario.

## Criterios de aceptación verificables

1. **Guardado online:** dado un cultivo activo y datos válidos, al guardar la API crea el avance y este aparece en la línea de tiempo.
2. **Campos de riego:** al elegir «Riego», se muestran duración y método; duración cero, negativa o fraccionaria no se acepta.
3. **Descripción requerida:** si falta, se marca el campo, se explica el error y no se envía la petición.
4. **Fecha inválida:** una fecha anterior a siembra o posterior a hoy se rechaza con mensaje asociado al campo; también se presentan los errores equivalentes de la API.
5. **Cultivo inactivo:** si la API responde `409`, se informa que solo se permiten avances para cultivos activos y no se presenta como guardado.
6. **Fallo de red/API:** el formulario conserva sus valores y ofrece recuperación sin afirmar éxito.

## Pruebas propuestas

- Renderizado condicional de riego/fertilización y limpieza de campos que dejan de aplicar.
- Campos obligatorios, valores límite de fecha, duración y cantidad.
- Catálogo cargando, vacío y con error.
- Respuestas API `201`, `400`, `409` y error de red.
- Verificar actualización de la línea de tiempo después de `201`.
- Prueba responsive a 390 px y 1440 px, preservando P09 y la navegación autenticada existente.

## Decisiones abiertas

- Confirmar formato/huso horario esperado para `fechaActividad` y serialización de fecha local.
- Acordar si la selección de fecha futura se bloquea en el control además de validarse al enviar.
- Resolver y documentar la estrategia de aislamiento/cola offline antes de implementar los criterios offline de Jira.
