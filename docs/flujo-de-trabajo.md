# Definición del Flujo de Trabajo y Definición de Terminado · Kamello Pa' Hoy

Sprint 0 · Paso 6 de la guía.

## 1. Elemento de trabajo

Un **issue** del repositorio: historia (`HU`), tarea técnica (`TEC`), defecto (`BUG`) o investigación (`INV`).
Cada issue es una tarjeta del tablero, y el pull request que lo cierra (`Closes #N`) la mueve a «Hecho».

- **Empieza** cuando entra en «En desarrollo».
- **Termina** cuando entra en «Hecho».
- Entre esos dos momentos se mide el **cycle time**.

## 2. Políticas por columna

| Columna | Política de entrada | WIP |
|---|---|---|
| Backlog | Cualquier idea con título claro. El PO decide su orden. | — |
| Listo | Cumple INVEST, tiene criterios de aceptación (Dado / Cuando / Entonces) y puntos, y el equipo la entiende. | 5 |
| En desarrollo | Alguien se la asigna y crea su rama (ej. `hu-01-registro-sms`). Una tarjeta por persona. | 4 |
| En revisión | Hay un PR abierto que enlaza el issue, y `tsc --noEmit` y `expo lint` están limpios. | 2 |
| En dispositivo | PR aprobado por otra persona; la rama se probó en un Android físico (Expo Go o APK). | 2 |
| Hecho | Cumple la Definición de Terminado y el PR está fusionado. | — |

## 3. Reglas del equipo

- **Límites llenos:** si «En revisión» o «En dispositivo» llegan a su límite, quien termine algo no empieza nada nuevo; va a revisar o a probar en el celular.
- **Bloqueos:** la tarjeta lleva la etiqueta `bloqueada` y se menciona en el siguiente Daily. Si sigue así dos días, interviene el Scrum Master.
- **Expectativa de nivel de servicio (provisional):** la mayoría de los elementos se terminan en **4 días o menos**. Se revisa con datos reales en el Sprint 4.
- **Métricas en cada Sprint Review:** throughput del sprint y elemento de mayor edad.
- **Daily:** lunes, miércoles y viernes, en tres líneas: qué hice, qué haré, qué me frena.
- **Ramas y commits:** la rama lleva el código de la tarea (`hu-06-lista-trabajos`) y cada commit empieza por él (`HU-06: estado vacío de la lista`).
- **Nadie aprueba su propio pull request.**

## 4. Definición de Terminado

### Fase de Exploración (semanas 3 a 5)

- La historia tiene criterios de aceptación verificables en formato Dado / Cuando / Entonces.
- Su pantalla existe en el prototipo de Figma, como mínimo en baja fidelidad.
- El PO la validó con al menos un usuario real y anotó lo que dijo.

### Desde la semana 6 (DoD completa)

**Código**
- Entró a `main` por PR revisado por otra persona.
- `tsc --noEmit` y `expo lint` sin errores ni avisos nuevos.
- Sigue la arquitectura pantalla → hook → servicio/repositorio de Firebase.
- Las pruebas existentes pasan.

**Dispositivo**
- Probado en un Android físico (Expo Go o APK).
- Sin desbordamientos en 360 dp.
- Toda lista maneja cargando, vacío, error y con datos.
- Si pide un permiso, explica para qué y la app sigue funcionando si se niega.

**Usuario**
- Cumple los criterios de aceptación.
- Textos en español claro, sin errores técnicos de Firebase a la vista.
- Áreas táctiles de al menos 48 dp y contraste legible.

**Seguridad**
- Si lee o escribe datos, las reglas de Firestore/Storage se actualizaron y se probó que otro usuario no puede leerlos.
- El celular solo es visible cuando ambas partes aceptaron.
- No hay claves ni archivos privados en el repositorio.

**Equipo**
- Tarjeta en «Hecho» e issue cerrado.
- Cambios que otros deben saber (paquetes, variables de entorno) documentados en el README.
