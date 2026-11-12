import {
  leerCalificacionesSimulado,
  reiniciarTrabajosSimulado,
  servicioTrabajosSimulado as trabajos,
} from '@/servicios/trabajos/trabajos-simulado';
import { mensajeDeError } from '@/utils/mensajes-error';

async function conReloj<T>(promesa: Promise<T>): Promise<T> {
  const r = promesa.then(
    (valor) => ({ ok: true as const, valor }),
    (error: unknown) => ({ ok: false as const, error }),
  );
  await jest.advanceTimersByTimeAsync(2000);
  const res = await r;
  if (res.ok) return res.valor;
  throw res.error;
}

const yo = { uid: 'u-yo', nombre: 'Luzdey Marín', promedio: null, totalCalificaciones: 0 };

beforeEach(() => {
  jest.useFakeTimers();
  reiniciarTrabajosSimulado();
});

afterEach(() => jest.useRealTimers());

describe('servicio de trabajos simulado', () => {
  it('lo que publico aparece en la lista como Disponible', async () => {
    const nuevo = await conReloj(
      trabajos.publicar(yo, {
        titulo: 'Pintar la reja del frente',
        descripcion: 'Son 4 metros de reja y yo pongo la pintura.',
        categoria: 'Pintura',
        barrio: 'El Centro',
        precio: 80000,
        cuando: 'Hoy',
      }),
    );
    const lista = await conReloj(trabajos.listarDisponibles());
    expect(lista.find((t) => t.id === nuevo.id)?.estado).toBe('Disponible');
    expect(JSON.stringify(nuevo.publicadoPor)).not.toMatch(/celular|\+57/);
  });

  it('no deja postularse a un trabajo propio y recuerda la postulación', async () => {
    const lista = await conReloj(trabajos.listarDisponibles());
    const ajeno = lista[0];
    await conReloj(trabajos.postularse(ajeno.id, yo.uid));
    expect(await trabajos.yaSePostulo(ajeno.id, yo.uid)).toBe(true);

    const mio = await conReloj(
      trabajos.publicar(yo, {
        titulo: 'Destapar el lavaplatos',
        descripcion: 'El agua no baja desde ayer en la cocina.',
        categoria: 'Plomería',
        barrio: 'El Centro',
        precio: 40000,
        cuando: 'Hoy',
      }),
    );
    const error = await conReloj(trabajos.postularse(mio.id, yo.uid)).catch((e: unknown) => e);
    expect(mensajeDeError(error)).toBe('No puedes postularte a un trabajo que publicaste tú.');
  });

  it('al calificar, el trabajo sale de pendientes y la calificación queda guardada', async () => {
    const [pendiente] = await conReloj(trabajos.listarPendientesDeCalificar(yo.uid));
    expect(pendiente.trabajo.estado).toBe('Terminado');

    await conReloj(
      trabajos.calificar({
        trabajoId: pendiente.trabajo.id,
        deUid: yo.uid,
        paraUid: pendiente.calificado.uid,
        estrellas: 5,
        comentario: 'Llegó a tiempo.',
      }),
    );
    expect(await conReloj(trabajos.listarPendientesDeCalificar(yo.uid))).toHaveLength(0);
    expect(leerCalificacionesSimulado()).toHaveLength(1);
  });

  it('rechaza calificaciones fuera de 1 a 5 estrellas', async () => {
    const [pendiente] = await conReloj(trabajos.listarPendientesDeCalificar(yo.uid));
    const error = await conReloj(
      trabajos.calificar({
        trabajoId: pendiente.trabajo.id,
        deUid: yo.uid,
        paraUid: pendiente.calificado.uid,
        estrellas: 0,
        comentario: '',
      }),
    ).catch((e: unknown) => e);
    expect(mensajeDeError(error)).toBe('Elige de 1 a 5 estrellas.');
  });
});
