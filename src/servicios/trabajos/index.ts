/**
 * Punto único donde se elige qué servicio de trabajos usa la app.
 *
 * Hoy: el simulado, con datos de ejemplo. Cuando BE-03 y BE-04 estén listos,
 * el backend cambia SOLO esta línea:
 *
 *   export { servicioTrabajosFirebase as servicioTrabajos } from './trabajos-firebase';
 */
export { servicioTrabajosSimulado as servicioTrabajos } from './trabajos-simulado';
export * from './tipos';

/** true mientras se usen datos de ejemplo: la lista lo avisa. */
export const UsandoTrabajosSimulados = true;
