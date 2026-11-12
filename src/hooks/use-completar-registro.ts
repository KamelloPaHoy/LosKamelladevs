/** ViewModel de la pantalla «Completa tu registro». */
import { useState } from 'react';

import { VersionPolitica } from '@/constants/politica';
import { servicioAuth, type RegistroNuevo } from '@/servicios/auth';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import { validarBarrio, validarNombre } from '@/utils/validaciones';

type Errores = { nombre: string | null; barrio: string | null; politica: string | null };

const SinErrores: Errores = { nombre: null, barrio: null, politica: null };

export function useCompletarRegistro() {
  const { usuario, setPerfil } = useSesion();
  const [nombre, setNombre] = useState('');
  const [barrio, setBarrio] = useState('');
  const [aceptaPolitica, setAceptaPolitica] = useState(false);
  const [errores, setErrores] = useState<Errores>(SinErrores);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const limpiar = (campo: keyof Errores) => {
    setErrores((previos) => ({ ...previos, [campo]: null }));
    setErrorGeneral(null);
  };

  const guardar = async () => {
    const nuevos: Errores = {
      nombre: validarNombre(nombre),
      barrio: validarBarrio(barrio),
      politica: aceptaPolitica ? null : 'Debes autorizar el tratamiento de tus datos para crear tu cuenta.',
    };
    setErrores(nuevos);
    if (nuevos.nombre || nuevos.barrio || nuevos.politica || !usuario || guardando) return;

    const registro: RegistroNuevo = {
      publico: {
        nombre: nombre.trim().replace(/\s+/g, ' '),
        barrio: barrio.trim(),
      },
      privado: {
        celular: usuario.celular,
        aceptoPoliticaEn: new Date().toISOString(),
        versionPolitica: VersionPolitica,
      },
    };

    setGuardando(true);
    setErrorGeneral(null);
    try {
      await servicioAuth.completarRegistro(usuario.uid, registro);
      setPerfil(registro.publico);
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
      setGuardando(false);
    }
  };

  return {
    nombre,
    setNombre: (v: string) => {
      setNombre(v);
      limpiar('nombre');
    },
    barrio,
    setBarrio: (v: string) => {
      setBarrio(v);
      limpiar('barrio');
    },
    aceptaPolitica,
    setAceptaPolitica: (v: boolean) => {
      setAceptaPolitica(v);
      limpiar('politica');
    },
    validarNombreAlSalir: () => {
      if (nombre.length > 0) setErrores((p) => ({ ...p, nombre: validarNombre(nombre) }));
    },
    validarBarrioAlSalir: () => {
      if (barrio.length > 0) setErrores((p) => ({ ...p, barrio: validarBarrio(barrio) }));
    },
    errores,
    errorGeneral,
    guardando,
    guardar,
  };
}
