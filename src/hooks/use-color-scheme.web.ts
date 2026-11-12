import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const sinSuscripcion = () => () => {};

/**
 * En web con renderizado estático, el esquema se calcula solo en el cliente:
 * en el servidor devuelve 'light' y en el navegador el real.
 */
export function useColorScheme() {
  const enCliente = useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
  const esquema = useRNColorScheme();
  return enCliente ? esquema : 'light';
}
