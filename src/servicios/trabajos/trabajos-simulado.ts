/**
 * Servicio de trabajos SIMULADO: datos de ejemplo en memoria para construir y mostrar
 * el frontend sin Firebase. Las personas y los trabajos de ejemplo son inventados.
 *
 * Al abrir la lista por primera vez se siembran 6 trabajos: 2 en el barrio de quien
 * tiene la sesión (para ver el orden por cercanía) y 4 en otros barrios. También queda
 * 1 trabajo terminado pendiente de calificar.
 *
 * El backend lo reemplaza por trabajos-firebase.ts (ver src/servicios/trabajos/index.ts).
 */
import { barrioActualSimulado } from '@/servicios/auth/auth-simulado';

import type {
  NuevaCalificacion,
  PendienteDeCalificar,
  PersonaPublica,
  ServicioTrabajos,
  Trabajo,
} from './tipos';

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

let trabajos: Trabajo[] = [];
let pendientes = new Map<string, PendienteDeCalificar[]>();
let postulaciones = new Set<string>();
let calificaciones: NuevaCalificacion[] = [];
let sembrado = false;
let contador = 0;

const persona = (
  uid: string,
  nombre: string,
  promedio: number | null,
  total: number,
): PersonaPublica => ({ uid, nombre, promedio, totalCalificaciones: total });

const haceMinutos = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

function sembrar() {
  if (sembrado) return;
  sembrado = true;
  const miBarrio = barrioActualSimulado() ?? 'Comuna 2';
  const ejemplo = (t: Omit<Trabajo, 'id' | 'estado'>): Trabajo => ({
    ...t,
    id: `ej-${++contador}`,
    estado: 'Disponible',
  });
  trabajos = [
    ejemplo({
      titulo: 'Llevar unos documentos a la notaría',
      descripcion:
        'Recoger un sobre en mi casa y llevarlo a la notaría antes de las 11 a. m. Pago el transporte aparte.',
      categoria: 'Mandados',
      barrio: 'Comuna 1',
      precio: 15000,
      cuando: 'Hoy',
      publicadoPor: persona('ej-andres', 'Andrés Gómez', 5, 3),
      creadoEn: haceMinutos(8),
    }),
    ejemplo({
      titulo: 'Pintar la reja del frente',
      descripcion:
        'Reja de 4 metros, hay que lijar el óxido y dar dos manos de anticorrosivo. Yo pongo la pintura.',
      categoria: 'Pintura',
      barrio: miBarrio,
      precio: 80000,
      cuando: 'Hoy',
      publicadoPor: persona('ej-marta', 'Marta Rueda', 4.7, 9),
      creadoEn: haceMinutos(25),
    }),
    ejemplo({
      titulo: 'Instalar dos tomacorrientes en la sala',
      descripcion:
        'Ya tengo los tomacorrientes y el cable. Necesito a alguien que sepa de electricidad y traiga herramienta.',
      categoria: 'Electricidad',
      barrio: 'Comuna 3',
      precio: 60000,
      cuando: 'Mañana',
      publicadoPor: persona('ej-rosa', 'Rosa Peña', 4.9, 15),
      creadoEn: haceMinutos(40),
    }),
    ejemplo({
      titulo: 'Destapar el lavaplatos de la cocina',
      descripcion:
        'El agua no baja desde ayer. Necesito a alguien con sonda o la herramienta para destapar.',
      categoria: 'Plomería',
      barrio: miBarrio,
      precio: 40000,
      cuando: 'Hoy',
      publicadoPor: persona('ej-jorge', 'Jorge Ardila', null, 0),
      creadoEn: haceMinutos(70),
    }),
    ejemplo({
      titulo: 'Aseo general de apartamento',
      descripcion:
        'Apartamento de 2 habitaciones y un baño. Hay que barrer, trapear, limpiar cocina y baño. Yo pongo los productos.',
      categoria: 'Aseo',
      barrio: 'Comuna 5',
      precio: 70000,
      cuando: 'Mañana',
      publicadoPor: persona('ej-diana', 'Diana Pinzón', 4.5, 6),
      creadoEn: haceMinutos(120),
    }),
    ejemplo({
      titulo: 'Podar el patio y recoger la hoja',
      descripcion:
        'Patio de unos 30 m² con dos matas grandes de mango. Hay que podar y sacar la hoja en bolsas.',
      categoria: 'Jardinería',
      barrio: 'Comuna 7',
      precio: 50000,
      cuando: 'Esta semana',
      publicadoPor: persona('ej-hernan', 'Hernán Quintero', 4.2, 4),
      creadoEn: haceMinutos(300),
    }),
  ];
}

function pendientesDe(uid: string): PendienteDeCalificar[] {
  if (!pendientes.has(uid)) {
    // Un trabajo terminado de ejemplo: la persona contrató y le falta calificar al trabajador.
    pendientes.set(uid, [
      {
        trabajo: {
          id: `ej-terminado-${uid}`,
          titulo: 'Arreglar la llave del baño',
          descripcion: 'La llave del lavamanos goteaba. Se cambió el empaque.',
          categoria: 'Plomería',
          barrio: barrioActualSimulado() ?? 'Comuna 2',
          precio: 35000,
          cuando: 'Hoy',
          estado: 'Terminado',
          publicadoPor: persona(uid, 'Tú', null, 0),
          creadoEn: haceMinutos(60 * 26),
        },
        calificado: persona('ej-carlos', 'Carlos Mantilla', 4.8, 21),
      },
    ]);
  }
  return pendientes.get(uid)!;
}

export const servicioTrabajosSimulado: ServicioTrabajos = {
  async listarDisponibles() {
    await esperar(500);
    sembrar();
    return trabajos.filter((t) => t.estado === 'Disponible');
  },

  async obtener(id) {
    await esperar(200);
    sembrar();
    return trabajos.find((t) => t.id === id) ?? null;
  },

  async publicar(autor, nuevo) {
    await esperar(600);
    sembrar();
    const trabajo: Trabajo = {
      ...nuevo,
      id: `tr-${++contador}`,
      estado: 'Disponible',
      publicadoPor: autor,
      creadoEn: new Date().toISOString(),
    };
    trabajos = [trabajo, ...trabajos];
    return trabajo;
  },

  async postularse(trabajoId, uid) {
    await esperar(500);
    const trabajo = trabajos.find((t) => t.id === trabajoId);
    if (!trabajo || trabajo.estado !== 'Disponible') throw new Error('trabajo-no-disponible');
    if (trabajo.publicadoPor.uid === uid) throw new Error('trabajo-propio');
    postulaciones.add(`${trabajoId}:${uid}`);
  },

  async yaSePostulo(trabajoId, uid) {
    return postulaciones.has(`${trabajoId}:${uid}`);
  },

  async listarPendientesDeCalificar(uid) {
    await esperar(300);
    return [...pendientesDe(uid)];
  },

  async calificar(calificacion) {
    await esperar(600);
    const { estrellas, deUid, trabajoId } = calificacion;
    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
      throw new Error('estrellas-invalidas');
    }
    calificaciones.push(calificacion);
    pendientes.set(
      deUid,
      pendientesDe(deUid).filter((p) => p.trabajo.id !== trabajoId),
    );
  },
};

/** Solo para pruebas. */
export function reiniciarTrabajosSimulado() {
  trabajos = [];
  pendientes = new Map();
  postulaciones = new Set();
  calificaciones = [];
  sembrado = false;
  contador = 0;
}

/** Solo para pruebas. */
export function leerCalificacionesSimulado(): NuevaCalificacion[] {
  return [...calificaciones];
}
