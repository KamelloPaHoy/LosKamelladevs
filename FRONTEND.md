# Frontend de Kamello Pa' Hoy

Responsable del frontend: Luzdey Natalia Marín. Backend: Luis Alejandro Toloza Mendoza. Base de datos: Luz Marina Sánchez Rodríguez. QA: Angel David Barbosa.

Todo funciona en **modo de prueba**: los servicios simulados reemplazan a Firebase, así que la app se puede mostrar completa mientras el backend avanza.

## Qué hay

| Issue | Pantalla | Archivo | Qué hace |
| --- | --- | --- | --- |
| FE-01 | Bienvenida | `src/app/(acceso)/index.tsx` | Presenta la app y lleva al acceso |
| FE-01 | Tu celular | `src/app/(acceso)/celular.tsx` | 10 dígitos que empiezan por 3; se muestra como 300 123 4567 |
| FE-01 | Código del SMS | `src/app/(acceso)/codigo.tsx` | 6 números; se confirma solo; reenvío cada 60 s |
| FE-01 | Completa tu registro | `src/app/completar-registro.tsx` | Nombre, barrio y autorización de habeas data, con «Leer la política» y «Leer la ley» |
| FE-01 | Política de datos | `src/app/politica.tsx` | Borrador según la Ley 1581 de 2012, con enlace al texto oficial |
| FE-04 | Inicio: lista de trabajos | `src/app/(app)/index.tsx` | Todos los trabajos disponibles, con los más cercanos primero; estados de cargando, error, vacía y con datos |
| FE-04 | Detalle del trabajo | `src/app/(app)/trabajo/[id].tsx` | Descripción, quién lo publicó y su reputación, y el botón «Postularme» |
| FE-02 | Publicar un trabajo | `src/app/(app)/publicar.tsx` | Qué necesita, categoría, descripción, pago (de $5.000 a $2.000.000), para cuándo y barrio |
| FE-06 | Calificar | `src/app/(app)/calificar/[id].tsx` | De 1 a 5 estrellas y comentario opcional, al terminar un trabajo |

La navegación la decide la sesión (`src/app/_layout.tsx`, con `Stack.Protected`):

- **Sin sesión:** bienvenida → celular → código.
- **Con sesión y sin perfil:** completar registro (solo la primera vez).
- **Con sesión y con perfil:** lista de trabajos.

### «Los más cercanos a ti primero»

La lista muestra **todos** los trabajos disponibles. Primero van los del mismo barrio de la persona y después los de otros barrios; dentro de cada grupo, los más recientes arriba (`ordenarPorCercania` en `src/utils/trabajos.ts`).

El barrio se compara sin tildes, mayúsculas ni espacios de más: «El Centro» y «el centro» cuentan como el mismo. Para que funcione mejor con usuarios reales, conviene que el barrio se escoja de una lista en vez de escribirlo.

## Arquitectura (pantalla → hook → servicio)

```
src/app/…                       Pantallas: solo dibujan.
src/hooks/use-*.ts              ViewModels: estado, validación, llamadas al servicio.
src/servicios/auth/tipos.ts     Contrato de acceso y registro (ServicioAuth).
src/servicios/trabajos/tipos.ts Contrato de trabajos (ServicioTrabajos).
src/servicios/*/index.ts        Eligen la implementación (hoy, la simulada).
src/sesion/                     Estado global de la sesión.
src/components/                 Botón, campos, casilla, chips, estrellas, tarjeta de trabajo, aviso.
src/utils/                      Validaciones, orden por cercanía, precios y mensajes de error.
__tests__/                      Pruebas con Jest.
```

## Datos públicos y privados

Así lo aprobó el equipo: el celular nunca va en lo que ven otros usuarios.

| Documento en Firestore | Tipo | Campos | Quién lo puede leer |
| --- | --- | --- | --- |
| `usuarios/{uid}` | `PerfilPublico` | `nombre`, `barrio` | Usuarios con sesión iniciada |
| `usuarios/{uid}/privado/datos` | `DatosPrivados` | `celular`, `aceptoPoliticaEn`, `versionPolitica` | Solo el dueño de la cuenta |
| `trabajos/{id}` | `Trabajo` | título, descripción, categoría, barrio, precio, cuándo, estado, `publicadoPor` (nombre y reputación, **sin celular**) | Usuarios con sesión iniciada |

Va en documentos aparte porque las reglas de Firestore protegen documentos completos, no campos sueltos.

## Probar sin Firebase

```bash
npm install
npx expo start      # luego presiona w para abrirla en el navegador
```

- El código correcto es **123456**. **000000** simula un código vencido. El celular **300 000 0000** simula «sin conexión».
- La lista trae 6 trabajos de ejemplo (personas inventadas): 2 en el barrio con el que te registras y 4 en otros barrios.
- Siempre hay un trabajo terminado («Arreglar la llave del baño») listo para calificar.

## Pruebas automáticas

```bash
npm test            # Jest: 33 pruebas
npx tsc --noEmit    # tipos
npx expo lint       # estilo
```

| Archivo | Qué comprueba |
| --- | --- |
| `validaciones.test.ts` | Celular, código, nombre (con tildes y ñ) y barrio |
| `mensajes-error.test.ts` | Cada error tiene un mensaje en español, sin términos de Firebase |
| `auth-simulado.test.ts` | Envío y confirmación del código, bloqueo al tercer intento, perfil público sin el celular |
| `use-completar-registro.test.tsx` | No guarda nada si faltan datos, y manda el celular y la autorización a los datos privados |
| `trabajos.test.ts` | Orden por cercanía, barrios con tildes o mayúsculas, precios y validaciones de publicar y calificar |
| `trabajos-simulado.test.ts` | Publicar, postularse (no a un trabajo propio), calificar y rechazar estrellas fuera de 1 a 5 |

## Para Luis (backend): cómo conectar Firebase

**Acceso (BE-01)**

1. Crea `src/servicios/auth/auth-firebase.ts` que implemente `ServicioAuth`.
2. `completarRegistro(uid, { publico, privado })` escribe los dos documentos de usuario **en un solo `writeBatch`**. `obtenerPerfil` lee solo `usuarios/{uid}`.
3. Convierte los errores de Firebase en `ErrorAuth`: `celular-invalido`, `codigo-incorrecto`, `codigo-vencido`, `demasiados-intentos`, `sin-conexion` o `desconocido`.
4. En `src/servicios/auth/index.ts`, cambia la línea del export y pon `UsandoAuthSimulado = false`.

**Trabajos (BE-03, BE-04)**

1. Crea `src/servicios/trabajos/trabajos-firebase.ts` que implemente `ServicioTrabajos`.
2. `listarDisponibles` trae los trabajos con estado `Disponible`; el orden lo pone el frontend.
3. Para los errores que el usuario debe entender, lanza `new Error('trabajo-no-disponible')`, `new Error('trabajo-propio')` o `new Error('estrellas-invalidas')`.
4. En `src/servicios/trabajos/index.ts`, cambia la línea del export y pon `UsandoTrabajosSimulados = false`.

Coordina las reglas con Luz Marina (DB-01 a DB-04) según la tabla de datos. Ninguna pantalla ni hook necesita cambiar.

**Ojo:** la verificación por SMS de Firebase con React Native suele necesitar un módulo nativo, y Expo Go no lo trae. Si es así, hay que probar con un *development build* (`eas build --profile development`).

## Al subirlo a GitHub

Todo se trabaja desde un solo PC, así que el commit debe quedar a nombre de quien hizo el trabajo:

```bash
git commit -m "FE-01, FE-02, FE-04, FE-06: acceso, publicar, lista y calificar" --author="Luzdey Natalia Marín <correo-de-github>"
```

## Verificado

- `npx tsc --noEmit`, `npx expo lint` y `npm test` (33 pruebas) sin errores.
- Flujo completo en web a 360 dp, en modo claro y oscuro: acceso → registro → lista (cercanos primero) → detalle → postularse → publicar con errores → publicar completo (aparece primero) → calificar sin estrellas → calificar con 4 estrellas y comentario → salir. Sin desbordamientos ni errores en consola.
- Falta: probarlo en el Android de un compañero con Expo Go para SDK 57 (DoD, columna «En dispositivo»).

## Pendiente

- Texto final de la política de datos y correo de contacto (`src/app/politica.tsx`).
- Barrio escogido de una lista, en vez de escrito a mano.
- Ícono y pantalla de carga definitivos de la app.
