# Memoria del proyecto

## Contexto vigente

- AgroPWA es una PWA para productores; este repositorio contiene solo el frontend. El backend ASP.NET y la base PostgreSQL están en repositorios separados.
- Sprint 4 de autenticación: HU-09 se probó en Azure con respuesta 201 y el usuario confirmó el registro en la base. El usuario también confirmó que la versión integrada, incluido login online, funciona correctamente en Azure; el acceso offline de HU-10 sigue pendiente.
- La API configurada tiene entornos local y Azure; `VITE_API_URL` es pública y se define en compilación.
- Sprint 5: dashboard y parcelas en línea integrados por el flujo de PR y confirmados por el usuario como correctos en Azure.
- Sprint 6: HU-14/15/16 se integraron hasta `main`. El usuario confirmó producción de Sprint 5, pero aún no confirmó el despliegue de Sprint 6.
- Sprint 7: ramas `Sprint7_Alejandro` y `Sprint7` creadas desde `develop`. Sprint 8 inició en `Sprint8_Alejandro`: implementación frontend online de HU-19/20 en curso; offline y sincronización siguen pendientes hasta acordar aislamiento por usuario.
- Login: el frontend realiza una sola petición `POST /api/auth/login`, sin demora artificial ni reintento. Se añadió progreso y orientación después de 5 s; la causa real debe medirse en navegador/API/Azure.
- No hay acceso de datos offline autenticado: IndexedDB tiene almacenes básicos, pero no flujo de negocio ni aislamiento de usuarios acordado.

## Sesiones

- Sin Recordarme se usa sessionStorage; con Recordarme se usa localStorage. Ambos son accesibles a JavaScript y vulnerables a XSS. No guardar contraseñas.
- La sesión solo se considera validada en línea por la API; Bearer y renovación con rotación se gestionan en `src/auth/autenticacion.js`.
- Inicio y login comprueban la sesión guardada y redirigen a `/app` si la API la valida; un fallo temporal conserva la sesión y permite reintentar. El comportamiento online desplegado fue confirmado por el usuario.
- Con Recordarme, la renovación entre pestañas requiere Web Locks; si no está disponible se informa un error sin invalidar la sesión en silencio.
- El acceso offline, la fecha real de expiración de la sesión y el motivo de cierre son temas para la daily. HU-11 tiene cierre local y remoto, pendiente de pruebas integrales y sincronización real.
- La cola IndexedDB aún no tiene contrato de estados ni aislamiento por usuario: el aviso de logout cuenta todos los registros de forma conservadora y no los borra. La sincronización real no está implementada.
- HU-13: el selector de parcela se incorporó al formulario en línea de HU-14. HU-19/20: registro de actividades y fotografías en implementación online; no se habilita almacenamiento offline hasta acordar aislamiento de datos por usuario. Un alta con respuesta incierta usa `idLocal` para reintentar sin duplicar.

## Colaboración

- Fuente de verdad de reglas: `AGENTS.md`. Principios y límites: `Constitution.md`. Seguimiento: `docs/DAILY_SPRINT4.md` a `docs/DAILY_SPRINT7.md`.
- No asumir que cambios locales o historias ya están desplegados; confirmar rama, PR y despliegue. No modificar Jira ni ramas sin autorización.
