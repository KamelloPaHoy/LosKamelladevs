import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reputacion } from '@/components/estrellas';
import { Espacio, Radio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';
import type { Trabajo } from '@/servicios/trabajos';
import { formatearPrecio, textoCuando } from '@/utils/trabajos';

type Props = {
  trabajo: Trabajo;
  cercano: boolean;
  alPresionar: () => void;
};

export function TarjetaTrabajo({ trabajo, cercano, alPresionar }: Props) {
  const paleta = usePaleta();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${trabajo.titulo}. ${formatearPrecio(trabajo.precio)}. ${textoCuando(trabajo.cuando)}. Barrio ${trabajo.barrio}${cercano ? ', en tu barrio' : ''}.`}
      onPress={alPresionar}
      style={({ pressed }) => [
        estilos.tarjeta,
        {
          backgroundColor: paleta.superficie,
          borderColor: paleta.borde,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={estilos.fila}>
        <Etiqueta texto={trabajo.categoria} />
        <Text style={[estilos.cuando, { color: paleta.textoSecundario }]}>
          {textoCuando(trabajo.cuando)}
        </Text>
      </View>
      <Text style={[estilos.titulo, { color: paleta.texto }]}>{trabajo.titulo}</Text>
      <View style={estilos.fila}>
        <Text style={[estilos.precio, { color: paleta.texto }]}>
          {formatearPrecio(trabajo.precio)}
        </Text>
        <Text
          numberOfLines={1}
          style={[estilos.barrio, { color: cercano ? paleta.exito : paleta.textoSecundario }]}>
          {cercano ? '● En tu barrio' : trabajo.barrio}
        </Text>
      </View>
      <View style={[estilos.pie, { borderTopColor: paleta.borde }]}>
        <Text numberOfLines={1} style={[estilos.autor, { color: paleta.textoSecundario }]}>
          {trabajo.publicadoPor.nombre}
        </Text>
        <Reputacion persona={trabajo.publicadoPor} />
      </View>
    </Pressable>
  );
}

export function Etiqueta({ texto }: { texto: string }) {
  const paleta = usePaleta();
  return (
    <View style={[estilos.etiqueta, { backgroundColor: paleta.deshabilitado }]}>
      <Text style={[estilos.textoEtiqueta, { color: paleta.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { borderWidth: 1, borderRadius: Radio, padding: Espacio.m, gap: Espacio.s },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Espacio.s,
  },
  cuando: { fontSize: 14, fontWeight: '500' },
  titulo: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  precio: { fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] },
  barrio: { fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Espacio.s,
    borderTopWidth: 1,
    paddingTop: Espacio.s,
  },
  autor: { fontSize: 14, flexShrink: 1 },
  etiqueta: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  textoEtiqueta: { fontSize: 13, fontWeight: '600' },
});
