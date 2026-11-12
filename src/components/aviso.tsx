import { StyleSheet, Text, View } from 'react-native';

import { Espacio, Radio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

/** Mensaje de error general (no ligado a un solo campo), por ejemplo «sin conexión». */
export function AvisoError({ mensaje }: { mensaje: string | null }) {
  const paleta = usePaleta();
  if (!mensaje) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={[estilos.caja, { backgroundColor: paleta.fondoError, borderColor: paleta.error }]}>
      <Text style={[estilos.texto, { color: paleta.error }]}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { borderRadius: Radio, borderWidth: 1, padding: Espacio.m },
  texto: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
});
