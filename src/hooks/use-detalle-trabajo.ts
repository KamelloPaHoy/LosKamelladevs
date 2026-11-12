/**
 * ViewModel del detalle de un trabajo. Lo que se ve depende de quién lo mira y del estado:
 *   - visitante:   postularse.
 *   - contratante: ver postulados y elegir · esperar respuesta · contacto, chat y terminar · calificar.
 *   - trabajador:  aceptar o rechazar · contacto y chat · calificar.
 */
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  servicioTrabajos,
  type Contacto,
  type PersonaPublica,
  type Trabajo,
} from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import { esDeMiBarrio } from '@/utils/trabajos';

export type Rol = 'contratante' | 'trabajador' | 'visitante';
type Accion = 'postularse' | 'elegir' | 'aceptar' | 'rechazar' | 'terminar';

/** Cada cuánto se revisan los postulados mientras el trabajo está Disponible. */
const RevisarPostuladosCadaMs = 2000;

export function useDetalleTrabajo(id: string) {
  const { usuario, perfil } = useSesion();
  const uid = usuario?.uid ?? '';
  const [cargando, setCargando] = useState(true);
  const [trabajo, setTrabajo] = useState<Trabajo | null>(null);
  const [yaPostulado, setYaPostulado] = useState(false);
  const [postulados, setPostulados] = useState<PersonaPublica[]>([]);
  const [contacto, setContacto] = useState<Contacto | null>(null);
  const [porCalificar, setPorCalificar] = useState<PersonaPublica | null>(null);
  const [ocupado, setOcupado] = useState<Accion | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  // Sube cada vez que se vuelve a esta pantalla (por ejemplo, después de calificar).
  const [visita, setVisita] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setVisita((n) => n + 1);
    }, []),
  );

  // El trabajo se escucha en vivo: cambia de estado cuando la otra parte actúa.
  useEffect(() => {
    return servicioTrabajos.escucharTrabajo(id, (t) => {
      setTrabajo(t);
      setCargando(false);
    });
  }, [id]);

  const rol: Rol = !trabajo
    ? 'visitante'
    : trabajo.publicadoPor.uid === uid
      ? 'contratante'
      : trabajo.trabajador?.uid === uid
        ? 'trabajador'
        : 'visitante';
  const estado = trabajo?.estado;

  // Datos que dependen del estado: postulación, contacto y calificación pendiente.
  useEffect(() => {
    if (!trabajo || !uid) return;
    let activo = true;
    (async () => {
      const [postulado, nuevoContacto, pendientes] = await Promise.all([
        servicioTrabajos.yaSePostulo(trabajo.id, uid),
        estado === 'En curso' ? servicioTrabajos.obtenerContacto(trabajo.id, uid) : null,
        estado === 'Terminado' ? servicioTrabajos.listarPendientesDeCalificar(uid) : [],
      ]);
      if (!activo) return;
      setYaPostulado(postulado);
      setContacto(nuevoContacto);
      setPorCalificar(pendientes.find((p) => p.trabajo.id === trabajo.id)?.calificado ?? null);
    })().catch(() => undefined);
    return () => {
      activo = false;
    };
  }, [trabajo, estado, uid, visita]);

  // El contratante ve llegar postulados mientras el trabajo está Disponible.
  useEffect(() => {
    if (rol !== 'contratante' || estado !== 'Disponible') return;
    let activo = true;
    const revisar = () =>
      servicioTrabajos
        .listarPostulados(id, uid)
        .then((lista) => activo && setPostulados(lista))
        .catch(() => undefined);
    void revisar();
    const intervalo = setInterval(revisar, RevisarPostuladosCadaMs);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [rol, estado, id, uid]);

  const ejecutar = async (accion: Accion, tarea: () => Promise<void>) => {
    if (ocupado) return;
    setOcupado(accion);
    setErrorGeneral(null);
    try {
      await tarea();
      if (accion === 'postularse') setYaPostulado(true);
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
    } finally {
      setOcupado(null);
    }
  };

  return {
    cargando,
    trabajo,
    rol,
    cercano: !!trabajo && esDeMiBarrio(trabajo, perfil?.barrio ?? ''),
    yaPostulado,
    postulados,
    contacto,
    porCalificar,
    ocupado,
    errorGeneral,
    postularse: () => ejecutar('postularse', () => servicioTrabajos.postularse(id, uid)),
    elegir: (trabajadorUid: string) =>
      ejecutar('elegir', () => servicioTrabajos.elegir(id, uid, trabajadorUid)),
    aceptar: () => ejecutar('aceptar', () => servicioTrabajos.responderAsignacion(id, uid, true)),
    rechazar: () =>
      ejecutar('rechazar', () => servicioTrabajos.responderAsignacion(id, uid, false)),
    terminar: () => ejecutar('terminar', () => servicioTrabajos.marcarTerminado(id, uid)),
  };
}
