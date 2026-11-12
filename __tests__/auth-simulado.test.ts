import { ErrorAuth } from '@/servicios/auth';
import {
  CodigoDePrueba,
  leerPrivadoSimulado,
  reiniciarSimulado,
  servicioAuthSimulado as auth,
} from '@/servicios/auth/auth-simulado';

/** Ejecuta una llamada del servicio adelantando el reloj simulado. */
async function conReloj<T>(promesa: Promise<T>): Promise<T> {
  const resultado = promesa.then(
    (valor) => ({ ok: true as const, valor }),
    (error: unknown) => ({ ok: false as const, error }),
  );
  await jest.advanceTimersByTimeAsync(2000);
  const r = await resultado;
  if (r.ok) return r.valor;
  throw r.error;
}

beforeEach(() => {
  jest.useFakeTimers();
  reiniciarSimulado();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('servicio de autenticación simulado', () => {
  it('rechaza un celular que no está en formato +57', async () => {
    await expect(conReloj(auth.enviarCodigo('3001234567'))).rejects.toEqual(
      new ErrorAuth('celular-invalido'),
    );
  });

  it('simula la falta de conexión con el celular 300 000 0000', async () => {
    await expect(conReloj(auth.enviarCodigo('+573000000000'))).rejects.toMatchObject({
      codigo: 'sin-conexion',
    });
  });

  it('inicia sesión con el código de prueba y avisa a quien escucha', async () => {
    const cambios: (string | null)[] = [];
    auth.escucharSesion((u) => cambios.push(u?.celular ?? null));

    const verificacion = await conReloj(auth.enviarCodigo('+573001234567'));
    const usuario = await conReloj(auth.confirmarCodigo(verificacion, CodigoDePrueba));

    expect(usuario.celular).toBe('+573001234567');
    expect(cambios).toEqual([null, '+573001234567']);
  });

  it('bloquea al tercer código incorrecto', async () => {
    const verificacion = await conReloj(auth.enviarCodigo('+573001234567'));
    await expect(conReloj(auth.confirmarCodigo(verificacion, '111111'))).rejects.toMatchObject({
      codigo: 'codigo-incorrecto',
    });
    await expect(conReloj(auth.confirmarCodigo(verificacion, '222222'))).rejects.toMatchObject({
      codigo: 'codigo-incorrecto',
    });
    await expect(conReloj(auth.confirmarCodigo(verificacion, '333333'))).rejects.toMatchObject({
      codigo: 'demasiados-intentos',
    });
    // Ni siquiera el código correcto entra después del bloqueo.
    await expect(
      conReloj(auth.confirmarCodigo(verificacion, CodigoDePrueba)),
    ).rejects.toMatchObject({ codigo: 'demasiados-intentos' });
  });

  it('guarda el perfil público y los datos privados por separado', async () => {
    const verificacion = await conReloj(auth.enviarCodigo('+573001234567'));
    const { uid } = await conReloj(auth.confirmarCodigo(verificacion, CodigoDePrueba));

    expect(await conReloj(auth.obtenerPerfil(uid))).toBeNull();

    await conReloj(
      auth.completarRegistro(uid, {
        publico: { nombre: 'Luzdey Marín', barrio: 'El Centro' },
        privado: {
          celular: '+573001234567',
          aceptoPoliticaEn: '2026-11-11T13:00:00.000Z',
          versionPolitica: '0.1-borrador',
        },
      }),
    );

    const perfil = await conReloj(auth.obtenerPerfil(uid));
    expect(perfil).toEqual({ nombre: 'Luzdey Marín', barrio: 'El Centro' });
    expect(JSON.stringify(perfil)).not.toContain('3001234567');
    expect(leerPrivadoSimulado(uid)?.celular).toBe('+573001234567');
  });
});
