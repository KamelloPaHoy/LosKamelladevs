import { useEffect, useState } from "react";
import { buscarTrabajos } from "../services/repositorio";
import { Trabajo } from "../types/modelos";

export function useTrabajos(categoria?: string) {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);
    buscarTrabajos(categoria)
      .then((t) => setTrabajos(t as Trabajo[]))
      .catch((e) => {
        console.log(e);
        setError("No pudimos cargar los trabajos. Intenta de nuevo.");
      })
      .finally(() => setCargando(false));
  }, [categoria]);

  return { trabajos, cargando, error };
}
