# Product Backlog · Kamello Pa' Hoy

Sprint 0 · Pasos 3 y 4 de la guía. Lo ordena el Product Owner (Luis Alejandro Toloza Mendoza).

**Épicas:** Base (técnicas) · Cuenta · Publicar · Contratar · Confianza · Comunicación.
**Historia de referencia:** HU-07 «abrir el detalle de un trabajo» = **2 puntos** *(por confirmar con el equipo)*.
**Escala:** 1, 2, 3, 5, 8 (Fibonacci). Nada de 13: lo que llegue a 13 se parte.
**Tipos:** `HU` historia de usuario · `TEC` tarea técnica · `INV` investigación (spike) · `BUG` defecto.

## Backlog inicial · fin del Sprint 0 (semana 3)

| Orden | ID | Tipo | Épica | Elemento | MoSCoW | Pts |
|---|---|---|---|---|---|---|
| 1 | TEC-01 | Técnica | Base | Crear el proyecto Expo SDK 57 con TypeScript y Expo Router; configurar ramas y protección de `main` | Must | 3 |
| 2 | INV-01 | Investigación | Base | Investigar cómo hacer la verificación por SMS (Firebase Phone Auth) en Expo Go y en APK; dejar la decisión por escrito | Must | 2 |
| 3 | TEC-02 | Técnica | Base | Crear el proyecto Firebase (Auth, Firestore, Storage) y conectarlo a la app sin subir claves al repositorio | Must | 3 |
| 4 | TEC-03 | Técnica | Base | Definir la estructura pantalla → hook → servicio y los modelos Usuario, Trabajo y Postulación | Must | 2 |
| 5 | HU-01 | Historia | Cuenta | Como persona que quiere usar la app, quiero registrarme con mi número de celular y un código por SMS para que mi cuenta corresponda a una persona real | Must | 5 |
| 6 | HU-02 | Historia | Cuenta | Como persona que se registra, quiero leer y aceptar la política de tratamiento de datos para saber qué se hace con mi información | Must | 2 |
| 7 | HU-03 | Historia | Cuenta | Como usuario registrado, quiero que mi sesión se mantenga abierta (y poder cerrarla) para no pedir un código cada vez que abro la app | Must | 3 |
| 8 | HU-04 | Historia | Cuenta | Como usuario, quiero completar mi perfil con nombre, foto y barrio para que otros sepan quién soy | Must | 3 |
| 9 | HU-05 | Historia | Publicar | Como hogar, quiero publicar un trabajo con categoría, descripción, barrio, fecha y precio para encontrar a quien lo haga | Must | 5 |
| 10 | HU-06 | Historia | Contratar | Como persona que busca trabajo, quiero ver la lista de trabajos disponibles para encontrar uno que pueda hacer | Must | 3 |
| 11 | HU-07 | Historia | Contratar | Como persona que busca trabajo, quiero abrir el detalle de un trabajo para decidir si me postulo | Must | 2 |
| 12 | HU-08 | Historia | Contratar | Como persona que busca trabajo, quiero postularme a un trabajo para que quien lo publicó me tenga en cuenta | Must | 3 |
| 13 | HU-09 | Historia | Contratar | Como quien publicó un trabajo, quiero ver quiénes se postularon con sus calificaciones y elegir a uno para contratar a alguien confiable | Must | 5 |
| 14 | HU-10 | Historia | Contratar | Como quien publica o realiza un trabajo, quiero que pase por los estados asignado, en curso y terminado para saber en qué va | Must | 5 |
| 15 | HU-11 | Historia | Confianza | Como quien contrató o hizo un trabajo terminado, quiero calificar a la otra persona con 1 a 5 estrellas y un comentario para dejar mi experiencia | Must | 5 |
| 16 | HU-12 | Historia | Confianza | Como usuario, quiero ver el promedio de calificaciones en el perfil de otra persona para decidir si la contrato | Must | 2 |
| 17 | TEC-04 | Técnica | Confianza | Escribir y probar las reglas de seguridad de Firestore y Storage | Must | 5 |
| 18 | HU-13 | Historia | Confianza | Como usuario, quiero que mi número de celular solo lo vea la otra parte cuando ambos aceptemos el trabajo para proteger mi privacidad | Must | 5 |
| 19 | HU-14 | Historia | Contratar | Como persona que busca trabajo, quiero filtrar los trabajos por categoría, barrio y precio para encontrar rápido los que me sirven | Should | 5 |
| 20 | HU-15 | Historia | Publicar | Como hogar, quiero agregar fotos al trabajo para que quien se postule entienda lo que hay que hacer | Should | 3 |
| 21 | HU-16 | Historia | Publicar | Como hogar, quiero editar o cancelar un trabajo publicado para corregir errores o cambiar de planes | Should | 3 |
| 22 | HU-17 | Historia | Confianza | Como usuario, quiero reportar o bloquear a otra persona para sentirme seguro usando la app | Should | 5 |
| 23 | HU-18 | Historia | Comunicación | Como las dos partes de un trabajo asignado, queremos chatear dentro de la app para coordinar sin compartir otros datos | Should | 8 |
| 24 | HU-19 | Historia | Comunicación | Como usuario, quiero recibir un aviso cuando alguien se postula o me asignan un trabajo para responder a tiempo | Should | 5 |
| 25 | TEC-05 | Técnica | Base | Configurar la generación y distribución del APK de prueba | Should | 2 |
| 26 | HU-20 | Historia | Cuenta | Como usuario, quiero editar mi perfil para mantener mis datos al día | Should | 2 |
| 27 | HU-21 | Historia | Cuenta | Como persona que busca trabajo, quiero listar mis habilidades en el perfil para que me elijan por lo que sé hacer | Could | 2 |
| 28 | HU-22 | Historia | Comunicación | Como usuario, quiero un aviso cuando tengo una calificación pendiente para no olvidar calificar | Could | 3 |
| 29 | HU-23 | Historia | Comunicación | Como hogar, quiero compartir mi trabajo por WhatsApp para que más gente del barrio lo vea | Could | 2 |
| 30 | HU-24 | Historia | Base | Como usuario, quiero un modo oscuro para usar la app de noche sin cansar la vista | Could | 2 |

**Total: 30 elementos · 105 puntos.** Ningún elemento vale 13 o más. Los puntos son una propuesta inicial y se ajustan con Planning Poker del equipo.

## Resumen por épica

| Épica | Elementos | Puntos |
|---|---|---|
| Base | TEC-01, INV-01, TEC-02, TEC-03, TEC-05, HU-24 | 14 |
| Cuenta | HU-01, HU-02, HU-03, HU-04, HU-20, HU-21 | 17 |
| Publicar | HU-05, HU-15, HU-16 | 11 |
| Contratar | HU-06, HU-07, HU-08, HU-09, HU-10, HU-14 | 23 |
| Confianza | HU-11, HU-12, TEC-04, HU-13, HU-17 | 22 |
| Comunicación | HU-18, HU-19, HU-22, HU-23 | 18 |
| **Total** | **30** | **105** |

## Por qué este orden

- **INV-01 va antes que HU-01** porque la verificación por SMS es el mayor riesgo técnico: si no funciona en Expo Go hay que decidirlo pronto.
- **HU-10 depende de HU-09**, y **HU-11 y HU-13** dependen de que exista una asignación.
- Las **TEC e INV se ejecutan en el Sprint 3** (Inicialización, semana 6). En los Sprints 0 a 2 el trabajo son historias, criterios y prototipo.
- Arriba va lo que más valor aporta por punto, respetando esas dependencias.
