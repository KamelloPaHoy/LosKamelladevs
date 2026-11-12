/**
 * Servicio de trabajos SIMULADO: datos de ejemplo en memoria para construir y mostrar
 * el frontend sin Firebase. Las personas, los trabajos y los celulares de ejemplo son inventados.
 *
 * Como en la demo solo hay una persona, el servicio hace el papel de la otra parte:
 *   - Si publicas un trabajo, a los 3 s se postulan dos personas de ejemplo.
 *   - Si eliges a una de ellas, a los 3 s acepta y el trabajo pasa a En curso.
 *   - Si te postulas a un trabajo de ejemplo, a los 4 s el contratante te elige.
 *   - En el chat, la otra parte responde una vez, 2 s después de tu primer mensaje.
 *
 * El backend lo reemplaza por trabajos-firebase.ts (ver src/servicios/trabajos/index.ts).
 */
import { barrioActualSimulado, usuarioActualSimulado } from '@/servicios/auth/auth-simulado';

import type {
  Contacto,
  Mensaje,
  NuevaCalificacion,
  PendienteDeCalificar,
  PersonaPublica,
  ServicioTrabajos,
  Trabajo,
} from './tipos';

/** Tiempos de la simulación, en milisegundos. */
export const TiemposSimulados = {
  postulantesLlegan: 3000,
  trabajadorAcepta: 3000,
  contratanteElige: 4000,
  respuestaChat: 2000,
};

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));
const esEjemplo = (uid: string) => uid.startsWith('ej-');

type Postulacion = { persona: PersonaPublica; en: number };

let trabajos: Trabajo[] = [];
let postulaciones = new Map<string, Postulacion[]>();
let asignadoEn = new Map<string, number>();
let mensajes = new Map<string, Mensaje[]>();
let respuestaPendiente = new Map<string, number>();
let respondidos = new Set<string>();
let postulantesSembrados = new Set<string>();
let calificaciones: NuevaCalificacion[] = [];
let sembrado = false;
let contador = 0;

const persona = (
  uid: string,
  nombre: string,
  promedio: number | null,
  total: number,
): PersonaPublica => ({ uid, nombre, promedio, totalCalificaciones: total });

/** Celulares de ejemplo: números de relleno, no de personas reales. */
const celularesEjemplo: Record<string, string> = {
  'ej-andres': '+573000000011',
  'ej-marta': '+573000000012',
  'ej-rosa': '+573000000013',
  'ej-jorge': '+573000000014',
  'ej-diana': '+573000000015',
  'ej-hernan': '+573000000016',
  'ej-carlos': '+573000000021',
  'ej-yesenia': '+573000000022',
};

const PostulantesEjemplo = [
  persona('ej-carlos', 'Carlos Mantilla', 4.8, 21),
  persona('ej-yesenia', 'Yesenia Ortiz', null, 0),
];

const haceMinutos = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

function yo(uid: string): PersonaPublica {
  const actual = usuarioActualSimulado();
  return persona(uid, actual?.uid === uid ? actual.nombre : 'Tú', null, 0);
}

function celularDe(uid: string): string {
  if (celularesEjemplo[uid]) return celularesEjemplo[uid];
  const actual = usuarioActualSimulado();
  return actual?.uid === uid ? actual.celular : '+573001234567';
}

function sembrar() {
  if (sembrado) return;
  sembrado = true;
  const miBarrio = barrioActualSimulado() ?? 'Comuna 2';
  const ejemplo = (t: Omit<Trabajo, 'id' | 'estado' | 'trabajador'>): Trabajo => ({
    ...t,
    id: `ej-${++contador}`,
    estado: 'Disponible',
    trabajador: null,
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

const buscar = (id: string) => trabajos.find((t) => t.id === id);

function reemplazar(actualizado: Trabajo) {
  trabajos = trabajos.map((t) => (t.id === actualizado.id ? actualizado : t));
}

function participa(t: Trabajo, uid: string) {
  return t.publicadoPor.uid === uid || t.trabajador?.uid === uid;
}

/** La otra parte del trabajo, vista desde uid. */
function otraParte(t: Trabajo, uid: string): PersonaPublica | null {
  if (t.publicadoPor.uid === uid) return t.trabajador;
  if (t.trabajador?.uid === uid) return t.publicadoPor;
  return null;
}

/** Aplica lo que la otra parte (simulada) habría hecho con el paso del tiempo. */
function avanzar() {
  sembrar();
  const ahora = Date.now();
  for (const t of trabajos) {
    const lista = postulaciones.get(t.id) ?? [];

    // Llegan postulantes a los trabajos que publicó la persona real.
    if (
      t.estado === 'Disponible' &&
      !esEjemplo(t.publicadoPor.uid) &&
      !postulantesSembrados.has(t.id) &&
      ahora - Date.parse(t.creadoEn) >= TiemposSimulados.postulantesLlegan
    ) {
      postulantesSembrados.add(t.id);
      postulaciones.set(t.id, [...lista, ...PostulantesEjemplo.map((p) => ({ persona: p, en: ahora }))]);
    }

    // El contratante de ejemplo elige a la persona real que se postuló.
    if (t.estado === 'Disponible' && esEjemplo(t.publicadoPor.uid)) {
      const real = lista.find(
        (p) => !esEjemplo(p.persona.uid) && ahora - p.en >= TiemposSimulados.contratanteElige,
      );
      if (real) {
        reemplazar({ ...t, estado: 'Asignado', trabajador: real.persona });
        asignadoEn.set(t.id, ahora);
      }
    }

    // El trabajador de ejemplo acepta la asignación.
    if (
      t.estado === 'Asignado' &&
      t.trabajador &&
      esEjemplo(t.trabajador.uid) &&
      ahora - (asignadoEn.get(t.id) ?? ahora) >= TiemposSimulados.trabajadorAcepta
    ) {
      reemplazar({ ...t, estado: 'En curso' });
    }
  }

  // La otra parte responde en el chat.
  for (const [trabajoId, desde] of respuestaPendiente) {
    if (ahora - desde < TiemposSimulados.respuestaChat) continue;
    respuestaPendiente.delete(trabajoId);
    const t = buscar(trabajoId);
    if (!t || t.estado !== 'En curso' || !t.trabajador) continue;
    const contratanteEsEjemplo = esEjemplo(t.publicadoPor.uid);
    const deUid = contratanteEsEjemplo ? t.publicadoPor.uid : t.trabajador.uid;
    const texto = contratanteEsEjemplo
      ? '¡Hola! Gracias por aceptar. Te espero en la casa; cuando llegues me timbras.'
      : '¡Hola! Ya vi los detalles. Puedo llegar mañana a las 8 a. m. ¿Le sirve?';
    agregarMensaje(trabajoId, deUid, texto);
  }
}

function agregarMensaje(trabajoId: string, deUid: string, texto: string) {
  const lista = mensajes.get(trabajoId) ?? [];
  mensajes.set(trabajoId, [
    ...lista,
    { id: `m-${++contador}`, deUid, texto, enviadoEn: new Date().toISOString() },
  ]);
}

function noPermitido(): never {
  throw new Error('accion-no-permitida');
}

/** Escucha por sondeo: en Firebase esto lo hace onSnapshot. */
function escuchar<T>(leer: () => T, alCambiar: (valor: T) => void, cadaMs: number) {
  let ultimo = '';
  const revisar = () => {
    avanzar();
    const valor = leer();
    const huella = JSON.stringify(valor);
    if (huella !== ultimo) {
      ultimo = huella;
      alCambiar(valor);
    }
  };
  revisar();
  const intervalo = setInterval(revisar, cadaMs);
  return () => clearInterval(intervalo);
}

export const servicioTrabajosSimulado: ServicioTrabajos = {
  escucharTrabajo(id, alCambiar) {
    return escuchar(() => buscar(id) ?? null, alCambiar, 1000);
  },

  async listarDisponibles() {
    await esperar(500);
    avanzar();
    return trabajos.filter((t) => t.estado === 'Disponible');
  },

  async obtener(id) {
    await esperar(200);
    avanzar();
    return buscar(id) ?? null;
  },

  async publicar(autor, nuevo) {
    await esperar(600);
    sembrar();
    const trabajo: Trabajo = {
      ...nuevo,
      id: `tr-${++contador}`,
      estado: 'Disponible',
      publicadoPor: autor,
      trabajador: null,
      creadoEn: new Date().toISOString(),
    };
    trabajos = [trabajo, ...trabajos];
    return trabajo;
  },

  async postularse(trabajoId, uid) {
    await esperar(500);
    avanzar();
    const t = buscar(trabajoId);
    if (!t || t.estado !== 'Disponible') throw new Error('trabajo-no-disponible');
    if (t.publicadoPor.uid === uid) throw new Error('trabajo-propio');
    const lista = postulaciones.get(trabajoId) ?? [];
    if (!lista.some((p) => p.persona.uid === uid)) {
      postulaciones.set(trabajoId, [...lista, { persona: yo(uid), en: Date.now() }]);
    }
  },

  async yaSePostulo(trabajoId, uid) {
    return (postulaciones.get(trabajoId) ?? []).some((p) => p.persona.uid === uid);
  },

  async listarMisTrabajos(uid) {
    await esperar(400);
    avanzar();
    const recientes = (a: Trabajo, b: Trabajo) => b.creadoEn.localeCompare(a.creadoEn);
    return {
      publicados: trabajos.filter((t) => t.publicadoPor.uid === uid).sort(recientes),
      comoTrabajador: trabajos
        .filter(
          (t) =>
            t.trabajador?.uid === uid ||
            (t.estado === 'Disponible' &&
              (postulaciones.get(t.id) ?? []).some((p) => p.persona.uid === uid)),
        )
        .sort(recientes),
    };
  },

  async listarPostulados(trabajoId, contratanteUid) {
    await esperar(300);
    avanzar();
    const t = buscar(trabajoId);
    if (!t || t.publicadoPor.uid !== contratanteUid) noPermitido();
    return (postulaciones.get(trabajoId) ?? []).map((p) => p.persona);
  },

  async elegir(trabajoId, contratanteUid, trabajadorUid) {
    await esperar(500);
    avanzar();
    const t = buscar(trabajoId);
    const elegido = (postulaciones.get(trabajoId) ?? []).find(
      (p) => p.persona.uid === trabajadorUid,
    );
    if (!t || t.publicadoPor.uid !== contratanteUid || t.estado !== 'Disponible' || !elegido) {
      noPermitido();
    }
    reemplazar({ ...t, estado: 'Asignado', trabajador: elegido.persona });
    asignadoEn.set(trabajoId, Date.now());
  },

  async responderAsignacion(trabajoId, trabajadorUid, acepta) {
    await esperar(500);
    avanzar();
    const t = buscar(trabajoId);
    if (!t || t.estado !== 'Asignado' || t.trabajador?.uid !== trabajadorUid) noPermitido();
    if (acepta) {
      reemplazar({ ...t, estado: 'En curso' });
    } else {
      // HU-26: vuelve a Disponible y quien rechazó sale de los postulados.
      reemplazar({ ...t, estado: 'Disponible', trabajador: null });
      postulaciones.set(
        trabajoId,
        (postulaciones.get(trabajoId) ?? []).filter((p) => p.persona.uid !== trabajadorUid),
      );
    }
  },

  async marcarTerminado(trabajoId, contratanteUid) {
    await esperar(500);
    avanzar();
    const t = buscar(trabajoId);
    if (!t || t.publicadoPor.uid !== contratanteUid || t.estado !== 'En curso') noPermitido();
    reemplazar({ ...t, estado: 'Terminado' });
  },

  async obtenerContacto(trabajoId, uid): Promise<Contacto | null> {
    await esperar(200);
    avanzar();
    const t = buscar(trabajoId);
    if (!t || t.estado !== 'En curso' || !participa(t, uid)) return null;
    const otra = otraParte(t, uid);
    return otra ? { nombre: otra.nombre, celular: celularDe(otra.uid) } : null;
  },

  escucharMensajes(trabajoId, alCambiar) {
    return escuchar(() => [...(mensajes.get(trabajoId) ?? [])], alCambiar, 800);
  },

  async enviarMensaje(trabajoId, deUid, texto) {
    await esperar(250);
    avanzar();
    const t = buscar(trabajoId);
    const limpio = texto.trim();
    if (!t || t.estado !== 'En curso' || !participa(t, deUid)) noPermitido();
    if (limpio.length === 0 || limpio.length > 500) throw new Error('mensaje-invalido');
    agregarMensaje(trabajoId, deUid, limpio);
    const otra = otraParte(t, deUid);
    if (otra && esEjemplo(otra.uid) && !respondidos.has(trabajoId)) {
      respondidos.add(trabajoId);
      respuestaPendiente.set(trabajoId, Date.now());
    }
  },

  async listarPendientesDeCalificar(uid) {
    await esperar(300);
    avanzar();
    const pendientes: PendienteDeCalificar[] = [];
    for (const t of trabajos) {
      if (t.estado !== 'Terminado' || !participa(t, uid)) continue;
      const yaCalifico = calificaciones.some((c) => c.trabajoId === t.id && c.deUid === uid);
      const calificado = otraParte(t, uid);
      if (!yaCalifico && calificado) pendientes.push({ trabajo: t, calificado });
    }
    return pendientes;
  },

  async calificar(calificacion) {
    await esperar(600);
    const { estrellas, deUid, paraUid, trabajoId } = calificacion;
    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
      throw new Error('estrellas-invalidas');
    }
    const t = buscar(trabajoId);
    const yaCalifico = calificaciones.some((c) => c.trabajoId === trabajoId && c.deUid === deUid);
    if (!t || t.estado !== 'Terminado' || otraParte(t, deUid)?.uid !== paraUid || yaCalifico) {
      noPermitido();
    }
    calificaciones.push(calificacion);
  },
};

/** Solo para pruebas. */
export function reiniciarTrabajosSimulado() {
  trabajos = [];
  postulaciones = new Map();
  asignadoEn = new Map();
  mensajes = new Map();
  respuestaPendiente = new Map();
  respondidos = new Set();
  postulantesSembrados = new Set();
  calificaciones = [];
  sembrado = false;
  contador = 0;
}

/** Solo para pruebas. */
export function leerCalificacionesSimulado(): NuevaCalificacion[] {
  return [...calificaciones];
}
