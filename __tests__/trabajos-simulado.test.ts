import type { Mensaje } from '@/servicios/trabajos';
import {
  leerCalificacionesSimulado,
  reiniciarTrabajosSimulado,
  servicioTrabajosSimulado as trabajos,
} from '@/servicios/trabajos/trabajos-simulado';
import { mensajeDeError } from '@/utils/mensajes-error';

/** Ejecuta una llamada adelantando el reloj simulado lo justo para que responda. */
async function conReloj<T>(promesa: Promise<T>): Promise<T> {
  const r = promesa.then(
    (valor) => ({ ok: true as const, valor }),
    (error: unknown) => ({ ok: false as const, error }),
  );
  await jest.advanceTimersByTimeAsync(1000);
  const res = await r;
  if (res.ok) return res.valor;
  throw res.error;
}

const pasan = (ms: number) => jest.advanceTimersByTimeAsync(ms);
const fallo = (p: Promise<unknown>) => conReloj(p).then(() => null, (e: unknown) => mensajeDeError(e));

const yo = { uid: 'u-yo', nombre: 'Luzdey Marín', promedio: null, totalCalificaciones: 0 };
const nuevo = {
  titulo: 'Arreglar la puerta del baño',
  descripcion: 'La bisagra se soltó y la puerta no cierra.',
  categoria: 'Otro' as const,
  barrio: 'El Centro',
  precio: 45000,
  cuando: 'Hoy' as const,
};

beforeEach(() => {
  jest.useFakeTimers();
  reiniciarTrabajosSimulado();
});

afterEach(() => jest.useRealTimers());

describe('como contratante', () => {
  it('publico, llegan postulados, elijo, acepta, veo su celular, termino y califico', async () => {
    const t = await conReloj(trabajos.publicar(yo, nuevo));
    expect(t.estado).toBe('Disponible');
    expect(JSON.stringify(t.publicadoPor)).not.toMatch(/celular|\+57/);

    await pasan(3000);
    const postulados = await conReloj(trabajos.listarPostulados(t.id, yo.uid));
    expect(postulados.map((p) => p.nombre)).toEqual(['Carlos Mantilla', 'Yesenia Ortiz']);

    // Antes de aceptar, nadie ve celulares.
    await conReloj(trabajos.elegir(t.id, yo.uid, 'ej-carlos'));
    expect((await conReloj(trabajos.obtener(t.id)))?.estado).toBe('Asignado');
    expect(await conReloj(trabajos.obtenerContacto(t.id, yo.uid))).toBeNull();

    await pasan(3000);
    expect((await conReloj(trabajos.obtener(t.id)))?.estado).toBe('En curso');
    const contacto = await conReloj(trabajos.obtenerContacto(t.id, yo.uid));
    expect(contacto?.nombre).toBe('Carlos Mantilla');
    expect(contacto?.celular).toMatch(/^\+573\d{9}$/);

    await conReloj(trabajos.marcarTerminado(t.id, yo.uid));
    expect(await conReloj(trabajos.obtenerContacto(t.id, yo.uid))).toBeNull();

    const [pendiente] = await conReloj(trabajos.listarPendientesDeCalificar(yo.uid));
    expect(pendiente.calificado.uid).toBe('ej-carlos');
    await conReloj(
      trabajos.calificar({
        trabajoId: t.id,
        deUid: yo.uid,
        paraUid: 'ej-carlos',
        estrellas: 5,
        comentario: 'Muy cumplido.',
      }),
    );
    expect(await conReloj(trabajos.listarPendientesDeCalificar(yo.uid))).toHaveLength(0);
    expect(leerCalificacionesSimulado()).toHaveLength(1);
  });

  it('solo el contratante ve los postulados, y no se elige a quien no se postuló', async () => {
    const t = await conReloj(trabajos.publicar(yo, nuevo));
    await pasan(3000);
    expect(await fallo(trabajos.listarPostulados(t.id, 'otra-persona'))).toMatch(/ya no se puede/);
    expect(await fallo(trabajos.elegir(t.id, yo.uid, 'ej-nadie'))).toMatch(/ya no se puede/);
  });
});

describe('como trabajador', () => {
  it('me postulo, me eligen y si rechazo el trabajo vuelve a Disponible (HU-26)', async () => {
    const [ajeno] = await conReloj(trabajos.listarDisponibles());
    await conReloj(trabajos.postularse(ajeno.id, yo.uid));
    expect(await trabajos.yaSePostulo(ajeno.id, yo.uid)).toBe(true);

    await pasan(4000);
    const asignado = await conReloj(trabajos.obtener(ajeno.id));
    expect(asignado?.estado).toBe('Asignado');
    expect(asignado?.trabajador?.uid).toBe(yo.uid);

    await conReloj(trabajos.responderAsignacion(ajeno.id, yo.uid, false));
    const devuelto = await conReloj(trabajos.obtener(ajeno.id));
    expect(devuelto?.estado).toBe('Disponible');
    expect(devuelto?.trabajador).toBeNull();
    expect(await trabajos.yaSePostulo(ajeno.id, yo.uid)).toBe(false);
  });

  it('si acepto, veo el celular del contratante y chateamos', async () => {
    const [ajeno] = await conReloj(trabajos.listarDisponibles());
    await conReloj(trabajos.postularse(ajeno.id, yo.uid));
    await pasan(4000);
    await conReloj(trabajos.responderAsignacion(ajeno.id, yo.uid, true));

    const contacto = await conReloj(trabajos.obtenerContacto(ajeno.id, yo.uid));
    expect(contacto?.nombre).toBe(ajeno.publicadoPor.nombre);

    let recibidos: Mensaje[] = [];
    const dejar = trabajos.escucharMensajes(ajeno.id, (m) => (recibidos = m));
    await conReloj(trabajos.enviarMensaje(ajeno.id, yo.uid, '  Hola, voy mañana a las 9.  '));
    await pasan(3000);
    dejar();

    expect(recibidos.map((m) => m.deUid)).toEqual([yo.uid, ajeno.publicadoPor.uid]);
    expect(recibidos[0].texto).toBe('Hola, voy mañana a las 9.');
  });

  it('no deja postularse a un trabajo propio ni chatear sin estar En curso', async () => {
    const mio = await conReloj(trabajos.publicar(yo, nuevo));
    expect(await fallo(trabajos.postularse(mio.id, yo.uid))).toBe(
      'No puedes postularte a un trabajo que publicaste tú.',
    );
    expect(await fallo(trabajos.enviarMensaje(mio.id, yo.uid, 'Hola'))).toMatch(/ya no se puede/);
  });
});

describe('calificaciones', () => {
  it('rechaza estrellas fuera de 1 a 5 y calificar un trabajo sin terminar', async () => {
    const t = await conReloj(trabajos.publicar(yo, nuevo));
    const base = { trabajoId: t.id, deUid: yo.uid, paraUid: 'ej-carlos', comentario: '' };
    expect(await fallo(trabajos.calificar({ ...base, estrellas: 0 }))).toBe(
      'Elige de 1 a 5 estrellas.',
    );
    expect(await fallo(trabajos.calificar({ ...base, estrellas: 4 }))).toMatch(/ya no se puede/);
  });
});
