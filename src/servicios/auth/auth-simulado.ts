/**
 * Servicio de autenticación SIMULADO para construir y probar el frontend
 * sin Firebase. No envía SMS reales ni guarda nada fuera de la memoria.
 *
 * Para probar:
 *   - Código correcto: 123456
 *   - Código vencido:  000000
 *   - Celular 3000000000 simula «sin conexión» al enviar el SMS.
 *   - Tres códigos incorrectos seguidos bloquean como lo hace Firebase.
 *
 * El backend lo reemplaza por auth-firebase.ts (ver src/servicios/auth/index.ts).
 */
import {
  ErrorAuth,
  type DatosPrivados,
  type PerfilPublico,
  type ServicioAuth,
  type UsuarioAuth,
  type Verificacion,
} from './tipos';

export const CodigoDePrueba = '123456';

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

let usuarioActual: UsuarioAuth | null = null;
let intentosFallidos = 0;
const perfiles = new Map<string, PerfilPublico>();
const privados = new Map<string, DatosPrivados>();
const oyentes = new Set<(usuario: UsuarioAuth | null) => void>();

function avisar() {
  oyentes.forEach((oyente) => oyente(usuarioActual));
}

export const servicioAuthSimulado: ServicioAuth = {
  async enviarCodigo(celular) {
    await esperar(900);
    if (!/^\+573\d{9}$/.test(celular)) throw new ErrorAuth('celular-invalido');
    if (celular === '+573000000000') throw new ErrorAuth('sin-conexion');
    intentosFallidos = 0;
    return { id: `sim-${Date.now()}`, celular, enviadoEn: Date.now() };
  },

  async confirmarCodigo(verificacion: Verificacion, codigo) {
    await esperar(700);
    if (intentosFallidos >= 3) throw new ErrorAuth('demasiados-intentos');
    if (codigo === '000000') throw new ErrorAuth('codigo-vencido');
    if (codigo !== CodigoDePrueba) {
      intentosFallidos += 1;
      throw new ErrorAuth(intentosFallidos >= 3 ? 'demasiados-intentos' : 'codigo-incorrecto');
    }
    usuarioActual = { uid: `uid-${verificacion.celular.slice(-4)}`, celular: verificacion.celular };
    avisar();
    return usuarioActual;
  },

  async obtenerPerfil(uid) {
    await esperar(300);
    return perfiles.get(uid) ?? null;
  },

  async completarRegistro(uid, { publico, privado }) {
    await esperar(600);
    perfiles.set(uid, publico);
    privados.set(uid, privado);
  },

  async cerrarSesion() {
    usuarioActual = null;
    avisar();
  },

  escucharSesion(alCambiar) {
    oyentes.add(alCambiar);
    alCambiar(usuarioActual);
    return () => {
      oyentes.delete(alCambiar);
    };
  },
};

/** Solo para pruebas: deja el servicio simulado como recién abierto. */
export function reiniciarSimulado() {
  usuarioActual = null;
  intentosFallidos = 0;
  perfiles.clear();
  privados.clear();
  oyentes.clear();
}

/** Solo para pruebas: lee los datos privados guardados. */
export function leerPrivadoSimulado(uid: string): DatosPrivados | undefined {
  return privados.get(uid);
}

/** Solo para el modo de prueba: el barrio de quien tiene la sesión abierta (para sembrar ejemplos cercanos). */
export function barrioActualSimulado(): string | null {
  if (!usuarioActual) return null;
  return perfiles.get(usuarioActual.uid)?.barrio ?? null;
}
