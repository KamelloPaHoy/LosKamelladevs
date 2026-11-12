import { Colores, type Paleta } from '@/constants/tema';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Devuelve los colores del modo claro u oscuro según el celular. */
export function usePaleta(): Paleta {
  return useColorScheme() === 'dark' ? Colores.oscuro : Colores.claro;
}
