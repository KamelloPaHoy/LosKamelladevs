import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Espacio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

type Props<T extends string> = {
  etiqueta: string;
  opciones: readonly T[];
  valor: T | null;
  alCambiar: (valor: T) => void;
  error?: string | null;
};

/** Escoger una opción entre pocas (categoría, cuándo). Se lee como un grupo de botones de radio. */
export function SelectorChips<T extends string>({
  etiqueta,
  opciones,
  valor,
  alCambiar,
  error,
}: Props<T>) {
  const paleta = usePaleta();
  return (
    <View style={estilos.contenedor}>
      <Text style={[estilos.etiqueta, { color: paleta.texto }]}>{etiqueta}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={etiqueta} style={estilos.fila}>
        {opciones.map((opcion) => {
          const activa = opcion === valor;
          return (
            <Pressable
              key={opcion}
              accessibilityRole="radio"
              accessibilityState={{ checked: activa }}
              accessibilityLabel={opcion}
              onPress={() => alCambiar(opcion)}
              style={({ pressed }) => [
                estilos.chip,
                {
                  backgroundColor: activa ? paleta.primario : paleta.superficie,
                  borderColor: error ? paleta.error : activa ? paleta.primario : paleta.borde,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}>
              <Text
                style={[
                  estilos.texto,
                  { color: activa ? paleta.sobrePrimario : paleta.texto },
                ]}>
                {opcion}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={[estilos.error, { color: paleta.error }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { gap: Espacio.s },
  etiqueta: { fontSize: 15, fontWeight: '600' },
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.s },
  chip: {
    minHeight: 48,
    paddingHorizontal: Espacio.m,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  texto: { fontSize: 15, fontWeight: '600' },
  error: { fontSize: 14, lineHeight: 20 },
});
