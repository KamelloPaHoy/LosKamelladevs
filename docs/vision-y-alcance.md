# Visión y alcance · Kamello Pa' Hoy

Sprint 0 · Pasos 1 y 2 de la guía.

## 1. Visión (plantilla de Moore)

**Para** los hogares y pequeños negocios de Barrancabermeja **que** necesitan un trabajo sencillo (pintar, arreglar una llave, hacer un aseo, un mandado) y no saben a quién llamar ni si esa persona es confiable, **Kamello Pa' Hoy es una** app móvil de trabajos por encargo **que** permite publicar un trabajo en pocos minutos y contratar a una persona del distrito después de ver sus calificaciones. **A diferencia del** voz a voz y de los grupos de WhatsApp o redes sociales, **nuestro producto** deja visible la reputación de cada persona (estrellas y comentarios de trabajos anteriores) y protege el número de celular hasta que ambas partes aceptan el trabajo.

## 2. Objetivo del Producto

> Que un hogar de Barrancabermeja publique un trabajo sencillo en menos de 3 minutos y lo tenga asignado ese mismo día a una persona del distrito cuyas calificaciones pudo ver antes.

| Parte | En nuestro objetivo |
|---|---|
| Usuario concreto | Un hogar de Barrancabermeja |
| Cambio observable | Publica un trabajo y queda asignado a alguien cuyas calificaciones vio |
| Medida verificable | **Menos de 3 minutos** para publicar · **asignación el mismo día** |

Las dos medidas se comprueban con usuarios de prueba.

## 3. Alcance (MoSCoW)

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

### Regla del 60 %

| Grupo | Puntos | % del total |
|---|---|---|
| Must | 63 | 60 % |
| Should | 33 | 31 % |
| Could | 9 | 9 % |
| **Total** | **105** | 100 % |

### Revisión contra el Hito 3 (API + persistencia + función del dispositivo)

| Exigencia | La cubre |
|---|---|
| API | Firebase Auth (SMS) y Firestore — HU-01, HU-05, TEC-02 |
| Persistencia | Firestore y sesión persistente — HU-03, HU-05 |
| Función del dispositivo | Cámara / galería para la foto de perfil y del trabajo (HU-04, HU-15) y notificaciones (HU-19) |

## 4. Fuera del alcance

- Pagos dentro de la app.
- Contratos formales, seguridad social y responsabilidad legal sobre el trabajo.
- Verificación de antecedentes o de documentos de identidad.
- Cobertura fuera del distrito de Barrancabermeja.
- Publicación en Play Store o App Store; versión iOS publicada.
- Panel web de administración.
- Reseñas anónimas o moderación automática de comentarios.

La entrega del semestre es un **APK de prueba** y ejecución con **Expo Go**.
