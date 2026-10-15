# Tablero en GitHub Projects · Kamello Pa' Hoy

Sprint 0 · Paso 5 de la guía.

**Enlace:** PEGAR-AQUI-EL-ENLACE-DEL-PROYECTO
**Dueño:** organización `KamelloPaHoy` · enlazado al repositorio `LosKamelladevs`.
**Descripción del proyecto:** el Objetivo del Producto. **README del proyecto:** la visión y la lista «fuera del alcance».

## 1. Columnas (campo Status) y límites WIP

| Columna | WIP |
|---|---|
| Backlog | — |
| Listo | 5 |
| En desarrollo | 4 |
| En revisión | 2 |
| En dispositivo | 2 |
| Hecho | — |

Las políticas de entrada de cada columna están en [`flujo-de-trabajo.md`](flujo-de-trabajo.md).

## 2. Campos personalizados

| Campo | Tipo | Valores |
|---|---|---|
| Tipo | Single select | Historia · Técnica · Defecto · Investigación |
| Prioridad | Single select | Must · Should · Could |
| Épica | Single select | Base · Cuenta · Publicar · Contratar · Confianza · Comunicación |
| Puntos | Number | 1 · 2 · 3 · 5 · 8 |
| Sprint | Iteration | Duración de 1 semana, de una Sesión B a la siguiente |

## 3. Vistas

| Vista | Layout | Configuración | Para qué |
|---|---|---|---|
| Backlog | Table | Filtro `-status:Hecho`, orden manual del PO, suma de Puntos | Ver y ordenar todo lo pendiente |
| Sprint actual | Board | Columnas por Status, filtro `sprint:@current` | Se proyecta en el Daily |
| Por épica | Table | Agrupada por Épica | Ver el tamaño de cada épica |

## 4. Flujos automáticos (Workflows)

- **Item added to project** → Status = Backlog.
- **Item closed** → Status = Hecho.
- **Pull request merged** → Status = Hecho.

## 5. Cómo se cargó el backlog

1. `scripts/crear-backlog.ps1` crea las etiquetas (`historia`, `tecnica`, `defecto`, `investigacion`, `bloqueada`) y los 30 issues, y los agrega al proyecto.
2. `scripts/llenar-campos.ps1` llena Tipo, Prioridad, Épica, Puntos y Status de cada tarjeta según [`backlog.md`](backlog.md).
3. Los puntos y prioridades del tablero coinciden con los de `backlog.md`. Si uno cambia, se cambian los dos.

## 6. Capturas

*(Agregar aquí capturas de las vistas Backlog, Sprint actual y Por épica.)*
