# Frontend de Kamello Pa' Hoy

Responsable del frontend: Luzdey Natalia Marín. Backend: Luis Alejandro Toloza Mendoza. Base de datos: Luz Marina Sánchez Rodríguez. QA: Angel David Barbosa.

Todo funciona en **modo de prueba**: los servicios simulados reemplazan a Firebase y hacen el papel de la otra persona, así que el recorrido completo se puede mostrar en un solo celular mientras el backend avanza.

## El recorrido completo

```
Contratante                              Trabajador
───────────                              ──────────
Publica un trabajo  ──── Disponible ────  Lo ve en la lista y se postula
Ve los postulados y elige a uno
                    ──── Asignado ──────  «¡Te eligieron!» → acepta o rechaza
                                          (si rechaza, vuelve a Disponible · HU-26)
Ambos ven el celular del otro y se escriben por el chat
                    ──── En curso ──────
Marca el trabajo como terminado
                    ──── Terminado ─────
Califica al trabajador                    Califica al contratante
```

## Pantallas

| Issue | Pantalla | Archivo | Qué hace |
| --- | --- | --- | --- |
| FE-01 | Bienvenida, celular, código | `src/app/(acceso)/` | Acceso con celular y código SMS |
| FE-01 | Completa tu registro | `src/app/completar-registro.tsx` | Nombre, barrio y autorización de habeas data, con «Leer la política» y «Leer la ley» |
| FE-01 | Política de datos | `src/app/politica.tsx` | Borrador según la Ley 1581 de 2012 |
| FE-04 | Lista de trabajos (inicio) | `src/app/(app)/index.tsx` | Todos los disponibles, con los más cercanos primero, y los trabajos por calificar |
| FE-02 | Publicar un trabajo | `src/app/(app)/publicar.tsx` | Al publicar, abre el detalle para ver llegar a los postulados |
| FE-04 | Detalle del trabajo | `src/app/(app)/trabajo/[id].tsx` | Cambia según quién lo mira y el estado: postularse, elegir, aceptar o rechazar, contacto, terminar |
| — | Mis trabajos | `src/app/(app)/mis-trabajos.tsx` | Lo que publiqué y donde me postulé, con el estado de cada uno |
| FE-05 | Chat | `src/app/(app)/chat/[id].tsx` | Mensajes entre los dos, solo con el trabajo En curso |
| FE-06 | Calificar | `src/app/(app)/calificar/[id].tsx` | De 1 a 5 estrellas y comentario opcional, cuando el trabajo termina |

### «Los más cercanos a ti primero»

La lista muestra **todos** los trabajos disponibles: primero los del mismo barrio y después los demás, y dentro de cada grupo los más recientes arriba (`ordenarPorCercania` en `src/utils/trabajos.ts`). El barrio se compara sin tildes, mayúsculas ni espacios de más.

## Arquitectura (pantalla → hook → servicio)

```
src/app/…                       Pantallas: solo dibujan.
src/hooks/use-*.ts              ViewModels: estado, validación, llamadas al servicio.
src/servicios/auth/tipos.ts     Contrato de acceso y registro (ServicioAuth).
src/servicios/trabajos/tipos.ts Contrato de trabajos, postulaciones, contacto, chat y calificaciones (ServicioTrabajos).
src/servicios/*/index.ts        Eligen la implementación (hoy, la simulada).
src/sesion/                     Estado global de la sesión.
src/components/                 Botón, campos, casilla, chips, estrellas, tarjetas de trabajo y contacto, aviso.
src/utils/                      Validaciones, orden por cercanía, precios y mensajes de error.
__tests__/                      Pruebas con Jest.
```

## Datos públicos y privados

El celular nunca va en lo que ven otros usuarios.

| Documento en Firestore | Tipo | Quién lo puede leer |
| --- | --- | --- |
| `usuarios/{uid}` | `PerfilPublico`: nombre y barrio | Usuarios con sesión iniciada |
| `usuarios/{uid}/privado/datos` | `DatosPrivados`: celular y aceptación de la política | Solo el dueño de la cuenta |
| `trabajos/{id}` | `Trabajo`: datos del trabajo, estado, `publicadoPor` y `trabajador` (nombre y reputación, **sin celular**) | Usuarios con sesión iniciada |
| `trabajos/{id}/postulaciones` | quién se postuló | Solo el contratante (y cada quien la suya) |
| `trabajos/{id}/contacto` | `Contacto`: el celular de cada parte | Solo los dos participantes, y solo con el trabajo **En curso** |
| `trabajos/{id}/mensajes` | `Mensaje` | Solo los dos participantes |
| `calificaciones/{id}` | `NuevaCalificacion` | Usuarios con sesión iniciada |

## Probar sin Firebase

```bash
npm install
npx expo start      # luego presiona w para abrirla en el navegador
```

- Código del SMS: **123456**.
- **Como contratante:** publica un trabajo. A los 3 s se postulan Carlos Mantilla y Yesenia Ortiz. Elige a uno, y a los 3 s acepta: aparece su celular y se abre el chat. Escríbele y responde. Marca el trabajo como terminado y califícalo.
- **Como trabajador:** postúlate a un trabajo de ejemplo. A los 4 s te eligen. Puedes rechazar (vuelve a Disponible) o aceptar: ves el celular del contratante y se escriben.
- Las personas, los trabajos y los celulares (+57 300 000 00xx) son ejemplos inventados.

## Pruebas automáticas

```bash
npm test            # Jest: 35 pruebas
npx tsc --noEmit    # tipos
npx expo lint       # estilo
```

| Archivo | Qué comprueba |
| --- | --- |
| `validaciones.test.ts` | Celular, código, nombre y barrio |
| `mensajes-error.test.ts` | Cada error tiene un mensaje en español, sin términos de Firebase |
| `auth-simulado.test.ts` | Código, bloqueo al tercer intento, perfil público sin el celular |
| `use-completar-registro.test.tsx` | El celular y la autorización van a los datos privados |
| `trabajos.test.ts` | Orden por cercanía, precios y validaciones |
| `trabajos-simulado.test.ts` | Recorrido completo del contratante y del trabajador, rechazo (HU-26), celular oculto hasta En curso y otra vez al terminar, permisos del chat y de las calificaciones |

## Para Luis (backend): cómo conectar Firebase

1. Crea `src/servicios/auth/auth-firebase.ts` (`ServicioAuth`) y `src/servicios/trabajos/trabajos-firebase.ts` (`ServicioTrabajos`).
2. `escucharTrabajo` y `escucharMensajes` se implementan con `onSnapshot`; devuelven la función para dejar de escuchar.
3. `responderAsignacion(…, true)` pasa el trabajo a En curso **y** crea `trabajos/{id}/contacto` con los dos celulares, en un solo `writeBatch`. `marcarTerminado` lo pasa a Terminado y borra el contacto.
4. Errores que el usuario debe entender: `ErrorAuth` en el acceso, y `new Error('trabajo-no-disponible' | 'trabajo-propio' | 'accion-no-permitida' | 'mensaje-invalido' | 'estrellas-invalidas')` en trabajos.
5. En cada `index.ts`, cambia la línea del export y pon `UsandoAuthSimulado` / `UsandoTrabajosSimulados` en `false`.

Las reglas de Firestore las coordina con Luz Marina según la tabla de datos. Ninguna pantalla ni hook necesita cambiar.

**Ojo:** la verificación por SMS de Firebase en React Native suele necesitar un módulo nativo que Expo Go no trae. Con el APK (abajo) eso no es problema.

## Generar el APK

El proyecto ya trae `eas.json` con el perfil `preview`, que genera un APK, y el paquete Android `com.kamellopahoy.app`. El APK se construye en la nube de Expo: no hace falta Android Studio.

1. Crea una cuenta gratis en expo.dev.
2. En la terminal del proyecto:
   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest build -p android --profile preview
   ```
3. Responde **Y** cuando pregunte si crea el proyecto en EAS y si genera una nueva *keystore* de Android.
4. Espera a que termine (en el plan gratis puede tardar entre 10 y 30 minutos en cola). Al final te da un enlace y un QR para descargar el `.apk`.
5. En el Android, abre el enlace, descarga e instala. Si pregunta, permite «instalar apps de fuentes desconocidas».

Cada vez que cambie el código, se genera un APK nuevo con el mismo comando.

## Al subirlo a GitHub

Todo se trabaja desde un solo PC, así que el commit debe quedar a nombre de quien hizo el trabajo:

```bash
git commit -m "FE-01 a FE-06: acceso, trabajos, postulación, contacto, chat y calificaciones" --author="Luzdey Natalia Marín <correo-de-github>"
```

## Verificado

- `npx tsc --noEmit`, `npx expo lint` y `npm test` (35 pruebas) sin errores.
- En web a 360 dp, en modo claro y oscuro, los dos recorridos completos: contratante (publicar → postulados → elegir → acepta → contacto → chat con respuesta → terminar → calificar) y trabajador (postularse → te eligen → rechazar → postularse → aceptar → contacto → chat), más «Mis trabajos». Sin desbordamientos ni errores en consola.
- `npx expo prebuild --platform android` genera el proyecto Android sin errores con el paquete `com.kamellopahoy.app`.
- Falta: generar el APK con EAS y probarlo en el Android de un compañero.

## Pendiente

- Mi perfil y el perfil de otros (FE-03).
- Avisos (notificaciones) cuando te eligen o te escriben.
- Reportar o bloquear usuarios.
- Texto final de la política de datos y correo de contacto.
- Barrio escogido de una lista, en vez de escrito a mano.
- Ícono y pantalla de carga definitivos.
