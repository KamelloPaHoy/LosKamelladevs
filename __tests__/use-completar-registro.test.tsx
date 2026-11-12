import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { VersionPolitica } from '@/constants/politica';
import { useCompletarRegistro } from '@/hooks/use-completar-registro';
import {
  CodigoDePrueba,
  leerPrivadoSimulado,
  reiniciarSimulado,
  servicioAuthSimulado as auth,
} from '@/servicios/auth/auth-simulado';
import { ProveedorSesion, useSesion } from '@/sesion/proveedor-sesion';

const envoltura = ({ children }: { children: ReactNode }) => (
  <ProveedorSesion>{children}</ProveedorSesion>
);

/** El hook de la pantalla y la sesión, juntos, para ver el resultado de guardar. */
function usePantallaRegistro() {
  return { vm: useCompletarRegistro(), sesion: useSesion() };
}

async function avanzar(ms = 2000) {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  reiniciarSimulado();
});

afterEach(() => {
  jest.useRealTimers();
});

async function iniciarSesion() {
  const { result } = await renderHook(usePantallaRegistro, { wrapper: envoltura });
  let verificacion!: Awaited<ReturnType<typeof auth.enviarCodigo>>;
  const envio = auth.enviarCodigo('+573001234567').then((v) => (verificacion = v));
  await avanzar();
  await envio;
  const confirmacion = auth.confirmarCodigo(verificacion, CodigoDePrueba);
  await avanzar();
  await confirmacion;
  await avanzar();
  return result;
}

describe('completar el registro', () => {
  it('no guarda nada si faltan datos o no acepta la política', async () => {
    const result = await iniciarSesion();

    await act(async () => {
      await result.current.vm.guardar();
    });

    expect(result.current.vm.errores).toEqual({
      nombre: 'Escribe tu nombre.',
      barrio: 'Escribe tu barrio.',
      politica: 'Debes autorizar el tratamiento de tus datos para crear tu cuenta.',
    });
    expect(result.current.sesion.perfil).toBeNull();
  });

  it('manda el celular y la aceptación a los datos privados, no al perfil', async () => {
    const result = await iniciarSesion();
    const uid = result.current.sesion.usuario!.uid;

    await act(async () => {
      result.current.vm.setNombre('  Luzdey   Marín ');
      result.current.vm.setBarrio('El Centro');
      result.current.vm.setAceptaPolitica(true);
    });
    await act(async () => {
      const guardado = result.current.vm.guardar();
      await jest.advanceTimersByTimeAsync(2000);
      await guardado;
    });

    expect(result.current.sesion.perfil).toEqual({ nombre: 'Luzdey Marín', barrio: 'El Centro' });

    const privado = leerPrivadoSimulado(uid);
    expect(privado?.celular).toBe('+573001234567');
    expect(privado?.versionPolitica).toBe(VersionPolitica);
    expect(Number.isNaN(Date.parse(privado!.aceptoPoliticaEn))).toBe(false);
  });
});
