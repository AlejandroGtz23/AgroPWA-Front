# Daily · Sprint 4 · Autenticación

## Completado y avance

- HU-09: registro conectado a la API. La persona responsable confirmó en Azure respuesta 201 y presencia del usuario en PostgreSQL. La historia SCRUM-13 figura Finalizado; verificar el estado de sus subtareas.
- HU-10 frontend: login, restauración de sesión al volver a inicio o login, Bearer, renovación y guardia de rutas implementados en esta rama; pendientes de pruebas de extremo a extremo y despliegue. El backend no se modificó.
- HU-11: cierre local/remoto implementado en esta rama, con advertencia ante cola no vacía; falta validar el flujo completo y la sincronización real. El dashboard sigue siendo demostrativo.

## Decisiones por acordar

1. Confirmar si se acepta temporalmente localStorage para Recordarme, con riesgo XSS, y cuándo evaluar cookies HttpOnly/Secure y CSRF en el backend.
2. Definir qué datos reales se guardan offline, aislamiento por usuario, dispositivos compartidos, acceso tras revocación y límite de tiempo. Sin conexión no se puede confirmar una revocación al servidor.
3. Solicitar al backend, si se acuerda, fecha de expiración de sesión y un motivo de cierre distinguible; `expiraUtc` es del access token, no el vencimiento de los siete días.
4. Validar estrategia de renovación/rotación entre pestañas y comportamiento cuando Web Locks no está disponible. Acordar recuperación cuando la respuesta de renovación se pierde tras la rotación.
5. Coordinar HU-11 y HU-12: cierre de sesión real y dashboard con datos autenticados.
6. HU-10 figura finalizada en Jira, pero su subtarea frontend sigue por hacer y el criterio offline no está implementado; acordar el estado y alcance sin cambiar Jira automáticamente.

## Verificación conjunta

- En entorno de prueba: login válido/incorrecto, correo inválido, límite y bloqueo, recarga, Recordarme, renovación, vencimiento y rutas privadas.
- Probar pestañas simultáneas y fallos de red sin exponer tokens o contraseñas en evidencias.
- Confirmar que Azure incorpora la versión desplegada y permite el origen frontend por CORS.
