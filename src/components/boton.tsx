import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { AltoTactil, Radio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: 'primario' | 'secundario' | 'texto';
  deshabilitado?: boolean;
  cargando?: boolean;
  /** Texto que lee el lector de pantalla mientras carga. */
  textoCargando?: string;
};

export function Boton({
  titulo,
  alPresionar,
  variante = 'primario',
  deshabilitado = false,
  cargando = false,
  textoCargando = 'Cargando',
}: Props) {
  const paleta = usePaleta();
  const inactivo = deshabilitado || cargando;

  const colorTexto =
    variante === 'primario'
      ? inactivo && !cargando
        ? paleta.textoDeshabilitado
        : paleta.sobrePrimario
      : inactivo
        ? paleta.textoDeshabilitado
        : paleta.primario;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={cargando ? textoCargando : titulo}
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      disabled={inactivo}
      onPress={alPresionar}
      hitSlop={variante === 'texto' ? 8 : 0}
      style={({ pressed }) => [
        estilos.base,
        variante === 'primario' && {
          backgroundColor:
            inactivo && !cargando
              ? paleta.deshabilitado
              : pressed
                ? paleta.primarioPresionado
                : paleta.primario,
        },
        variante === 'secundario' && {
          borderWidth: 1.5,
          borderColor: inactivo ? paleta.borde : paleta.primario,
          backgroundColor: pressed ? paleta.deshabilitado : 'transparent',
        },
        // Sin relleno lateral: el texto queda alineado con lo que tiene al lado.
        variante === 'texto' && { opacity: pressed ? 0.6 : 1, paddingHorizontal: 0 },
      ]}>
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <Text style={[estilos.texto, { color: colorTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: AltoTactil,
    borderRadius: Radio,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
});
