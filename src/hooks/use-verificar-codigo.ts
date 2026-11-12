/** ViewModel de la pantalla «Código del SMS». */
import { useEffect, useState } from 'react';

import { ErrorAuth, servicioAuth } from '@/servicios/auth';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import { LargoCodigo, validarCodigo } from '@/utils/validaciones';

/** Segundos de espera antes de poder pedir otro SMS. */
export const EsperaReenvio = 60;

export function useVerificarCodigo() {
  const { verificacion, setVerificacion } = useSesion();
  const [codigo, setCodigoCrudo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());

  // Reloj para el contador de reenvío.
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const segundosParaReenviar = verificacion
    ? Math.max(0, EsperaReenvio - Math.floor((ahora - verificacion.enviadoEn) / 1000))
    : 0;

  const confirmar = async (valor: string = codigo) => {
    if (!verificacion || verificando) return;
    const problema = validarCodigo(valor);
    setError(problema);
    if (problema) return;

    setVerificando(true);
    setErrorGeneral(null);
    try {
      await servicioAuth.confirmarCodigo(verificacion, valor);
      // La sesión cambia y las rutas protegidas llevan al usuario a la siguiente pantalla.
    } catch (e) {
      const mensaje = mensajeDeError(e);
      const esDelCodigo = e instanceof ErrorAuth && e.codigo === 'codigo-incorrecto';
      if (esDelCodigo) setError(mensaje);
      else setErrorGeneral(mensaje);
      setCodigoCrudo('');
      setVerificando(false);
    }
  };

  const setCodigo = (valor: string) => {
    setCodigoCrudo(valor);
    setError(null);
    // Se confirma solo al completar los 6 números: un paso menos para el usuario.
    if (valor.length === LargoCodigo) void confirmar(valor);
  };

  const reenviar = async () => {
    if (!verificacion || segundosParaReenviar > 0 || reenviando) return;
    setReenviando(true);
    setErrorGeneral(null);
    setError(null);
    setCodigoCrudo('');
    try {
      setVerificacion(await servicioAuth.enviarCodigo(verificacion.celular));
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
    } finally {
      setReenviando(false);
    }
  };

  return {
    verificacion,
    codigo,
    setCodigo,
    error,
    errorGeneral,
    verificando,
    reenviando,
    segundosParaReenviar,
    confirmar: () => confirmar(),
    reenviar,
  };
}
