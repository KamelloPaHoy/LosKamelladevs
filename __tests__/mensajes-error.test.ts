import { ErrorAuth, type CodigoErrorAuth } from '@/servicios/auth';
import { mensajeDeError } from '@/utils/mensajes-error';

const codigos: CodigoErrorAuth[] = [
  'celular-invalido',
  'codigo-incorrecto',
  'codigo-vencido',
  'demasiados-intentos',
  'sin-conexion',
  'desconocido',
];

describe('mensajes de error', () => {
  it.each(codigos)('«%s» tiene un mensaje en español sin términos técnicos', (codigo) => {
    const mensaje = mensajeDeError(new ErrorAuth(codigo));
    expect(mensaje.length).toBeGreaterThan(10);
    expect(mensaje).not.toMatch(/firebase|auth\/|error code|undefined/i);
  });

  it('un error que no es de autenticación muestra el mensaje general', () => {
    expect(mensajeDeError(new Error('auth/network-request-failed'))).toBe(
      'Algo salió mal. Inténtalo de nuevo en un momento.',
    );
  });
});
