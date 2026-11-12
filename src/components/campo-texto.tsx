import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AltoTactil, Espacio, Radio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

type Props = Omit<TextInputProps, 'style'> & {
  etiqueta: string;
  /** Mensaje de error; si existe, el campo se marca en rojo. */
  error?: string | null;
  ayuda?: string;
  /** Texto fijo a la izquierda, por ejemplo «+57». */
  prefijo?: string;
  /** Campo de varias líneas, por ejemplo una descripción. */
  multilinea?: boolean;
};

export function CampoTexto({
  etiqueta,
  error,
  ayuda,
  prefijo,
  multilinea = false,
  onFocus,
  onBlur,
  ...resto
}: Props) {
  const paleta = usePaleta();
  const [enfocado, setEnfocado] = useState(false);

  const colorBorde = error ? paleta.error : enfocado ? paleta.bordeFoco : paleta.borde;

  return (
    <View style={estilos.contenedor}>
      <Text style={[estilos.etiqueta, { color: paleta.texto }]}>{etiqueta}</Text>
      <View
        style={[
          estilos.caja,
          multilinea && estilos.cajaMultilinea,
          {
            borderColor: colorBorde,
            borderWidth: enfocado || error ? 2 : 1.5,
            backgroundColor: paleta.superficie,
          },
        ]}>
        {prefijo ? (
          <Text style={[estilos.prefijo, { color: paleta.textoSecundario }]}>{prefijo}</Text>
        ) : null}
        <TextInput
          accessibilityLabel={etiqueta}
          accessibilityHint={error ?? ayuda}
          placeholderTextColor={paleta.textoDeshabilitado}
          multiline={multilinea}
          textAlignVertical={multilinea ? 'top' : 'center'}
          style={[
            estilos.entrada,
            multilinea && estilos.entradaMultilinea,
            { color: paleta.texto },
            SinContornoWeb,
          ]}
          onFocus={(e) => {
            setEnfocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setEnfocado(false);
            onBlur?.(e);
          }}
          {...resto}
        />
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={[estilos.mensaje, { color: paleta.error }]}>
          {error}
        </Text>
      ) : ayuda ? (
        <Text style={[estilos.mensaje, { color: paleta.textoSecundario }]}>{ayuda}</Text>
      ) : null}
    </View>
  );
}

// En web, el navegador dibuja su propio contorno al enfocar; aquí el foco ya lo marca la caja.
const SinContornoWeb = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null;

const estilos = StyleSheet.create({
  contenedor: { gap: Espacio.s },
  etiqueta: { fontSize: 15, fontWeight: '600' },
  caja: {
    minHeight: AltoTactil,
    borderRadius: Radio,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Espacio.m,
  },
  cajaMultilinea: { alignItems: 'flex-start' },
  entradaMultilinea: { minHeight: 112, fontSize: 17, lineHeight: 24 },
  prefijo: { fontSize: 18, marginRight: Espacio.s, fontWeight: '500' },
  entrada: { flex: 1, fontSize: 18, paddingVertical: 12, minWidth: 0 },
  mensaje: { fontSize: 14, lineHeight: 20 },
});
