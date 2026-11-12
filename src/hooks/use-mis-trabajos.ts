/** ViewModel de «Mis trabajos»: lo que publiqué y donde me postulé, con su estado al día. */
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { servicioTrabajos, type MisTrabajos, type Trabajo } from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';

/** Mientras la pantalla está abierta se revisa cada 3 s, para ver «¡Te eligieron!» sin recargar. */
const RevisarCadaMs = 3000;

/** Qué significa cada estado para quien publicó. */
export function estadoParaContratante(t: Trabajo): string {
  switch (t.estado) {
    case 'Disponible':
      return 'Recibiendo postulados';
    case 'Asignado':
      return 'Esperando respuesta';
    default:
      return t.estado;
  }
}

/** Qué significa cada estado para quien se postuló. */
export function estadoParaTrabajador(t: Trabajo): string {
  switch (t.estado) {
    case 'Disponible':
      return 'Te postulaste';
    case 'Asignado':
      return '¡Te eligieron!';
    default:
      return t.estado;
  }
}

export function useMisTrabajos() {
  const { usuario } = useSesion();
  const [datos, setDatos] = useState<MisTrabajos | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      let activo = true;
      const cargar = () =>
        servicioTrabajos
          .listarMisTrabajos(usuario.uid)
          .then((d) => {
            if (!activo) return;
            setDatos(d);
            setError(null);
          })
          .catch((e: unknown) => activo && setError(mensajeDeError(e)));
      void cargar();
      const intervalo = setInterval(cargar, RevisarCadaMs);
      return () => {
        activo = false;
        clearInterval(intervalo);
      };
    }, [usuario]),
  );

  return { cargando: !datos && !error, datos, error };
}
