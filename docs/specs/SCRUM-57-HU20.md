# Spec — SCRUM-57 · HU-20 Fotografías de avances (Frontend)

**Estado:** implementación frontend en curso; alcance basado en Jira, Sprint 8 · Seguimiento
**Historia padre:** [SCRUM-24 · HU-20 Agregar fotografías](https://josevictormanuel619.atlassian.net/browse/SCRUM-24)
**Subtarea:** [SCRUM-57](https://josevictormanuel619.atlassian.net/browse/SCRUM-57)
**Diseño de referencia:** Figma, P09 · Registrar avance y P06 · Detalle
**Dependencias:** HU-19 (SCRUM-55), HU-16 (detalle), SCRUM-56 (API de fotos; figura Finalizado en Jira), HU-22 para sincronización offline.

## Objetivo

Permitir adjuntar fotografías JPG/PNG a un avance desde cámara o galería, previsualizarlas y consultarlas en la galería del detalle del cultivo.

## Alcance

- En el formulario de avance:
  - «Tomar foto» para iniciar captura con la cámara en dispositivos compatibles.
  - «Subir desde galería» para elegir imágenes existentes.
  - Vista previa de cada imagen y opción para retirarla antes de guardar.
  - Máximo cinco fotos por avance; al llegar al límite, explicar que no se pueden añadir más.
- Validar tipo y tamaño del archivo antes de subirlo.
- Comprimir cada foto a un tamaño objetivo de aproximadamente 1 MB, sin agregar dependencias sin aprobación.
- Subir al servidor y mostrar las fotos en la pestaña «Fotografías» del detalle del cultivo.
- La subtarea SCRUM-57 también menciona foto de portada en «Nuevo cultivo» y «Editar cultivo». La API SCRUM-56 incluye `esPortada`; coordinar este alcance con HU-14/HU-17 sin alterar sus pantallas o flujos aprobados fuera de lo necesario.
- Fuera de alcance: edición de imagen y carga de video.

## Integración con API

### Subida

`POST /api/cultivos/{idCultivo}/fotografias` como `multipart/form-data`, con:

- `archivo`: imagen comprimida;
- `idAvance` si se adjunta a un avance;
- `esPortada` para foto de portada;
- `idLocal` cuando esté disponible conforme al contrato offline aprobado;
- `latitud` y `longitud` solo si se acuerda capturar y tratar ubicación.

No establecer manualmente el `Content-Type` multipart si el cliente HTTP debe generar el boundary.

- `201`: respuesta `{ id, url, nombreArchivo, tamanoKb, esPortada }`; agregar la foto a la UI con los datos devueltos.
- `400`: mostrar el mensaje del servidor, manteniendo la selección cuando sea posible.
- `409`: informar el límite de cinco fotos.
- `DELETE /api/fotografias/{id}` responde `204`; usarlo solo al quitar una foto ya persistida, no para una selección local que nunca se subió.

## Validación de archivos y discrepancia de tamaño

Jira frontend SCRUM-57 dice rechazar archivos de más de **10 MB**; HU-20 también dice más de 10 MB. La subtarea backend SCRUM-56 y el contrato confirmado indican límite de **5 MB** y respuesta `400` para archivos mayores. Un archivo de 5–10 MB aceptado por el frontend sería rechazado por el servidor.

**Decisión propuesta para evitar fallos de integración:** aplicar 5 MB como límite máximo de archivo de entrada, hasta que producto/backend acuerden explícitamente otro límite y actualicen el contrato. Comprimir a aproximadamente 1 MB antes de la subida no elimina la necesidad de validar el tamaño original. Registrar esta discrepancia como pendiente de confirmación antes de darla por resuelta.

- Aceptar exclusivamente JPG y PNG; validar MIME y, cuando sea factible sin dependencia adicional, la firma real del contenido. La validación del servidor sigue siendo la autoridad.
- Rechazar archivos vacíos, tipos no admitidos y archivos que excedan el límite acordado con mensaje accesible.
- La compresión debe conservar orientación y formato válido; si no es posible comprimir, no afirmar que se alcanzó el objetivo.

## Offline: decisión pendiente / bloqueo

Jira pide almacenar el Blob en IndexedDB y subirlo durante la sincronización HU-22. La memoria vigente del proyecto indica que el guardado offline, la cola y la sincronización siguen pendientes por el aislamiento de datos por usuario. No persistir fotos de usuarios en IndexedDB ni afirmar que se sincronizarán hasta acordar aislamiento, propiedad del Blob, estados de cola, cancelación/borrado y relación con `idLocal`.

La captura puede crear una previsualización local temporal durante el formulario; esto no debe confundirse con almacenamiento offline durable. Liberar los recursos temporales al retirar imágenes o salir del flujo.

## Criterios de aceptación verificables

1. **Cámara:** en un dispositivo/navegador compatible, «Tomar foto» inicia la captura y la imagen elegida aparece en la previsualización. Si el navegador no ofrece captura, permitir usar galería y comunicar la limitación.
2. **Límite:** al tener cinco fotos seleccionadas o asociadas al avance, una sexta no se añade y se muestra el aviso de límite.
3. **Tipo/tamaño:** un tipo no admitido o un archivo sobre el límite acordado se rechaza con mensaje, sin enviarlo.
4. **Galería:** tras guardar el avance con fotos, la pestaña «Fotografías» del cultivo muestra las fotos persistidas.
5. **Compresión:** cada imagen enviada se comprime al objetivo aproximado de 1 MB, salvo limitación técnica comunicada y error recuperable.
6. **Fallo de subida:** no se presenta una foto como persistida si la API falla; se conserva la selección temporal y se permite reintentar.

## Pruebas propuestas

- Selección de archivos, cámara en dispositivo real, cancelación de selector y permiso denegado.
- JPG/PNG válidos; MIME inválido, tamaño sobre el máximo y límite de 5 fotos.
- Compresión y orientación de imagen; archivo que no puede procesarse.
- Respuestas `201`, `400`, `409`, `204` y fallo de red.
- Galería vacía, cargando y con datos; quitar selección local y borrar foto remota.
- Probar cámara y diseño responsive a 390 px y 1440 px; preservar P06/P09 y reutilizar componentes existentes.

## Decisiones abiertas

- Confirmar el umbral de entrada: Jira frontend indica 10 MB, pero el contrato de backend fija 5 MB.
- Acordar formato y calidad de compresión para el objetivo aproximado de 1 MB y qué hacer si no se alcanza.
- Confirmar el comportamiento de cámara por navegador y dispositivo objetivo; validar en celular real.
- Precisar si la foto de portada se implementa en esta entrega o se mantiene en HU-14/HU-17, y cómo se muestra/reemplaza.
- Resolver aislamiento y sincronización offline antes de guardar Blob duradero en IndexedDB.
