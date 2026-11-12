/** ViewModel del detalle de un trabajo, con la opción de postularse. */
import { useEffect, useState } from 'react';

import { servicioTrabajos, type Trabajo } from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import { esDeMiBarrio } from '@/utils/trabajos';

type Estado = 'cargando' | 'no-existe' | 'error' | 'listo';

export function useDetalleTrabajo(id: string) {
  const { usuario, perfil } = useSesion();
  const [estado, setEstado] = useState<Estado>('cargando');
  const [trabajo, setTrabajo] = useState<Trabajo | null>(null);
  const [yaPostulado, setYaPostulado] = useState(false);
  const [postulando, setPostulando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const encontrado = await servicioTrabajos.obtener(id);
        const postulado =
          encontrado && usuario ? await servicioTrabajos.yaSePostulo(id, usuario.uid) : false;
        if (!activo) return;
        setTrabajo(encontrado);
        setYaPostulado(postulado);
        setEstado(encontrado ? 'listo' : 'no-existe');
      } catch (e) {
        if (!activo) return;
        setErrorGeneral(mensajeDeError(e));
        setEstado('error');
      }
    })();
    return () => {
      activo = false;
    };
  }, [id, usuario]);

  const postularse = async () => {
    if (!usuario || !trabajo || postulando || yaPostulado) return;
    setPostulando(true);
    setErrorGeneral(null);
    try {
      await servicioTrabajos.postularse(trabajo.id, usuario.uid);
      setYaPostulado(true);
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
    } finally {
      setPostulando(false);
    }
  };

  return {
    estado,
    trabajo,
    esMio: !!trabajo && trabajo.publicadoPor.uid === usuario?.uid,
    cercano: !!trabajo && esDeMiBarrio(trabajo, perfil?.barrio ?? ''),
    yaPostulado,
    postulando,
    errorGeneral,
    postularse,
  };
}
