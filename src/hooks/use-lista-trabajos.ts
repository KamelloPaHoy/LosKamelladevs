/** ViewModel de la lista de trabajos (inicio). */
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  servicioTrabajos,
  type PendienteDeCalificar,
  type Trabajo,
} from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import { esDeMiBarrio, ordenarPorCercania } from '@/utils/trabajos';

type Estado = 'cargando' | 'error' | 'listo';

export function useListaTrabajos() {
  const { usuario, perfil } = useSesion();
  const miBarrio = perfil?.barrio ?? '';
  const [estado, setEstado] = useState<Estado>('cargando');
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [pendientes, setPendientes] = useState<PendienteDeCalificar[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setError(null);
    try {
      const [disponibles, porCalificar] = await Promise.all([
        servicioTrabajos.listarDisponibles(),
        servicioTrabajos.listarPendientesDeCalificar(usuario.uid),
      ]);
      setTrabajos(ordenarPorCercania(disponibles, miBarrio));
      setPendientes(porCalificar);
      setEstado('listo');
    } catch (e) {
      setError(mensajeDeError(e));
      setEstado('error');
    }
  }, [usuario, miBarrio]);

  // Se recarga cada vez que se vuelve a la lista (después de publicar o calificar).
  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const cercanos = trabajos.filter((t) => esDeMiBarrio(t, miBarrio));
  const otros = trabajos.filter((t) => !esDeMiBarrio(t, miBarrio));

  return {
    estado,
    error,
    miBarrio,
    cercanos,
    otros,
    pendientes,
    reintentar: () => {
      setEstado('cargando');
      void cargar();
    },
  };
}
