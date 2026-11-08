import { Timestamp } from "firebase/firestore";

export type EstadoTrabajo =
  | "publicado" | "asignado" | "en_curso" | "terminado" | "cancelado";

export interface Usuario {
  id: string;
  nombre: string;
  fotoUrl?: string;
  barrio: string;
  habilidades: string[];
  ratingPromedio: number;
  ratingCount: number;
  aceptoPolitica: boolean;
  createdAt: Timestamp;
}

export interface Trabajo {
  id: string;
  publicadorId: string;
  publicadorNombre: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  barrio: string;
  fechaProgramada: Timestamp;
  precio: number;
  fotos: string[];
  estado: EstadoTrabajo;
  asignadoA: string | null;
  aceptoPublicador: boolean;
  aceptoTrabajador: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Calificacion {
  trabajoId: string;
  autorId: string;
  paraUid: string;
  estrellas: number;
  comentario: string;
  createdAt: Timestamp;
}
