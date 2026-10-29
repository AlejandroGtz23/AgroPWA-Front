# Principios de AgroPWA Frontend

1. El frontend no implementa ni simula el backend; respeta el contrato acordado y reporta sus fallos sin ocultarlos.
2. Seguridad por defecto: nunca guardar contraseñas, claves ni secretos en el repositorio; los tokens en almacenamiento web son una solución temporal expuesta a XSS.
3. No presentar una sesión offline como validada por el servidor ni datos de demostración como datos reales.
4. Reutilizar componentes y tokens; preservar las rutas y el diseño aprobado. Cambios visuales importantes requieren consulta.
5. Mantener compatibilidad PWA y el fallback de Azure. No duplicar workflows de despliegue ni agregar dependencias sin aprobación.
6. Respetar el flujo de ramas y las autorizaciones de `AGENTS.md`. Documentar las limitaciones y comprobar los cambios con las validaciones disponibles.
