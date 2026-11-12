/** ViewModel de la pantalla «Publicar un trabajo». */
import { router } from 'expo-router';
import { useState } from 'react';

import {
  servicioTrabajos,
  type Categoria,
  type Cuando,
  type NuevoTrabajo,
} from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';
import { mensajeDeError } from '@/utils/mensajes-error';
import {
  leerPrecio,
  validarDescripcion,
  validarPrecio,
  validarTitulo,
} from '@/utils/trabajos';
import { validarBarrio } from '@/utils/validaciones';

type Campo = 'titulo' | 'categoria' | 'descripcion' | 'barrio' | 'precio';
type Errores = Record<Campo, string | null>;

const SinErrores: Errores = {
  titulo: null,
  categoria: null,
  descripcion: null,
  barrio: null,
  precio: null,
};

/** Muestra el precio con puntos de miles mientras se escribe: 50000 → 50.000. */
function formatearMientrasEscribe(texto: string): string {
  const pesos = leerPrecio(texto);
  return pesos === null ? '' : pesos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function usePublicarTrabajo() {
  const { usuario, perfil } = useSesion();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [barrio, setBarrio] = useState(perfil?.barrio ?? '');
  const [precio, setPrecio] = useState('');
  const [cuando, setCuando] = useState<Cuando>('Hoy');
  const [errores, setErrores] = useState<Errores>(SinErrores);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [publicando, setPublicando] = useState(false);

  const limpiar = (campo: Campo) => {
    setErrores((p) => ({ ...p, [campo]: null }));
    setErrorGeneral(null);
  };

  const publicar = async () => {
    const pesos = leerPrecio(precio);
    const nuevos: Errores = {
      titulo: validarTitulo(titulo),
      categoria: categoria ? null : 'Escoge una categoría.',
      descripcion: validarDescripcion(descripcion),
      barrio: validarBarrio(barrio),
      precio: validarPrecio(pesos),
    };
    setErrores(nuevos);
    const hayErrores = Object.values(nuevos).some(Boolean);
    if (hayErrores || !usuario || !perfil || !categoria || pesos === null || publicando) return;

    const nuevo: NuevoTrabajo = {
      titulo: titulo.trim(),
      categoria,
      descripcion: descripcion.trim(),
      barrio: barrio.trim(),
      precio: pesos,
      cuando,
    };

    setPublicando(true);
    setErrorGeneral(null);
    try {
      await servicioTrabajos.publicar(
        { uid: usuario.uid, nombre: perfil.nombre, promedio: null, totalCalificaciones: 0 },
        nuevo,
      );
      router.back();
    } catch (e) {
      setErrorGeneral(mensajeDeError(e));
      setPublicando(false);
    }
  };

  return {
    titulo,
    setTitulo: (v: string) => {
      setTitulo(v);
      limpiar('titulo');
    },
    categoria,
    setCategoria: (v: Categoria) => {
      setCategoria(v);
      limpiar('categoria');
    },
    descripcion,
    setDescripcion: (v: string) => {
      setDescripcion(v);
      limpiar('descripcion');
    },
    barrio,
    setBarrio: (v: string) => {
      setBarrio(v);
      limpiar('barrio');
    },
    precio,
    setPrecio: (v: string) => {
      setPrecio(formatearMientrasEscribe(v));
      limpiar('precio');
    },
    cuando,
    setCuando,
    errores,
    errorGeneral,
    publicando,
    publicar,
  };
}
