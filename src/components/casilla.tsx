import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AltoTactil, Espacio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

type Props = {
  marcada: boolean;
  alCambiar: (marcada: boolean) => void;
  /** Texto accesible completo (lo que lee el lector de pantalla). */
  etiquetaAccesible: string;
  children: ReactNode;
  error?: string | null;
};

export function Casilla({ marcada, alCambiar, etiquetaAccesible, children, error }: Props) {
  const paleta = usePaleta();
  return (
    <View style={{ gap: Espacio.xs }}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: marcada }}
        accessibilityLabel={etiquetaAccesible}
        onPress={() => alCambiar(!marcada)}
        style={estilos.fila}>
        <View
          style={[
            estilos.cuadro,
            {
              borderColor: error ? paleta.error : marcada ? paleta.primario : paleta.borde,
              backgroundColor: marcada ? paleta.primario : paleta.superficie,
            },
          ]}>
          {marcada ? <Text style={[estilos.chulo, { color: paleta.sobrePrimario }]}>✓</Text> : null}
        </View>
        <View style={estilos.texto}>{children}</View>
      </Pressable>
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[estilos.error, { color: paleta.error }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, minHeight: AltoTactil },
  cuadro: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chulo: { fontSize: 17, fontWeight: '700', lineHeight: 20 },
  texto: { flex: 1 },
  error: { fontSize: 14, lineHeight: 20, marginLeft: 26 + Espacio.m },
});
