import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Espacio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';
import type { PersonaPublica } from '@/servicios/trabajos';
import { TextoEstrellas } from '@/utils/trabajos';

type SelectorProps = {
  valor: number;
  alCambiar: (estrellas: number) => void;
  error?: string | null;
};

/** Cinco estrellas para calificar. Cada una es un botón de al menos 48 dp. */
export function SelectorEstrellas({ valor, alCambiar, error }: SelectorProps) {
  const paleta = usePaleta();
  return (
    <View style={estilos.contenedor}>
      <View accessibilityRole="radiogroup" accessibilityLabel="Calificación" style={estilos.fila}>
        {[1, 2, 3, 4, 5].map((n) => {
          const llena = n <= valor;
          return (
            <Pressable
              key={n}
              accessibilityRole="radio"
              accessibilityState={{ checked: n === valor }}
              accessibilityLabel={`${n} ${n === 1 ? 'estrella' : 'estrellas'}: ${TextoEstrellas[n - 1]}`}
              onPress={() => alCambiar(n)}
              hitSlop={4}
              style={estilos.estrella}>
              <Text
                style={[
                  estilos.icono,
                  { color: llena ? paleta.primario : error ? paleta.error : paleta.borde },
                ]}>
                ★
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[
          estilos.leyenda,
          { color: error ? paleta.error : valor ? paleta.texto : paleta.textoSecundario },
        ]}>
        {error ?? (valor ? TextoEstrellas[valor - 1] : 'Toca una estrella')}
      </Text>
    </View>
  );
}

/** «★ 4.7 · 9 calificaciones» o «Nuevo en Kamello». */
export function Reputacion({ persona }: { persona: PersonaPublica }) {
  const paleta = usePaleta();
  if (persona.promedio === null || persona.totalCalificaciones === 0) {
    return (
      <Text style={[estilos.reputacion, { color: paleta.textoSecundario }]}>Nuevo en Kamello</Text>
    );
  }
  const total = persona.totalCalificaciones;
  return (
    <Text
      accessibilityLabel={`${persona.promedio.toFixed(1)} de 5 estrellas, ${total} calificaciones`}
      style={[estilos.reputacion, { color: paleta.texto }]}>
      <Text style={{ color: paleta.primario }}>★</Text> {persona.promedio.toFixed(1)}
      <Text style={{ color: paleta.textoSecundario }}>
        {' '}
        · {total} {total === 1 ? 'calificación' : 'calificaciones'}
      </Text>
    </Text>
  );
}

const estilos = StyleSheet.create({
  contenedor: { gap: Espacio.s, alignItems: 'center' },
  fila: { flexDirection: 'row', gap: Espacio.xs },
  estrella: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  icono: { fontSize: 40, lineHeight: 46 },
  leyenda: { fontSize: 17, fontWeight: '600' },
  reputacion: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
});
