# Spec · Paginación del selector de cultivos

**Estado:** implementado en frontend; pendiente de validar contra la API de producción.
**Flujo:** P09 · Registrar avance (`/app/cultivos/:cropId/actividad`)
**Motivo:** la API limita `tamano` a 50; solicitar 100 produce `400 Bad Request`.

## Objetivo

Permitir elegir entre los cultivos activos de la cuenta desde el formulario de actividad, sin exceder el límite de página que admite la API y con controles de paginación explícitos.

## Comportamiento

- Consultar `GET /api/cultivos` con `estado=activo`, `pagina` y `tamano=20`.
- Usar `elementos` para las opciones de la página actual y `total` para calcular el número de páginas.
- Presentar «Página X de Y · N cultivos activos» y acciones «Anterior» / «Siguiente» cuando existan varias páginas.
- Deshabilitar la acción que no corresponda en la primera y última página.
- Mantener el cultivo de la ruta seleccionado, aunque no esté en la página visible del listado.
- Al cambiar de cultivo, navegar a su ruta de registro de actividad y cargar su detalle.
- Mostrar estados de carga y error de la lista. Ante error, conservar el cultivo actual y permitir reintentar.
- No solicitar nunca más de 50 elementos por página.

## Criterios de aceptación

1. Con 0–20 cultivos activos se muestra una página y no se muestra navegación innecesaria.
2. Con más de 20 cultivos, «Siguiente» carga la página posterior y el indicador refleja página y total.
3. «Anterior» y «Siguiente» no permiten salir del rango válido.
4. El `GET` incluye `estado=activo`, una página válida y `tamano=20`; no vuelve a ocurrir el `400` por límite excedido.
5. El cultivo desde el que se abrió el formulario permanece seleccionado incluso si está en otra página.
6. Una respuesta de error de la lista no elimina el cultivo de contexto ni presenta opciones falsas; permite reintentar.
7. Se conserva el flujo existente de envío de la actividad y sus errores de validación.

## Pruebas

- Unitarias: total de páginas exacto, página parcial, cero resultados y valores de respuesta no utilizables.
- API/navegador: usuario con más de 20 cultivos activos, cambio de página, selección y navegación.
- Regresión: primera página con menos de 20 registros y error de red en el listado.
- Responsive: probar a 390 px y 1440 px; los controles deben poder operarse con teclado y táctil.

## Fuera de alcance

No habilita captura offline, caché de cultivos ni sincronización. No cambia el contrato de la API.
