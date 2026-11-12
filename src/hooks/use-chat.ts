/** ViewModel del chat entre contratante y trabajador. Solo se puede escribir con el trabajo En curso. */
import { useEffect, useState } from 'react';

import { servicioTrabajos, type Mensaje, type Trabajo } from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';

export const LargoMaximoMensaje = 500;

export function useChat(trabajoId: string) {
  const { usuario } = useSesion();
  const uid = usuario?.uid ?? '';
  const [trabajo, setTrabajo] = useState<Trabajo | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => servicioTrabajos.escucharTrabajo(trabajoId, setTrabajo), [trabajoId]);
  useEffect(() => servicioTrabajos.escucharMensajes(trabajoId, setMensajes), [trabajoId]);

  const otra = !trabajo
    ? null
    : trabajo.publicadoPor.uid === uid
      ? trabajo.trabajador
      : trabajo.publicadoPor;
  const participa = !!trabajo && (trabajo.publicadoPor.uid === uid || trabajo.trabajador?.uid === uid);
  const puedeEscribir = participa && trabajo?.estado === 'En curso';

  const enviar = async () => {
    const limpio = texto.trim();
    if (!limpio || enviando || !puedeEscribir) return;
    setEnviando(true);
    setError(null);
    try {
      await servicioTrabajos.enviarMensaje(trabajoId, uid, limpio);
      setTexto('');
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return {
    trabajo,
    nombreOtra: otra?.nombre ?? 'Chat',
    mensajes,
    esMio: (m: Mensaje) => m.deUid === uid,
    texto,
    setTexto: (v: string) => {
      setTexto(v.slice(0, LargoMaximoMensaje));
      setError(null);
    },
    puedeEscribir,
    enviando,
    error,
    enviar,
  };
}
