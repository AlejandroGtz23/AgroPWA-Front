# Daily · Sprint 4 · Autenticación

## Completado y avance

- HU-09: registro conectado a la API. La persona responsable confirmó en Azure respuesta 201 y presencia del usuario en PostgreSQL. La historia SCRUM-13 figura Finalizado; verificar el estado de sus subtareas.
- HU-10 frontend: login, restauración de sesión, Bearer, renovación y rutas protegidas integrados; el usuario confirmó que la versión publicada funciona en Azure. El acceso offline descrito por la historia no se implementó. El backend no se modificó.
- HU-11: cierre local/remoto con advertencia conservadora; la sincronización real no existe. El usuario confirmó la versión integrada en Azure; siguen pendientes las pruebas completas del flujo offline.

## Decisiones por acordar

1. Confirmar si se acepta temporalmente localStorage para Recordarme, con riesgo XSS, y cuándo evaluar cookies HttpOnly/Secure y CSRF en el backend.
2. Definir qué datos reales se guardan offline, aislamiento por usuario, dispositivos compartidos, acceso tras revocación y límite de tiempo. Sin conexión no se puede confirmar una revocación al servidor.
3. Solicitar al backend, si se acuerda, fecha de expiración de sesión y un motivo de cierre distinguible; `expiraUtc` es del access token, no el vencimiento de los siete días.
4. Validar estrategia de renovación/rotación entre pestañas y comportamiento cuando Web Locks no está disponible. Acordar recuperación cuando la respuesta de renovación se pierde tras la rotación.
5. Coordinar HU-11 y HU-12: cierre de sesión real y dashboard con datos autenticados.
6. Jira conserva HU-10 y su subtarea frontend En curso por el criterio offline pendiente; no se cambió el estado de Jira en esta sesión.

## Verificación conjunta

- En entorno de prueba: login válido/incorrecto, correo inválido, límite y bloqueo, recarga, Recordarme, renovación, vencimiento y rutas privadas.
- Probar pestañas simultáneas y fallos de red sin exponer tokens o contraseñas en evidencias.
- Confirmar que Azure incorpora la versión desplegada y permite el origen frontend por CORS.
