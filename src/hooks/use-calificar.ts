/** ViewModel de la pantalla «Calificar». */
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { servicioTrabajos, type PendienteDeCalificar } from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import { validarComentario } from '@/utils/trabajos';

type Estado = 'cargando' | 'no-existe' | 'listo';

export function useCalificar(trabajoId: string) {
  const { usuario } = useSesion();
  const [estado, setEstado] = useState<Estado>('cargando');
  const [pendiente, setPendiente] = useState<PendienteDeCalificar | null>(null);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [errorEstrellas, setErrorEstrellas] = useState<string | null>(null);
  const [errorComentario, setErrorComentario] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    servicioTrabajos
      .listarPendientesDeCalificar(usuario.uid)
      .then((lista) => {
        if (!activo) return;
        const encontrado = lista.find((p) => p.trabajo.id === trabajoId) ?? null;
        setPendiente(encontrado);
        setEstado(encontrado ? 'listo' : 'no-existe');
      })
      .catch(() => activo && setEstado('no-existe'));
    return () => {
      activo = false;
    };
  }, [trabajoId, usuario]);

  const enviar = async () => {
    const sinEstrellas = estrellas < 1 ? 'Elige de 1 a 5 estrellas.' : null;
    const problemaComentario = validarComentario(comentario);
    setErrorEstrellas(sinEstrellas);
    setErrorComentario(problemaComentario);
    if (sinEstrellas || problemaComentario || !usuario || !pendiente || enviando) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      await servicioTrabajos.calificar({
        trabajoId: pendiente.trabajo.id,
        deUid: usuario.uid,
        paraUid: pendiente.calificado.uid,
        estrellas,
        comentario: comentario.trim(),
      });
      router.back();
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
      setEnviando(false);
    }
  };

  return {
    estado,
    pendiente,
    estrellas,
    setEstrellas: (n: number) => {
      setEstrellas(n);
      setErrorEstrellas(null);
    },
    comentario,
    setComentario: (v: string) => {
      setComentario(v);
      setErrorComentario(null);
    },
    errorEstrellas,
    errorComentario,
    errorGeneral,
    enviando,
    enviar,
  };
}
