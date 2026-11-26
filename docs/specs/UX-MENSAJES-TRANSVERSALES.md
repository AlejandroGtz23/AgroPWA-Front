# Spec — UX de mensajes en Agro

**Alcance:** pauta transversal para mensajes de validación, estado, éxito, advertencia y error en toda la aplicación.  
**Principio:** evitar textos vagos como «Ocurrió un error» cuando se conoce el motivo. El mensaje debe ayudar a entender qué pasó y qué hacer a continuación.

## Reglas de contenido

- Usar español claro, natural y consistente; tono amable, directo y sin culpar a la persona.
- Nombrar la acción o dato afectado: «No se pudo guardar tu teléfono» es mejor que «Error».
- Cuando sea seguro y conocido, explicar la causa concreta; si es recuperable, indicar el siguiente paso: corregir un campo, reintentar, volver o contactar soporte.
- No prometer resultados antes de recibir confirmación del servidor. Diferenciar «Guardando…», éxito confirmado y guardado fallido.
- Conservar los datos que la persona ya capturó ante un error recuperable.
- Distinguir falta de conexión, servidor no disponible, validación, permisos, recurso no encontrado y conflicto; no presentar todos como el mismo error.
- Asociar errores de campo con el campo y explicar cómo corregirlo. No sustituir la validación inline por un aviso genérico al pie del formulario.
- Para estados vacíos, explicar qué falta y ofrecer la acción pertinente.
- Mensajes accesibles: texto visible, relación con el control, anuncios apropiados con `role="status"`/`aria-live` o `role="alert"` según urgencia; no depender únicamente de color.
- No exponer tokens, contraseñas, datos personales innecesarios, trazas ni detalles internos del servidor.

## Privacidad y mensajes que deben ser equivalentes

La recuperación de contraseña requiere una excepción deliberada: el mensaje tras solicitar recuperación debe ser **igual** exista o no una cuenta para ese correo, para impedir enumeración de usuarios. Esto no obliga a que el texto sea vago. Texto propuesto:

> «Si hay una cuenta asociada a este correo, recibirás instrucciones para recuperar el acceso. Revisa tu bandeja de entrada y correo no deseado».

La UI puede dar ayuda adicional sobre revisar spam o volver a intentar, pero no confirmar si el correo está registrado.

## Prácticas a evitar

- «Algo salió mal», «Error desconocido» o «Intenta más tarde» como única explicación cuando se conoce una causa más concreta.
- Mensajes que afirman que se guardó, envió o actualizó información cuando la operación no fue confirmada.
- Mensajes que revelan si un correo está registrado o incluyen detalles sensibles de autenticación.
- Mensajes que desaparecen demasiado rápido, no se anuncian a tecnologías de asistencia o no ofrecen un siguiente paso.

## Criterios de aceptación transversales

1. Cada flujo tiene textos específicos para carga, éxito, validación, error recuperable, error no recuperable y estado vacío cuando correspondan.
2. Los errores conocidos explican el problema y la acción disponible; los fallos realmente inesperados usan un fallback amable sin exponer detalles técnicos.
3. Se preservan entradas no sensibles ante fallos; los secretos no se conservan más allá de lo necesario para la petición.
4. Los mensajes son perceptibles con teclado/lector de pantalla y comprensibles sin depender del color.
5. Las pruebas verifican el texto y el estado apropiado para respuestas exitosas, validaciones del servidor, falta de conexión y fallos de red.
