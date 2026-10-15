# Kamello Pa' Hoy - Sprint 0: llena los campos del tablero (Tipo, Prioridad, Epica,
# Puntos y Status) de los 30 issues, segun docs/backlog.md.
#
# Antes de correrlo:
#   1. Haber corrido .\scripts\crear-backlog.ps1
#   2. Haber creado en el proyecto los campos Tipo, Prioridad, Epica y Puntos,
#      y las seis opciones de Status (Backlog, Listo, En desarrollo, En revision,
#      En dispositivo, Hecho). Los nombres pueden llevar tilde o no.
#   3. Cambiar $numero por el numero del proyecto (sale en la URL: .../projects/N).
#
# Ejecutar:
#   powershell -ExecutionPolicy Bypass -File .\scripts\llenar-campos.ps1
# Se puede correr varias veces sin danar nada: solo vuelve a poner los mismos valores.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$owner  = "KamelloPaHoy"
$numero = 1      # <-- CAMBIAR por el numero del proyecto

# ID = Tipo, Prioridad, Epica, Puntos
$datos = @{
  "TEC-01" = @("Tecnica","Must","Base",3)
  "INV-01" = @("Investigacion","Must","Base",2)
  "TEC-02" = @("Tecnica","Must","Base",3)
  "TEC-03" = @("Tecnica","Must","Base",2)
  "HU-01"  = @("Historia","Must","Cuenta",5)
  "HU-02"  = @("Historia","Must","Cuenta",2)
  "HU-03"  = @("Historia","Must","Cuenta",3)
  "HU-04"  = @("Historia","Must","Cuenta",3)
  "HU-05"  = @("Historia","Must","Publicar",5)
  "HU-06"  = @("Historia","Must","Contratar",3)
  "HU-07"  = @("Historia","Must","Contratar",2)
  "HU-08"  = @("Historia","Must","Contratar",3)
  "HU-09"  = @("Historia","Must","Contratar",5)
  "HU-10"  = @("Historia","Must","Contratar",5)
  "HU-11"  = @("Historia","Must","Confianza",5)
  "HU-12"  = @("Historia","Must","Confianza",2)
  "TEC-04" = @("Tecnica","Must","Confianza",5)
  "HU-13"  = @("Historia","Must","Confianza",5)
  "HU-14"  = @("Historia","Should","Contratar",5)
  "HU-15"  = @("Historia","Should","Publicar",3)
  "HU-16"  = @("Historia","Should","Publicar",3)
  "HU-17"  = @("Historia","Should","Confianza",5)
  "HU-18"  = @("Historia","Should","Comunicacion",8)
  "HU-19"  = @("Historia","Should","Comunicacion",5)
  "TEC-05" = @("Tecnica","Should","Base",2)
  "HU-20"  = @("Historia","Should","Cuenta",2)
  "HU-21"  = @("Historia","Could","Cuenta",2)
  "HU-22"  = @("Historia","Could","Comunicacion",3)
  "HU-23"  = @("Historia","Could","Comunicacion",2)
  "HU-24"  = @("Historia","Could","Base",2)
}

# Elementos del Sprint 1: quedan en "Listo"; el resto en "Backlog".
$sprint1 = @("HU-01","HU-05","HU-06","HU-08","HU-09")

# Quita tildes y mayusculas para comparar nombres ("Épica" = "epica").
function Normalizar([string]$s) {
  $d = $s.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object System.Text.StringBuilder
  foreach ($c in $d.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($c) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$sb.Append($c)
    }
  }
  return $sb.ToString().ToLower().Trim()
}

$proyecto = gh project view $numero --owner $owner --format json | Out-String | ConvertFrom-Json
if (-not $proyecto) { Write-Error "No encontre el proyecto $numero de $owner. Revisa `$numero."; exit 1 }
$projId = $proyecto.id
Write-Host "Proyecto: $($proyecto.title) ($projId)"

$campos = (gh project field-list $numero --owner $owner --format json --limit 100 | Out-String | ConvertFrom-Json).fields
$items  = (gh project item-list  $numero --owner $owner --format json --limit 200 | Out-String | ConvertFrom-Json).items

function Campo([string]$nombre) {
  $f = $campos | Where-Object { (Normalizar $_.name) -eq (Normalizar $nombre) } | Select-Object -First 1
  if (-not $f) { Write-Warning "Falta el campo '$nombre' en el proyecto." }
  return $f
}
function Opcion($campo, [string]$valor) {
  $o = $campo.options | Where-Object { (Normalizar $_.name) -eq (Normalizar $valor) } | Select-Object -First 1
  if (-not $o) { Write-Warning "El campo '$($campo.name)' no tiene la opcion '$valor'." ; return $null }
  return $o.id
}
function PonerOpcion($itemId, $campo, [string]$valor) {
  if (-not $campo) { return }
  $op = Opcion $campo $valor
  if ($op) { gh project item-edit --id $itemId --project-id $projId --field-id $campo.id --single-select-option-id $op | Out-Null }
}

$fTipo   = Campo "Tipo"
$fPrio   = Campo "Prioridad"
$fEpica  = Campo "Epica"
$fPuntos = Campo "Puntos"
$fStatus = Campo "Status"

$hechos = 0
foreach ($it in $items) {
  $titulo = if ($it.title) { $it.title } else { $it.content.title }
  if ($titulo -notmatch '^(HU|TEC|INV|BUG)-\d+') { continue }
  $id = $Matches[0]
  if (-not $datos.ContainsKey($id)) { Write-Warning "Sin datos para $id"; continue }
  $d = $datos[$id]
  Write-Host "$id  ->  $($d[0]) · $($d[1]) · $($d[2]) · $($d[3]) pts"

  PonerOpcion $it.id $fTipo  $d[0]
  PonerOpcion $it.id $fPrio  $d[1]
  PonerOpcion $it.id $fEpica $d[2]
  if ($fPuntos) {
    gh project item-edit --id $it.id --project-id $projId --field-id $fPuntos.id --number $d[3] | Out-Null
  }
  $estado = if ($sprint1 -contains $id) { "Listo" } else { "Backlog" }
  PonerOpcion $it.id $fStatus $estado
  $hechos++
}

Write-Host ""
Write-Host "Listo: $hechos tarjetas actualizadas. Falta poner a mano Sprint = Sprint 1 en HU-01, HU-05, HU-06, HU-08 y HU-09."
