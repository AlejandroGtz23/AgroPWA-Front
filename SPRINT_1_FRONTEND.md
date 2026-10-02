# Sprint 1 Frontend

## Alcance implementado

- Proyecto React con Vite.
- Rutas P01 a P12 con React Router.
- Variables globales de color, tipografía Inter, espaciado y radios.
- Componentes base reutilizables: botón, campo, tarjeta, etiqueta de estado y mensajes.
- Navegación lateral para escritorio y barra inferior para móvil.
- Puntos de adaptación principales en 390 px y 1440 px.

## Correspondencia de pantallas

| ID | Pantalla | Ruta |
| --- | --- | --- |
| P01 | Inicio público | `/` |
| P02 | Inicio de sesión | `/login` |
| P03 | Registro | `/registro` |
| P04 | Dashboard | `/app` |
| P05 | Mis cultivos | `/app/cultivos` |
| P06 | Nuevo cultivo | `/app/cultivos/nuevo` |
| P07 | Detalle del cultivo | `/app/cultivos/:cropId` |
| P08 | Registrar actividad | `/app/cultivos/:cropId/actividad` |
| P09 | Fotografías | `/app/actividades/:activityId/fotos` |
| P10 | Sincronización | `/app/sincronizacion` |
| P11 | Perfil | `/app/perfil` |
| P12 | Página no encontrada | `*` |

## Ejecución

```bash
npm install
npm run dev
```

Para verificar la compilación:

```bash
npm run build
```
