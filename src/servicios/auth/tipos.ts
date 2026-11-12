/**
 * Contrato entre el frontend y el backend de autenticación.
 *
 * El frontend (pantallas y hooks) solo conoce este archivo.
 * El backend (ISSUE-BE-01) implementa ServicioAuth con Firebase Authentication
 * y Cloud Firestore, sin tocar las pantallas.
 */

export type UsuarioAuth = {
  uid: string;
  /** Celular en formato internacional: +573001234567 */
  celular: string;
};

/**
 * Lo que otros usuarios pueden ver.
 * Firestore: usuarios/{uid}
 */
export type PerfilPublico = {
  nombre: string;
  barrio: string;
};

/**
 * Lo que solo puede leer el dueño de la cuenta.
 * Firestore: usuarios/{uid}/privado/datos
 *
 * Va en un documento aparte porque las reglas de Firestore protegen
 * documentos completos, no campos sueltos: si el celular estuviera en
 * usuarios/{uid}, cualquiera que pueda ver el perfil vería también el número.
 */
export type DatosPrivados = {
  /** Celular en formato internacional: +573001234567 */
  celular: string;
  /** Fecha en que aceptó la política de tratamiento de datos (Ley 1581 de 2012). */
  aceptoPoliticaEn: string;
  /** Versión de la política que aceptó, para pedir una nueva aceptación si cambia. */
  versionPolitica: string;
};

export type RegistroNuevo = {
  publico: PerfilPublico;
  privado: DatosPrivados;
};

export type Verificacion = {
  /** Identificador que devuelve el proveedor al enviar el SMS (verificationId en Firebase). */
  id: string;
  celular: string;
  /** Momento del envío, en milisegundos, para el contador de reenvío. */
  enviadoEn: number;
};

export type CodigoErrorAuth =
  | 'celular-invalido'
  | 'codigo-incorrecto'
  | 'codigo-vencido'
  | 'demasiados-intentos'
  | 'sin-conexion'
  | 'desconocido';

export class ErrorAuth extends Error {
  constructor(public readonly codigo: CodigoErrorAuth) {
    super(codigo);
    this.name = 'ErrorAuth';
  }
}

export interface ServicioAuth {
  /** Envía el código por SMS. Lanza ErrorAuth si falla. */
  enviarCodigo(celular: string): Promise<Verificacion>;
  /** Confirma el código e inicia la sesión. Lanza ErrorAuth si falla. */
  confirmarCodigo(verificacion: Verificacion, codigo: string): Promise<UsuarioAuth>;
  /** Devuelve el perfil público, o null si todavía no completó el registro. */
  obtenerPerfil(uid: string): Promise<PerfilPublico | null>;
  /**
   * Guarda el perfil público y los datos privados.
   * Debe escribir los dos documentos juntos (writeBatch en Firebase):
   * o quedan los dos o ninguno.
   */
  completarRegistro(uid: string, registro: RegistroNuevo): Promise<void>;
  cerrarSesion(): Promise<void>;
  /** Avisa cada vez que cambia la sesión. Devuelve la función para dejar de escuchar. */
  escucharSesion(alCambiar: (usuario: UsuarioAuth | null) => void): () => void;
}
