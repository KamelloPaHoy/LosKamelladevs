# Kamello Pa' Hoy

Aplicación móvil de trabajos informales por encargo en Barrancabermeja.
React Native + Expo SDK 57 + TypeScript · Firebase (Auth, Firestore, Storage) · Expo Notifications.

Curso: Desarrollo de Aplicaciones Móviles · Ingeniería Informática · UNIPAZ · Docente: Cipriano
Metodología: Scrumban con fases de Mobile-D (ver `Kamello Pa Hoy Propuesta y Metodologia`).

**Tablero:** [GitHub Projects · Kamello Pa' Hoy](PEGAR-AQUI-EL-ENLACE-DEL-PROYECTO)

> **Objetivo del Producto:** que un hogar de Barrancabermeja publique un trabajo sencillo en menos de 3 minutos y lo tenga asignado ese mismo día a una persona del distrito cuyas calificaciones pudo ver antes.

## Equipo

| Rol | Persona |
|---|---|
| Product Owner (fijo todo el semestre) | Luis Alejandro Toloza Mendoza |
| Scrum Master, Hito 1 (semanas 3–5) | Angel David Barbosa |
| Scrum Master, Hito 2 (semanas 6–8) | Luz Marina Sánchez Rodríguez |
| Scrum Master, Hito 3 (semanas 9–10) | Luis Alejandro Toloza Mendoza |
| Scrum Master, Hito 4 (semanas 11–13) | Luzdey Natalia Marín |
| Scrum Master, Hito 5 (semanas 14–16) | Angel David Barbosa |
| Developers | Los cuatro integrantes |

## Dónde está cada cosa

| Sprint | Paso de la guía | Archivo |
|---|---|---|
| 0 | Visión, Objetivo del Producto, MoSCoW y fuera del alcance | [`docs/vision-y-alcance.md`](docs/vision-y-alcance.md) |
| 0 | Backlog ordenado y estimado | [`docs/backlog.md`](docs/backlog.md) |
| 0 | Tablero en GitHub Projects | [`docs/tablero.md`](docs/tablero.md) · [`scripts/crear-backlog.ps1`](scripts/crear-backlog.ps1) · [`scripts/llenar-campos.ps1`](scripts/llenar-campos.ps1) |
| 0 | Definición del Flujo de Trabajo y Definición de Terminado | [`docs/flujo-de-trabajo.md`](docs/flujo-de-trabajo.md) |
| 0 | Plantillas de issue y de pull request | [`.github/`](.github/) |
| 0 | Roles, entregable y planificación del Sprint 1 | [`docs/sprints/sprint-0.md`](docs/sprints/sprint-0.md) |
| 1 | Revisión, Retrospectiva y Planificación | `docs/sprints/sprint-1.md` *(en curso)* |
| 1 | Persona, mapa, MVP, calidad, heurísticas | `docs/requisitos.md` *(en curso)* |
| 1 | Criterios Dado / Cuando / Entonces | `docs/criterios/` *(en curso)* |
| 1 | Validación con usuarios | `docs/validacion/` *(pendiente)* |
| 1 | Examen práctico | `docs/examen-sprint1.md` *(en curso)* |

## Cómo trabajamos (resumen)

- Cada elemento del backlog es un **issue** con código: `HU-XX` historia, `TEC-XX` técnica, `INV-XX` investigación, `BUG-XX` defecto.
- Ramas con el código de la tarea: `hu-01-registro-sms`. Commits que empiezan por el código: `HU-01: pantalla de código SMS`.
- Todo entra a `main` por **pull request** revisado por otra persona, con `Closes #N` en la descripción.
- Columnas del tablero: Backlog → Listo → En desarrollo → En revisión → En dispositivo → Hecho. Reglas completas en [`docs/flujo-de-trabajo.md`](docs/flujo-de-trabajo.md).
