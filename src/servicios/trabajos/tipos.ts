/**
 * Contrato entre el frontend y el backend de trabajos (publicar, listar, postularse, calificar).
 *
 * El frontend solo conoce este archivo. El backend (BE-03, BE-04) implementa
 * ServicioTrabajos con Cloud Firestore sin tocar las pantallas.
 */

export const Categorias = [
  'Pintura',
  'Plomería',
  'Electricidad',
  'Aseo',
  'Mandados',
  'Jardinería',
  'Otro',
] as const;
export type Categoria = (typeof Categorias)[number];

export const Cuandos = ['Hoy', 'Mañana', 'Esta semana'] as const;
export type Cuando = (typeof Cuandos)[number];

/** Estados aprobados por el equipo. */
export type EstadoTrabajo = 'Disponible' | 'Asignado' | 'En curso' | 'Terminado' | 'Cancelado';

/** Lo que se muestra públicamente de una persona (nunca el celular). */
export type PersonaPublica = {
  uid: string;
  nombre: string;
  /** Promedio de 1 a 5, o null si todavía no tiene calificaciones. */
  promedio: number | null;
  totalCalificaciones: number;
};

export type Trabajo = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  barrio: string;
  /** Pago ofrecido en pesos colombianos, sin decimales. */
  precio: number;
  cuando: Cuando;
  estado: EstadoTrabajo;
  publicadoPor: PersonaPublica;
  /** Quien hace el trabajo, desde que el contratante lo elige. null mientras está Disponible. */
  trabajador: PersonaPublica | null;
  /** Fecha de publicación en ISO 8601. */
  creadoEn: string;
};

export type NuevoTrabajo = Pick<
  Trabajo,
  'titulo' | 'descripcion' | 'categoria' | 'barrio' | 'precio' | 'cuando'
>;

/** Los trabajos de una persona, en sus dos papeles. */
export type MisTrabajos = {
  /** Los que publicó (papel de contratante). */
  publicados: Trabajo[];
  /** Aquellos a los que se postuló o en los que la eligieron (papel de trabajador). */
  comoTrabajador: Trabajo[];
};

/**
 * El celular de la otra parte. Solo existe cuando el trabajo está En curso,
 * es decir, cuando el contratante eligió y el trabajador aceptó (HU-13).
 * Firestore: trabajos/{id}/contacto
 */
export type Contacto = {
  nombre: string;
  /** Formato internacional: +573001234567 */
  celular: string;
};

export type Mensaje = {
  id: string;
  deUid: string;
  texto: string;
  /** ISO 8601 */
  enviadoEn: string;
};

/** Un trabajo terminado en el que la persona aún no ha calificado a la otra parte. */
export type PendienteDeCalificar = {
  trabajo: Trabajo;
  /** A quién se califica: el trabajador si soy quien contrató, o al revés. */
  calificado: PersonaPublica;
};

export type NuevaCalificacion = {
  trabajoId: string;
  deUid: string;
  paraUid: string;
  /** De 1 a 5. */
  estrellas: number;
  comentario: string;
};

export interface ServicioTrabajos {
  /**
   * Avisa cada vez que cambia el trabajo (estado, trabajador). Devuelve la función para dejar
   * de escuchar. En Firebase: onSnapshot del documento.
   */
  escucharTrabajo(id: string, alCambiar: (trabajo: Trabajo | null) => void): () => void;
  /** Trabajos en estado Disponible, de cualquier barrio. El orden lo pone el frontend. */
  listarDisponibles(): Promise<Trabajo[]>;
  obtener(id: string): Promise<Trabajo | null>;
  publicar(autor: PersonaPublica, nuevo: NuevoTrabajo): Promise<Trabajo>;
  postularse(trabajoId: string, uid: string): Promise<void>;
  /** true si esa persona ya se postuló a ese trabajo. */
  yaSePostulo(trabajoId: string, uid: string): Promise<boolean>;
  listarMisTrabajos(uid: string): Promise<MisTrabajos>;
  /** Solo el contratante puede ver quiénes se postularon. */
  listarPostulados(trabajoId: string, contratanteUid: string): Promise<PersonaPublica[]>;
  /** El contratante elige a un postulado: Disponible → Asignado. */
  elegir(trabajoId: string, contratanteUid: string, trabajadorUid: string): Promise<void>;
  /**
   * El trabajador elegido responde. Acepta: Asignado → En curso (se crea el contacto).
   * Rechaza: Asignado → Disponible (HU-26).
   */
  responderAsignacion(trabajoId: string, trabajadorUid: string, acepta: boolean): Promise<void>;
  /** El contratante da el trabajo por terminado: En curso → Terminado. */
  marcarTerminado(trabajoId: string, contratanteUid: string): Promise<void>;
  /** El celular de la otra parte, o null si el trabajo no está En curso o no participa. */
  obtenerContacto(trabajoId: string, uid: string): Promise<Contacto | null>;
  /** Mensajes del chat del trabajo, del más viejo al más nuevo. En Firebase: onSnapshot. */
  escucharMensajes(trabajoId: string, alCambiar: (mensajes: Mensaje[]) => void): () => void;
  /** Solo los dos participantes pueden escribir, y solo con el trabajo En curso. */
  enviarMensaje(trabajoId: string, deUid: string, texto: string): Promise<void>;
  listarPendientesDeCalificar(uid: string): Promise<PendienteDeCalificar[]>;
  calificar(calificacion: NuevaCalificacion): Promise<void>;
}
