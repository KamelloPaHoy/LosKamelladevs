# Kamello Pa' Hoy - Sprint 0: crea las etiquetas y los 30 issues del backlog inicial
# y los agrega al proyecto de GitHub Projects.
#
# Antes de correrlo (una sola vez):
#   1. Instalar GitHub CLI:            winget install --id GitHub.cli
#   2. Iniciar sesion:                 gh auth login
#   3. Dar permiso sobre Projects:     gh auth refresh -s project
#   4. El proyecto ya debe existir en la organizacion con el nombre EXACTO de $proyecto.
#
# Ejecutar desde la carpeta del repositorio LosKamelladevs:
#   powershell -ExecutionPolicy Bypass -File .\scripts\crear-backlog.ps1
#
# Correrlo UNA sola vez: si se corre dos veces, los issues quedan duplicados.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$proyecto = "Kamello Pa' Hoy"

# --- Etiquetas ---
gh label create historia      --color 2FD27A --description "Historia de usuario"   --force
gh label create tecnica       --color FFCB6B --description "Tarea tecnica"         --force
gh label create defecto       --color FF6B7A --description "Defecto"               --force
gh label create investigacion --color 82AAFF --description "Investigacion (spike)" --force
gh label create bloqueada     --color B71C1C --description "Tarjeta bloqueada"     --force

# --- Backlog: t=titulo, l=etiqueta, e=epica, p=prioridad, n=puntos, b=cuerpo ---
$items = @(
  @{t="TEC-01: Crear proyecto Expo SDK 57 + TypeScript + Expo Router"; l="tecnica"; e="Base"; p="Must"; n=3; b="Crear el proyecto, configurar ramas y proteccion de main."},
  @{t="INV-01: Investigar verificacion por SMS (Firebase Phone Auth) en Expo"; l="investigacion"; e="Base"; p="Must"; n=2; b="Comprobar si funciona en Expo Go o exige APK/development build. Dejar la decision por escrito."},
  @{t="TEC-02: Crear proyecto Firebase y conectarlo a la app"; l="tecnica"; e="Base"; p="Must"; n=3; b="Auth, Firestore y Storage. Sin claves ni archivos privados en el repositorio."},
  @{t="TEC-03: Estructura pantalla -> hook -> servicio y modelos base"; l="tecnica"; e="Base"; p="Must"; n=2; b="Modelos Usuario, Trabajo y Postulacion."},
  @{t="HU-01: Registrarme con mi numero de celular y codigo SMS"; l="historia"; e="Cuenta"; p="Must"; n=5; b="Como persona que quiere usar la app, quiero registrarme con mi numero de celular y un codigo por SMS para que mi cuenta corresponda a una persona real."},
  @{t="HU-02: Aceptar la politica de tratamiento de datos"; l="historia"; e="Cuenta"; p="Must"; n=2; b="Como persona que se registra, quiero leer y aceptar la politica de tratamiento de datos para saber que se hace con mi informacion."},
  @{t="HU-03: Mantener la sesion abierta y poder cerrarla"; l="historia"; e="Cuenta"; p="Must"; n=3; b="Como usuario registrado, quiero que mi sesion se mantenga abierta (y poder cerrarla) para no pedir un codigo cada vez que abro la app."},
  @{t="HU-04: Completar mi perfil (nombre, foto, barrio)"; l="historia"; e="Cuenta"; p="Must"; n=3; b="Como usuario, quiero completar mi perfil con nombre, foto y barrio para que otros sepan quien soy."},
  @{t="HU-05: Publicar un trabajo"; l="historia"; e="Publicar"; p="Must"; n=5; b="Como hogar, quiero publicar un trabajo con categoria, descripcion, barrio, fecha y precio para encontrar a quien lo haga."},
  @{t="HU-06: Ver la lista de trabajos disponibles"; l="historia"; e="Contratar"; p="Must"; n=3; b="Como persona que busca trabajo, quiero ver la lista de trabajos disponibles para encontrar uno que pueda hacer."},
  @{t="HU-07: Abrir el detalle de un trabajo"; l="historia"; e="Contratar"; p="Must"; n=2; b="Como persona que busca trabajo, quiero abrir el detalle de un trabajo para decidir si me postulo."},
  @{t="HU-08: Postularme a un trabajo"; l="historia"; e="Contratar"; p="Must"; n=3; b="Como persona que busca trabajo, quiero postularme a un trabajo para que quien lo publico me tenga en cuenta."},
  @{t="HU-09: Ver postulados con sus calificaciones y elegir a uno"; l="historia"; e="Contratar"; p="Must"; n=5; b="Como quien publico un trabajo, quiero ver quienes se postularon con sus calificaciones y elegir a uno para contratar a alguien confiable."},
  @{t="HU-10: Seguir el estado del trabajo (asignado, en curso, terminado)"; l="historia"; e="Contratar"; p="Must"; n=5; b="Como quien publica o realiza un trabajo, quiero que pase por los estados asignado, en curso y terminado para saber en que va."},
  @{t="HU-11: Calificar con estrellas y comentario al terminar"; l="historia"; e="Confianza"; p="Must"; n=5; b="Como quien contrato o hizo un trabajo terminado, quiero calificar a la otra persona con 1 a 5 estrellas y un comentario para dejar mi experiencia."},
  @{t="HU-12: Ver el promedio de calificaciones en un perfil"; l="historia"; e="Confianza"; p="Must"; n=2; b="Como usuario, quiero ver el promedio de calificaciones en el perfil de otra persona para decidir si la contrato."},
  @{t="TEC-04: Reglas de seguridad de Firestore y Storage con pruebas"; l="tecnica"; e="Confianza"; p="Must"; n=5; b="Probar que otro usuario no puede leer datos que no le corresponden."},
  @{t="HU-13: Mostrar mi celular solo cuando ambas partes aceptan"; l="historia"; e="Confianza"; p="Must"; n=5; b="Como usuario, quiero que mi numero de celular solo lo vea la otra parte cuando ambos aceptemos el trabajo para proteger mi privacidad."},
  @{t="HU-14: Filtrar trabajos por categoria, barrio y precio"; l="historia"; e="Contratar"; p="Should"; n=5; b="Como persona que busca trabajo, quiero filtrar los trabajos por categoria, barrio y precio para encontrar rapido los que me sirven."},
  @{t="HU-15: Agregar fotos al trabajo"; l="historia"; e="Publicar"; p="Should"; n=3; b="Como hogar, quiero agregar fotos al trabajo para que quien se postule entienda lo que hay que hacer."},
  @{t="HU-16: Editar o cancelar un trabajo publicado"; l="historia"; e="Publicar"; p="Should"; n=3; b="Como hogar, quiero editar o cancelar un trabajo publicado para corregir errores o cambiar de planes."},
  @{t="HU-17: Reportar o bloquear a otro usuario"; l="historia"; e="Confianza"; p="Should"; n=5; b="Como usuario, quiero reportar o bloquear a otra persona para sentirme seguro usando la app."},
  @{t="HU-18: Chat dentro de la app entre las dos partes"; l="historia"; e="Comunicacion"; p="Should"; n=8; b="Como las dos partes de un trabajo asignado, queremos chatear dentro de la app para coordinar sin compartir otros datos."},
  @{t="HU-19: Aviso al postularse o ser asignado"; l="historia"; e="Comunicacion"; p="Should"; n=5; b="Como usuario, quiero recibir un aviso cuando alguien se postula o me asignan un trabajo para responder a tiempo."},
  @{t="TEC-05: Generar y distribuir el APK de prueba"; l="tecnica"; e="Base"; p="Should"; n=2; b="Configurar la generacion del APK y la forma de repartirlo al equipo y a los usuarios de prueba."},
  @{t="HU-20: Editar mi perfil"; l="historia"; e="Cuenta"; p="Should"; n=2; b="Como usuario, quiero editar mi perfil para mantener mis datos al dia."},
  @{t="HU-21: Listar mis habilidades en el perfil"; l="historia"; e="Cuenta"; p="Could"; n=2; b="Como persona que busca trabajo, quiero listar mis habilidades en el perfil para que me elijan por lo que se hacer."},
  @{t="HU-22: Aviso de calificacion pendiente"; l="historia"; e="Comunicacion"; p="Could"; n=3; b="Como usuario, quiero un aviso cuando tengo una calificacion pendiente para no olvidar calificar."},
  @{t="HU-23: Compartir un trabajo por WhatsApp"; l="historia"; e="Comunicacion"; p="Could"; n=2; b="Como hogar, quiero compartir mi trabajo por WhatsApp para que mas gente del barrio lo vea."},
  @{t="HU-24: Modo oscuro"; l="historia"; e="Base"; p="Could"; n=2; b="Como usuario, quiero un modo oscuro para usar la app de noche sin cansar la vista."}
)

$n = 0
foreach ($i in $items) {
  $n++
  Write-Host "[$n/$($items.Count)] $($i.t)"
  $cuerpo = "$($i.b)`n`nEpica: $($i.e) | Prioridad: $($i.p) | Puntos: $($i.n)"
  gh issue create --title $i.t --body $cuerpo --label $i.l --project $proyecto
}

Write-Host ""
Write-Host "Listo. Ahora corre .\scripts\llenar-campos.ps1 para llenar Tipo, Prioridad, Epica, Puntos y Status."
