import { Linking, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Espacio, Radio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';
import type { Contacto } from '@/servicios/trabajos';
import { formatearCelular } from '@/utils/validaciones';

/** El celular de la otra parte (HU-13). Solo se muestra con el trabajo En curso. */
export function TarjetaContacto({ contacto }: { contacto: Contacto }) {
  const paleta = usePaleta();
  const celular = formatearCelular(contacto.celular.replace('+57', ''));
  return (
    <View style={[estilos.caja, { borderColor: paleta.exito, backgroundColor: paleta.superficie }]}>
      <Text style={[estilos.etiqueta, { color: paleta.exito }]}>CONTACTO</Text>
      <Text style={[estilos.nombre, { color: paleta.texto }]}>{contacto.nombre}</Text>
      <Text selectable style={[estilos.celular, { color: paleta.texto }]}>
        +57 {celular}
      </Text>
      <Text style={[estilos.nota, { color: paleta.textoSecundario }]}>
        Lo ves porque ambos aceptaron el trabajo. Úsalo solo para este trabajo.
      </Text>
      <Boton
        titulo="Llamar"
        variante="secundario"
        alPresionar={() => void Linking.openURL(`tel:${contacto.celular}`).catch(() => undefined)}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { borderWidth: 1.5, borderRadius: Radio, padding: Espacio.m, gap: Espacio.xs },
  etiqueta: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  nombre: { fontSize: 17, fontWeight: '700' },
  celular: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  nota: { fontSize: 14, lineHeight: 20, marginBottom: Espacio.s },
});
