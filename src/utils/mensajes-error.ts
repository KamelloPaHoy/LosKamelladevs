import { ErrorAuth, type CodigoErrorAuth } from '@/servicios/auth';

/** Mensajes en español claro: el usuario nunca ve errores técnicos de Firebase (DoD). */
const Mensajes: Record<CodigoErrorAuth, string> = {
  'celular-invalido': 'Ese número no parece un celular válido. Revísalo e inténtalo de nuevo.',
  'codigo-incorrecto': 'El código no coincide. Revisa el SMS e inténtalo de nuevo.',
  'codigo-vencido': 'Ese código ya venció. Pide uno nuevo.',
  'demasiados-intentos': 'Hiciste demasiados intentos. Espera unos minutos y pide un código nuevo.',
  'sin-conexion': 'No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.',
  desconocido: 'Algo salió mal. Inténtalo de nuevo en un momento.',
};

/** Errores de los trabajos que el usuario puede entender y corregir. */
const MensajesTrabajos: Record<string, string> = {
  'trabajo-no-disponible': 'Este trabajo ya no está disponible. Alguien más lo tomó o lo cancelaron.',
  'trabajo-propio': 'No puedes postularte a un trabajo que publicaste tú.',
  'estrellas-invalidas': 'Elige de 1 a 5 estrellas.',
};

export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorAuth) return Mensajes[error.codigo];
  if (error instanceof Error && MensajesTrabajos[error.message]) {
    return MensajesTrabajos[error.message];
  }
  return Mensajes.desconocido;
}
