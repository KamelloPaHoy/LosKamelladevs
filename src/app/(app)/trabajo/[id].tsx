/** Detalle de un trabajo con la opción de postularse (FE-04). */
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { Reputacion } from '@/components/estrellas';
import { Pantalla } from '@/components/pantalla';
import { Etiqueta } from '@/components/tarjeta-trabajo';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio, Radio } from '@/constants/tema';
import { useDetalleTrabajo } from '@/hooks/use-detalle-trabajo';
import { usePaleta } from '@/hooks/use-paleta';
import { formatearPrecio, textoCuando } from '@/utils/trabajos';

export default function DetalleTrabajo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useDetalleTrabajo(id);
  const paleta = usePaleta();

  if (vm.estado === 'cargando') {
    return (
      <Pantalla>
        <View style={estilos.centro}>
          <ActivityIndicator color={paleta.primario} size="large" />
        </View>
      </Pantalla>
    );
  }

  if (vm.estado !== 'listo' || !vm.trabajo) {
    return (
      <Pantalla>
        <AvisoError
          mensaje={vm.errorGeneral ?? 'Este trabajo ya no está disponible.'}
        />
      </Pantalla>
    );
  }

  const t = vm.trabajo;
  const pie = vm.esMio ? (
    <Parrafo secundario style={estilos.centrado}>
      Este trabajo lo publicaste tú.
    </Parrafo>
  ) : vm.yaPostulado ? (
    <View style={[estilos.exito, { borderColor: paleta.exito }]} accessibilityLiveRegion="polite">
      <Text style={[estilos.textoExito, { color: paleta.exito }]}>
        ✓ Te postulaste. Si te eligen, te avisamos y podrán ver sus números.
      </Text>
    </View>
  ) : (
    <Boton
      titulo="Postularme"
      alPresionar={vm.postularse}
      cargando={vm.postulando}
      textoCargando="Enviando tu postulación"
    />
  );

  return (
    <Pantalla pie={pie}>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <View style={estilos.fila}>
            <Etiqueta texto={t.categoria} />
            <Text style={[estilos.dato, { color: paleta.textoSecundario }]}>
              {textoCuando(t.cuando)}
            </Text>
          </View>
          <Titulo>{t.titulo}</Titulo>
          <Text style={[estilos.precio, { color: paleta.texto }]}>{formatearPrecio(t.precio)}</Text>
          <Text style={[estilos.dato, { color: vm.cercano ? paleta.exito : paleta.textoSecundario }]}>
            {vm.cercano ? `● En tu barrio · ${t.barrio}` : t.barrio}
          </Text>
        </View>

        <Parrafo>{t.descripcion}</Parrafo>

        <View style={[estilos.caja, { borderColor: paleta.borde, backgroundColor: paleta.superficie }]}>
          <Text style={[estilos.etiquetaCaja, { color: paleta.textoSecundario }]}>PUBLICADO POR</Text>
          <Parrafo style={{ fontWeight: '700' }}>{t.publicadoPor.nombre}</Parrafo>
          <Reputacion persona={t.publicadoPor} />
        </View>

        <Parrafo secundario style={estilos.nota}>
          Por tu seguridad, los números de celular solo se muestran cuando te eligen y ambos aceptan
          el trabajo.
        </Parrafo>

        <AvisoError mensaje={vm.errorGeneral} />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  centro: { paddingVertical: Espacio.xl, alignItems: 'center' },
  centrado: { textAlign: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dato: { fontSize: 15, fontWeight: '600' },
  precio: { fontSize: 30, fontWeight: '800', fontVariant: ['tabular-nums'] },
  caja: { borderWidth: 1, borderRadius: Radio, padding: Espacio.m, gap: Espacio.xs },
  etiquetaCaja: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  nota: { fontSize: 14, lineHeight: 20 },
  exito: { borderWidth: 1.5, borderRadius: Radio, padding: Espacio.m },
  textoExito: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
});
