# Memoria del proyecto

## Contexto vigente

- AgroPWA es una PWA para productores; este repositorio contiene solo el frontend. El backend ASP.NET y la base PostgreSQL están en repositorios separados.
- Sprint 4 de autenticación: HU-09 se probó en Azure con respuesta 201 y el usuario confirmó el registro en la base. HU-10 implementa login en línea; falta verificar sus escenarios de extremo a extremo.
- La API configurada tiene entornos local y Azure; `VITE_API_URL` es pública y se define en compilación.
- Los formularios de cultivos, el dashboard, fotos y sincronización siguen usando demostraciones; no describirlos como datos reales.
- No hay acceso de datos offline autenticado: IndexedDB tiene almacenes básicos, pero no flujo de negocio ni aislamiento de usuarios acordado.

## Sesiones

- Sin Recordarme se usa sessionStorage; con Recordarme se usa localStorage. Ambos son accesibles a JavaScript y vulnerables a XSS. No guardar contraseñas.
- La sesión solo se considera validada en línea por la API; Bearer y renovación con rotación se gestionan en `src/auth/autenticacion.js`.
- Con Recordarme, la renovación entre pestañas requiere Web Locks; si no está disponible se informa un error sin invalidar la sesión en silencio.
- El acceso offline, la fecha real de expiración de la sesión y el motivo de cierre son temas para la daily. La HU-11 de logout y la HU-12 del dashboard real siguen pendientes.

## Colaboración

- Fuente de verdad de reglas: `AGENTS.md`. Principios y límites: `Constitution.md`. Detalle para la daily: `docs/DAILY_SPRINT4.md`.
- No asumir que cambios locales o historias ya están desplegados; confirmar rama, PR y despliegue. No modificar Jira ni ramas sin autorización.
