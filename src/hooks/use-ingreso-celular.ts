/** ViewModel de la pantalla «Tu celular». */
import { router } from 'expo-router';
import { useState } from 'react';

import { servicioAuth } from '@/servicios/auth';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import {
  aFormatoInternacional,
  formatearCelular,
  soloDigitos,
  validarCelular,
} from '@/utils/validaciones';

export function useIngresoCelular() {
  const { setVerificacion } = useSesion();
  const [celular, setCelularCrudo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const setCelular = (texto: string) => {
    setCelularCrudo(formatearCelular(texto));
    // El error del campo se quita en cuanto el número queda completo y válido.
    if (error && validarCelular(texto) === null) setError(null);
    setErrorGeneral(null);
  };

  const validarAlSalir = () => {
    if (soloDigitos(celular).length > 0) setError(validarCelular(celular));
  };

  const enviar = async () => {
    const problema = validarCelular(celular);
    setError(problema);
    if (problema || enviando) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const verificacion = await servicioAuth.enviarCodigo(aFormatoInternacional(celular));
      setVerificacion(verificacion);
      router.push('/codigo');
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return {
    celular,
    setCelular,
    error,
    errorGeneral,
    enviando,
    validarAlSalir,
    enviar,
    puedeEnviar: soloDigitos(celular).length === 10,
  };
}
