import type { Trabajo } from '@/servicios/trabajos';
import {
  esDeMiBarrio,
  formatearPrecio,
  leerPrecio,
  normalizarBarrio,
  ordenarPorCercania,
  validarComentario,
  validarDescripcion,
  validarPrecio,
  validarTitulo,
} from '@/utils/trabajos';

const trabajo = (id: string, barrio: string, creadoEn: string): Trabajo => ({
  id,
  titulo: `Trabajo ${id}`,
  descripcion: 'Descripción de prueba suficientemente larga.',
  categoria: 'Otro',
  barrio,
  precio: 20000,
  cuando: 'Hoy',
  estado: 'Disponible',
  publicadoPor: { uid: 'u', nombre: 'Persona', promedio: null, totalCalificaciones: 0 },
  creadoEn,
});

describe('cercanía', () => {
  it('trata igual el barrio sin importar tildes, mayúsculas ni espacios', () => {
    expect(normalizarBarrio('  El   Céntro ')).toBe('el centro');
    expect(esDeMiBarrio(trabajo('a', 'EL CENTRO', '2026-11-11'), 'el centro')).toBe(true);
  });

  it('muestra todos los trabajos, con los de mi barrio primero y los más recientes arriba', () => {
    const lista = [
      trabajo('lejos-nuevo', 'Comuna 3', '2026-11-11T12:00:00Z'),
      trabajo('cerca-viejo', 'El Centro', '2026-11-10T08:00:00Z'),
      trabajo('lejos-viejo', 'Comuna 5', '2026-11-09T08:00:00Z'),
      trabajo('cerca-nuevo', 'el centro', '2026-11-11T09:00:00Z'),
    ];
    const ordenados = ordenarPorCercania(lista, 'El Centro').map((t) => t.id);
    expect(ordenados).toEqual(['cerca-nuevo', 'cerca-viejo', 'lejos-nuevo', 'lejos-viejo']);
    expect(ordenados).toHaveLength(lista.length);
  });
});

describe('precio', () => {
  it('se muestra en pesos con punto de miles', () => {
    expect(formatearPrecio(5000)).toBe('$5.000');
    expect(formatearPrecio(1250000)).toBe('$1.250.000');
  });

  it('se lee aunque tenga puntos o signo', () => {
    expect(leerPrecio('$ 50.000')).toBe(50000);
    expect(leerPrecio('')).toBeNull();
  });

  it('debe estar entre $5.000 y $2.000.000', () => {
    expect(validarPrecio(null)).toBe('Escribe cuánto vas a pagar.');
    expect(validarPrecio(4000)).toBe('El pago mínimo es $5.000.');
    expect(validarPrecio(2500000)).toBe('El pago máximo es $2.000.000.');
    expect(validarPrecio(50000)).toBeNull();
  });
});

describe('publicar', () => {
  it('pide un título y una descripción con suficiente detalle', () => {
    expect(validarTitulo('')).toBe('Escribe qué necesitas.');
    expect(validarTitulo('Pintar')).toMatch(/mínimo 8/);
    expect(validarTitulo('Pintar la reja')).toBeNull();
    expect(validarDescripcion('Pintar')).toMatch(/Agrega más detalles/);
    expect(validarDescripcion('Son 4 metros de reja y yo pongo la pintura.')).toBeNull();
  });

  it('el comentario de la calificación es opcional pero tiene límite', () => {
    expect(validarComentario('')).toBeNull();
    expect(validarComentario('x'.repeat(301))).toMatch(/300 caracteres/);
  });
});
