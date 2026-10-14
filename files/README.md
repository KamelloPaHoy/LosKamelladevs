# Kamello Pa' Hoy

Aplicación móvil de trabajos informales por encargo en Barrancabermeja.
React Native + Expo SDK 57 + TypeScript · Firebase (Auth, Firestore, Storage) · Expo Notifications.

Curso: Desarrollo de Aplicaciones Móviles · Ingeniería Informática · UNIPAZ · Docente: Cipriano
Metodología: Scrumban con fases de Mobile-D (ver `Kamello Pa Hoy Propuesta y Metodologia`).

---

## 1. Visión

**Para** los hogares y pequeños negocios de Barrancabermeja **que** necesitan un trabajo sencillo (pintar, arreglar una llave, hacer un aseo, un mandado) y no saben a quién llamar ni si esa persona es confiable, **Kamello Pa' Hoy es una** app móvil de trabajos por encargo **que** permite publicar un trabajo en pocos minutos y contratar a una persona del distrito después de ver sus calificaciones. **A diferencia del** voz a voz y de los grupos de WhatsApp o redes sociales, **nuestro producto** deja visible la reputación de cada persona (estrellas y comentarios de trabajos anteriores) y protege el número de celular hasta que ambas partes aceptan el trabajo.

## 2. Objetivo del Producto

> Que un hogar de Barrancabermeja publique un trabajo sencillo en menos de 3 minutos y lo tenga asignado ese mismo día a una persona del distrito cuyas calificaciones pudo ver antes.

Medidas que se comprueban con usuarios de prueba: **3 minutos** para publicar y **asignación el mismo día**.

## 3. Roles

| Rol | Persona |
|---|---|
| Product Owner (fijo todo el semestre) | Luis Alejandro Toloza Mendoza |
| Scrum Master, Hito 1 (semanas 3–5) | Angel David Barbosa |
| Scrum Master, Hito 2 (semanas 6–8) | Luz Marina Sánchez Rodríguez |
| Scrum Master, Hito 3 (semanas 9–10) | Luis Alejandro Toloza Mendoza |
| Scrum Master, Hito 4 (semanas 11–13) | Luzdey Natalia Marín |
| Scrum Master, Hito 5 (semanas 14–16) | Angel David Barbosa |
| Developers | Los cuatro integrantes |

Áreas de referencia (cualquiera puede tomar cualquier historia):
Luis Alejandro → registro con SMS y perfil · Angel David → publicar, buscar y postular, fotos · Luz Marina → Figma, interfaz base, chat, calificaciones y notificaciones · Luzdey Natalia → seguridad, reglas de Firestore, privacidad, política de datos (Ley 1581).

## 4. Alcance (MoSCoW)

| Must | Should | Could | Won't (este semestre) |
|---|---|---|---|
| Registro con SMS | Filtros por categoría, barrio y precio | Habilidades en el perfil | Pagos dentro de la app |
| Aceptar política de datos | Fotos en el trabajo | Aviso de calificación pendiente | Contratos, seguridad social, responsabilidad legal |
| Sesión persistente | Editar o cancelar trabajo | Compartir trabajo por WhatsApp | Verificación de antecedentes o de documentos |
| Perfil (nombre, foto, barrio) | Reportar y bloquear usuarios | Modo oscuro | Cobertura fuera de Barrancabermeja |
| Publicar un trabajo | Chat entre las dos partes | | Publicación en Play Store / App Store |
| Lista y detalle de trabajos | Avisos de postulación y asignación | | Versión iOS publicada |
| Postularse y elegir postulado | APK de prueba distribuible | | Panel web de administración |
| Estados del trabajo | Editar perfil | | Reseñas anónimas o moderación automática |
| Calificar con estrellas y comentario | | | |
| Promedio visible en el perfil | | | |
| Número visible solo tras aceptar | | | |
| Reglas de Firestore/Storage | | | |

**Regla del 60 %:** Must = 63 de 105 puntos (60 %). Should = 33 (31 %). Could = 9 (9 %).

**Fuera del alcance:** pagos en la app; contratos formales y responsabilidad legal; verificación de antecedentes o documentos; cobertura fuera del distrito; publicación en tiendas; iOS publicado; panel web; reseñas anónimas. La entrega es un APK de prueba y ejecución con Expo Go.

## 5. Product Backlog inicial (ordenado por el PO)

| # | ID | Épica | Elemento | MoSCoW | Pts |
|---|---|---|---|---|---|
| 1 | TEC-01 | Base | Crear el proyecto Expo SDK 57 con TypeScript y Expo Router; configurar ramas y protección de `main` | Must | 3 |
| 2 | INV-01 | Base | Investigar cómo hacer la verificación por SMS (Firebase Phone Auth) en Expo Go y en APK; dejar la decisión por escrito | Must | 2 |
| 3 | TEC-02 | Base | Crear el proyecto Firebase (Auth, Firestore, Storage) y conectarlo a la app sin subir claves al repositorio | Must | 3 |
| 4 | TEC-03 | Base | Definir la estructura pantalla → hook → servicio y los modelos Usuario, Trabajo y Postulación | Must | 2 |
| 5 | HU-01 | Cuenta | Como persona que quiere usar la app, quiero registrarme con mi número de celular y un código por SMS para que mi cuenta corresponda a una persona real | Must | 5 |
| 6 | HU-02 | Cuenta | Como persona que se registra, quiero leer y aceptar la política de tratamiento de datos para saber qué se hace con mi información | Must | 2 |
| 7 | HU-03 | Cuenta | Como usuario registrado, quiero que mi sesión se mantenga abierta (y poder cerrarla) para no pedir un código cada vez que abro la app | Must | 3 |
| 8 | HU-04 | Cuenta | Como usuario, quiero completar mi perfil con nombre, foto y barrio para que otros sepan quién soy | Must | 3 |
| 9 | HU-05 | Publicar | Como hogar, quiero publicar un trabajo con categoría, descripción, barrio, fecha y precio para encontrar a quien lo haga | Must | 5 |
| 10 | HU-06 | Contratar | Como persona que busca trabajo, quiero ver la lista de trabajos disponibles para encontrar uno que pueda hacer | Must | 3 |
| 11 | HU-07 | Contratar | Como persona que busca trabajo, quiero abrir el detalle de un trabajo para decidir si me postulo | Must | 2 |
| 12 | HU-08 | Contratar | Como persona que busca trabajo, quiero postularme a un trabajo para que quien lo publicó me tenga en cuenta | Must | 3 |
| 13 | HU-09 | Contratar | Como quien publicó un trabajo, quiero ver quiénes se postularon con sus calificaciones y elegir a uno para contratar a alguien confiable | Must | 5 |
| 14 | HU-10 | Contratar | Como quien publica o realiza un trabajo, quiero que pase por los estados asignado, en curso y terminado para saber en qué va | Must | 5 |
| 15 | HU-11 | Confianza | Como quien contrató o hizo un trabajo terminado, quiero calificar a la otra persona con 1 a 5 estrellas y un comentario para dejar mi experiencia | Must | 5 |
| 16 | HU-12 | Confianza | Como usuario, quiero ver el promedio de calificaciones en el perfil de otra persona para decidir si la contrato | Must | 2 |
| 17 | TEC-04 | Confianza | Escribir y probar las reglas de seguridad de Firestore y Storage | Must | 5 |
| 18 | HU-13 | Confianza | Como usuario, quiero que mi número de celular solo lo vea la otra parte cuando ambos aceptemos el trabajo para proteger mi privacidad | Must | 5 |
| 19 | HU-14 | Contratar | Como persona que busca trabajo, quiero filtrar los trabajos por categoría, barrio y precio para encontrar rápido los que me sirven | Should | 5 |
| 20 | HU-15 | Publicar | Como hogar, quiero agregar fotos al trabajo para que quien se postule entienda lo que hay que hacer | Should | 3 |
| 21 | HU-16 | Publicar | Como hogar, quiero editar o cancelar un trabajo publicado para corregir errores o cambiar de planes | Should | 3 |
| 22 | HU-17 | Confianza | Como usuario, quiero reportar o bloquear a otra persona para sentirme seguro usando la app | Should | 5 |
| 23 | HU-18 | Comunicación | Como las dos partes de un trabajo asignado, queremos chatear dentro de la app para coordinar sin compartir otros datos | Should | 8 |
| 24 | HU-19 | Comunicación | Como usuario, quiero recibir un aviso cuando alguien se postula o me asignan un trabajo para responder a tiempo | Should | 5 |
| 25 | TEC-05 | Base | Configurar la generación y distribución del APK de prueba | Should | 2 |
| 26 | HU-20 | Cuenta | Como usuario, quiero editar mi perfil para mantener mis datos al día | Should | 2 |
| 27 | HU-21 | Cuenta | Como persona que busca trabajo, quiero listar mis habilidades en el perfil para que me elijan por lo que sé hacer | Could | 2 |
| 28 | HU-22 | Comunicación | Como usuario, quiero un aviso cuando tengo una calificación pendiente para no olvidar calificar | Could | 3 |
| 29 | HU-23 | Comunicación | Como hogar, quiero compartir mi trabajo por WhatsApp para que más gente del barrio lo vea | Could | 2 |
| 30 | HU-24 | Base | Como usuario, quiero un modo oscuro para usar la app de noche sin cansar la vista | Could | 2 |

**Total: 30 elementos · 105 puntos.** Ningún elemento vale 13 o más. Los puntos son una propuesta inicial y se ajustan con Planning Poker del equipo.

Notas sobre el orden: INV-01 va antes que HU-01 porque la verificación por SMS es el mayor riesgo técnico. HU-10 depende de HU-09, y HU-11 y HU-13 dependen de que exista una asignación. Los elementos TEC e INV se ejecutan en el Sprint 3 (Inicialización, semana 6); en los Sprints 0 a 2 el trabajo son historias, criterios y prototipo.

## 6. Tablero y Definición del Flujo de Trabajo

El tablero vive en GitHub Projects, enlazado al repositorio. Cada issue es una tarjeta y el PR que la cierra (`Closes #N`) la mueve a «Hecho». Elementos: historia (HU), tarea técnica (TEC), defecto (BUG) o investigación (INV). Empieza al entrar en «En desarrollo» y termina al entrar en «Hecho»; entre esos dos momentos se mide el cycle time.

| Columna | Política de entrada | WIP |
|---|---|---|
| Backlog | Cualquier idea con título claro. El PO decide su orden. | — |
| Listo | Cumple INVEST, tiene criterios de aceptación (Dado / Cuando / Entonces) y puntos, y el equipo la entiende. | 5 |
| En desarrollo | Alguien se la asigna y crea su rama (ej. `hu-01-registro-sms`). Una tarjeta por persona. | 4 |
| En revisión | Hay un PR abierto que enlaza el issue, y `tsc --noEmit` y `expo lint` están limpios. | 2 |
| En dispositivo | PR aprobado por otra persona; la rama se probó en un Android físico (Expo Go o APK). | 2 |
| Hecho | Cumple la Definición de Terminado y el PR está fusionado. | — |

- **Regla del equipo:** si «En revisión» o «En dispositivo» llegan a su límite, quien termine algo no empieza nada nuevo; va a revisar o a probar en el celular.
- **Bloqueos:** la tarjeta lleva la etiqueta `bloqueada` y se menciona en el siguiente Daily. Si sigue así dos días, interviene el Scrum Master.
- **Expectativa de nivel de servicio (provisional):** la mayoría de los elementos se terminan en 4 días o menos. Se revisa con datos reales en el Sprint 4.
- **Métricas en cada Sprint Review:** throughput del sprint y elemento de mayor edad.

## 7. Definición de Terminado

### Fase de Exploración (semanas 3 a 5)

- La historia tiene criterios de aceptación verificables en formato Dado / Cuando / Entonces.
- Su pantalla existe en el prototipo de Figma, como mínimo en baja fidelidad.
- El PO la validó con al menos un usuario real y anotó lo que dijo.

### Desde la semana 6 (DoD completa)

**Código:** entró a `main` por PR revisado por otra persona · `tsc --noEmit` y `expo lint` sin errores ni avisos nuevos · sigue la arquitectura pantalla → hook → servicio/repositorio de Firebase · las pruebas existentes pasan.

**Dispositivo:** probado en un Android físico (Expo Go o APK) · sin desbordamientos en 360 dp · toda lista maneja cargando, vacío, error y con datos · si pide un permiso, explica para qué y la app sigue funcionando si se niega.

**Usuario:** cumple los criterios de aceptación · textos en español claro, sin errores técnicos de Firebase a la vista · áreas táctiles de al menos 48 dp y contraste legible.

**Seguridad:** si lee o escribe datos, las reglas de Firestore/Storage se actualizaron y se probó que otro usuario no puede leerlos · el celular solo es visible cuando ambas partes aceptaron · no hay claves ni archivos privados en el repositorio.

**Equipo:** tarjeta en «Hecho» e issue cerrado · cambios que otros deben saber (paquetes, variables de entorno) documentados en el README.

## 8. Sprints

### Sprint 0 (semana 3)
Objetivo: dejar visión, alcance, backlog estimado, tablero y reglas de trabajo listos en GitHub.

### Sprint 1 (semana 4)
**Objetivo:** el flujo principal (registrarse, publicar, ver, postularse y elegir a alguien) tiene criterios de aceptación Dado / Cuando / Entonces y su pantalla en Figma de baja fidelidad, revisados con al menos un hogar y una persona que trabaja en el barrio.

Elementos en «Listo»: HU-01, HU-05, HU-06, HU-08, HU-09 (21 puntos).
