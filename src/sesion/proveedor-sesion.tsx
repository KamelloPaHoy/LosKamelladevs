/**
 * Estado global de la sesión. Decide qué grupo de pantallas se muestra:
 *   - sin sesión              → (acceso): bienvenida, celular, código
 *   - con sesión, sin perfil  → completar-registro
 *   - con sesión y perfil     → (app)
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  servicioAuth,
  type PerfilPublico,
  type UsuarioAuth,
  type Verificacion,
} from '@/servicios/auth';

type EstadoSesion = {
  /** false solo mientras se averigua si ya había una sesión abierta al abrir la app. */
  listo: boolean;
  usuario: UsuarioAuth | null;
  perfil: PerfilPublico | null;
  /** SMS enviado y pendiente de confirmar (pasa de la pantalla del celular a la del código). */
  verificacion: Verificacion | null;
  setVerificacion: (verificacion: Verificacion | null) => void;
  setPerfil: (perfil: PerfilPublico) => void;
  cerrarSesion: () => Promise<void>;
};

const ContextoSesion = createContext<EstadoSesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
  const [perfil, setPerfil] = useState<PerfilPublico | null>(null);
  const [verificacion, setVerificacion] = useState<Verificacion | null>(null);

  useEffect(() => {
    let activo = true;
    const dejarDeEscuchar = servicioAuth.escucharSesion(async (nuevoUsuario) => {
      let nuevoPerfil: PerfilPublico | null = null;
      if (nuevoUsuario) {
        try {
          nuevoPerfil = await servicioAuth.obtenerPerfil(nuevoUsuario.uid);
        } catch {
          // Sin perfil legible: se le pide completar el registro de nuevo.
          nuevoPerfil = null;
        }
      }
      if (!activo) return;
      // Usuario y perfil cambian juntos para no mostrar una pantalla equivocada un instante.
      setUsuario(nuevoUsuario);
      setPerfil(nuevoPerfil);
      if (nuevoUsuario) setVerificacion(null);
      setListo(true);
    });
    return () => {
      activo = false;
      dejarDeEscuchar();
    };
  }, []);

  const cerrarSesion = async () => {
    setVerificacion(null);
    await servicioAuth.cerrarSesion();
  };

  return (
    <ContextoSesion.Provider
      value={{ listo, usuario, perfil, verificacion, setVerificacion, setPerfil, cerrarSesion }}>
      {children}
    </ContextoSesion.Provider>
  );
}

export function useSesion(): EstadoSesion {
  const contexto = useContext(ContextoSesion);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <ProveedorSesion>.');
  return contexto;
}
