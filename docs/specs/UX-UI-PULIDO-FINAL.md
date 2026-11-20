# Spec · Pulido UX/UI para cierre de AgroPWA

**Estado:** primera iteración frontend aplicada; requiere revisión visual y pruebas en navegador.
**Objetivo:** acercar las pantallas existentes a una experiencia consistente, profesional y lista para demostración, sin alterar rutas, contratos de API ni reglas de negocio.

## Principios

1. Priorizar jerarquía y lectura rápida: títulos claros, contexto breve y una acción principal por vista.
2. Mantener una identidad agrícola sobria basada en verde, fondos naturales y acentos cálidos; reutilizar Inter y los tokens/componentes actuales.
3. Hacer visible la navegación activa y mantener los patrones de escritorio y móvil.
4. Tratar carga, vacío, éxito, error y desconexión como estados de primera clase; ofrecer recuperación donde sea posible.
5. Evitar promesas que el producto todavía no cumple. En particular, no afirmar que se guardan registros offline o que hay sincronización automática real.
6. Preservar accesibilidad: foco visible, etiquetas asociadas, contraste suficiente, controles con nombre y estados anunciados.
7. No agregar dependencias ni cambiar las rutas P01–P12 existentes.

## Áreas incluidas

- Landing pública y navegación pública: propuesta de valor, accesos a registro/login, secciones informativas y contacto.
- Acceso y registro: legibilidad, contenedor, jerarquía del formulario y tratamiento de errores.
- Dashboard: saludo y contexto, resumen de datos reales y accesos rápidos.
- Cultivos: consulta, filtros, tarjetas, detalle, alta y edición.
- Actividades y fotografías: captura, selección, feedback y navegación.
- Sincronización y perfil: presentar con honestidad las capacidades disponibles y las demostrativas.
- Navegación autenticada lateral en escritorio y barra inferior en móvil.

### Iteración de cierre

- La imagen autorizada por el usuario se integra en el hero desde `public/agro-campo.jpeg`, con recorte adaptable, desvanecido lateral y movimiento lento tipo Ken Burns.
- El movimiento se desactiva con `prefers-reduced-motion`; la imagen incluye texto alternativo descriptivo.
- El hero rota las imágenes agrícolas proporcionadas por el usuario con controles anterior/siguiente, selección directa, indicador de posición y pausa/reproducción. La rotación automática se detiene ante movimiento reducido, interacción con el carrusel o foco de teclado.
- El dashboard prioriza saludo, estado de conexión, dos métricas, hasta tres actividades recientes y dos accesos frecuentes. Se eliminó la guía extensa para reducir texto y desplazamiento.
- La landing adopta una composición editorial de hero fotográfico a pantalla amplia: marca y acceso compacto, mensaje principal breve y CTA. Las secciones explicativas se retiran; el formulario público de contacto queda disponible dentro de un disclosure cerrado por defecto.
- El registro distribuye los campos en dos columnas en viewports habituales, manteniendo agrupaciones lógicas, etiquetas y errores; en pantallas muy estrechas pasa a una columna.

## Criterios de aceptación

1. La tipografía, color, espaciado, radios, superficies y botones siguen un sistema coherente basado en tokens.
2. En escritorio no hay solapamientos ni columnas ilegibles; la navegación lateral conserva espacio útil para el contenido.
3. En móvil (390 px) no hay desbordamiento horizontal; acciones principales, formularios y navegación son cómodos al tacto.
4. Los estados de carga/error/vacío se distinguen y no se muestran datos de ejemplo como si fueran información del usuario.
5. La landing y el dashboard describen con precisión la disponibilidad actual de las funciones online/offline.
6. Se conservan rutas, peticiones, validaciones, componentes compartidos y comportamiento de autenticación.
7. Se revisan visualmente landing, dashboard, lista/detalle/alta/edición de cultivos, formulario de actividad, fotografías, login, registro, perfil y sincronización.
8. `npm run build`, las pruebas disponibles y `git diff --check` finalizan correctamente.

## Fuera de alcance / dependencias

- Implementar la experiencia offline o sincronización (HU-21/HU-22); requiere antes acordar aislamiento por usuario, ciclo de vida local y contrato de cola.
- Cambiar APIs, backend, autenticación o persistencia.
- Reemplazar el diseño visual por un sistema nuevo o añadir una biblioteca de componentes.
- Dar por terminadas pantallas demostrativas de perfil/sincronización solamente por cambiar su apariencia.

## Verificación visual

- Viewports mínimos: 390 px móvil y 1440 px escritorio.
- Probar teclado, foco, zoom y reducción de movimiento.
- Confirmar que el texto de la landing no prometa guardado local ni sincronización aún no disponibles.
