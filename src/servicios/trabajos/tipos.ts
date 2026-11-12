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
  /** Fecha de publicación en ISO 8601. */
  creadoEn: string;
};

export type NuevoTrabajo = Pick<
  Trabajo,
  'titulo' | 'descripcion' | 'categoria' | 'barrio' | 'precio' | 'cuando'
>;

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
  /** Trabajos en estado Disponible, de cualquier barrio. El orden lo pone el frontend. */
  listarDisponibles(): Promise<Trabajo[]>;
  obtener(id: string): Promise<Trabajo | null>;
  publicar(autor: PersonaPublica, nuevo: NuevoTrabajo): Promise<Trabajo>;
  postularse(trabajoId: string, uid: string): Promise<void>;
  /** true si esa persona ya se postuló a ese trabajo. */
  yaSePostulo(trabajoId: string, uid: string): Promise<boolean>;
  listarPendientesDeCalificar(uid: string): Promise<PendienteDeCalificar[]>;
  calificar(calificacion: NuevaCalificacion): Promise<void>;
}
