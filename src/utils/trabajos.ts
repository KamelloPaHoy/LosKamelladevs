/** Reglas de los trabajos que no dependen de pantallas ni de Firebase. */
import type { Trabajo } from '@/servicios/trabajos/tipos';

/** «El Centro», «el  centro» y «EL CÉNTRO» cuentan como el mismo barrio. */
export function normalizarBarrio(barrio: string): string {
  return barrio
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function esDeMiBarrio(trabajo: Trabajo, miBarrio: string): boolean {
  return normalizarBarrio(trabajo.barrio) === normalizarBarrio(miBarrio);
}

/**
 * Todos los trabajos, con los más cercanos primero.
 * Hoy «cercano» es el mismo barrio; dentro de cada grupo, los más recientes van arriba.
 */
export function ordenarPorCercania(trabajos: Trabajo[], miBarrio: string): Trabajo[] {
  return [...trabajos].sort((a, b) => {
    const cercaA = esDeMiBarrio(a, miBarrio) ? 0 : 1;
    const cercaB = esDeMiBarrio(b, miBarrio) ? 0 : 1;
    if (cercaA !== cercaB) return cercaA - cercaB;
    return b.creadoEn.localeCompare(a.creadoEn);
  });
}

/** 50000 → «$50.000». Sin Intl, para que se vea igual en todos los celulares. */
export function formatearPrecio(pesos: number): string {
  const entero = Math.round(pesos).toString();
  return `$${entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function textoCuando(cuando: Trabajo['cuando']): string {
  return cuando === 'Esta semana' ? 'Esta semana' : `Para ${cuando.toLowerCase()}`;
}

export const PrecioMinimo = 5000;
export const PrecioMaximo = 2000000;

export function validarTitulo(valor: string): string | null {
  const limpio = valor.trim();
  if (limpio.length === 0) return 'Escribe qué necesitas.';
  if (limpio.length < 8) return 'Cuéntalo con un poco más de detalle (mínimo 8 letras).';
  if (limpio.length > 60) return 'El título no puede pasar de 60 caracteres.';
  return null;
}

export function validarDescripcion(valor: string): string | null {
  const limpio = valor.trim();
  if (limpio.length === 0) return 'Describe el trabajo.';
  if (limpio.length < 20) return 'Agrega más detalles: qué hay que hacer y qué materiales hay.';
  if (limpio.length > 300) return 'La descripción no puede pasar de 300 caracteres.';
  return null;
}

export function validarPrecio(pesos: number | null): string | null {
  if (pesos === null || pesos === 0) return 'Escribe cuánto vas a pagar.';
  if (pesos < PrecioMinimo) return `El pago mínimo es ${formatearPrecio(PrecioMinimo)}.`;
  if (pesos > PrecioMaximo) return `El pago máximo es ${formatearPrecio(PrecioMaximo)}.`;
  return null;
}

/** «50.000» o «$ 50000» → 50000. Vacío → null. */
export function leerPrecio(texto: string): number | null {
  const digitos = texto.replace(/\D/g, '');
  return digitos.length === 0 ? null : Number(digitos.slice(0, 9));
}

export function validarComentario(valor: string): string | null {
  if (valor.trim().length > 300) return 'El comentario no puede pasar de 300 caracteres.';
  return null;
}

export const TextoEstrellas = ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'] as const;
