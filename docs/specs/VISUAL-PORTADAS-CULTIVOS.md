# Spec — Renderizado de portadas en Cultivos y Detalle

**Alcance:** imagen principal/foto de portada en tarjetas de «Cultivos» y encabezado de «Detalle de cultivo».  
**Historias relacionadas:** HU-14 (consulta/listado de cultivos), HU-16 (detalle) y foto de portada de HU-20/HU-17.  
**Referencia de código:** `src/components/cultivos/CultivoPortada.jsx` y estilos `.crop-cover` / `.crop-detail__main > .crop-cover` en `src/styles/global.css`.

## Problema observado

La portada actual se renderiza en un rectángulo fijo con `object-fit: cover`; esto recorta partes importantes de imágenes altas, panorámicas o con el sujeto cerca del borde. Aumentar el tamaño del archivo no resuelve el recorte.

## Objetivo

Mostrar la foto completa, nítida y proporcional dentro de un marco consistente, adaptándose a imágenes grandes sin deformar ni ocultar partes relevantes.

## Comportamiento visual requerido

- Mantener un marco responsivo con proporción estable y dimensiones distintas para tarjeta compacta, tarjeta normal y detalle.
- Ajustar la imagen con `object-fit: contain` o una estrategia equivalente que **muestre la imagen completa**; conservar su relación de aspecto original y no estirarla.
- Centrar la imagen dentro del marco. Si las proporciones no coinciden, usar un fondo neutro coherente con los tokens de Agro en el espacio sobrante; no ampliar/cortar la imagen para llenar ese espacio.
- Limitar el tamaño del marco para imágenes de gran resolución y permitir reducción fluida en móvil; no causar desbordamiento horizontal ni saltos de layout durante la carga.
- Conservar el placeholder ilustrado cuando no exista portada o esta no cargue; distinguirlo de una foto real y proporcionar texto alternativo contextual.
- No cambiar la imagen original ni generar una versión recortada en backend. No añadir dependencias.

## Criterios de aceptación

1. Fotos verticales, horizontales y panorámicas se muestran completas y sin distorsión en tarjeta y detalle.
2. El sujeto principal no se pierde por recorte automático; la imagen no se amplía artificialmente para llenar el marco.
3. Imágenes de alta resolución se limitan al marco y no rompen la vista móvil o de escritorio.
4. Al faltar la imagen, fallar su carga o no haber portada, aparece el placeholder actual con alternativa accesible.
5. Las tarjetas mantienen alineación y altura consistente; el detalle ofrece un área mayor para apreciar la foto.
6. La vista se comprueba a 390 px y 1440 px, con imágenes de distintas orientaciones.

## Pruebas visuales

- Portada horizontal 16:9, cuadrada, retrato 3:4, panorámica extrema y resolución superior al marco.
- Carga lenta, URL inválida, sin portada y placeholder.
- Comparar tarjeta normal, compacta y encabezado de detalle en móvil y escritorio.
- Verificar `object-fit`, proporciones, `alt`, foco/navegación y ausencia de overflow.

## Decisión visual

Priorizar que se aprecie la foto completa y proporcional sobre llenar cada píxel del rectángulo. Si posteriormente se desea una variante recortada decorativa, requerirá una decisión de diseño explícita y no debe reemplazar la visualización completa solicitada.
