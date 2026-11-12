/**
 * Punto único donde se elige qué servicio de autenticación usa la app.
 *
 * Hoy: el simulado, para avanzar el frontend sin depender del backend.
 * Cuando ISSUE-BE-01 esté listo, el backend cambia SOLO esta línea:
 *
 *   export { servicioAuthFirebase as servicioAuth } from './auth-firebase';
 */
export { servicioAuthSimulado as servicioAuth } from './auth-simulado';
export * from './tipos';

/** true mientras se use el servicio simulado: muestra la ayuda del código de prueba. */
export const UsandoAuthSimulado = true;
