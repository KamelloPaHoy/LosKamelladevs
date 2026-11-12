import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Espacio, Radio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';
import { LargoCodigo, soloDigitos } from '@/utils/validaciones';

type Props = {
  valor: string;
  alCambiar: (valor: string) => void;
  error?: string | null;
  deshabilitado?: boolean;
};

/**
 * Seis casillas para el código del SMS. Por debajo es un solo TextInput,
 * así funciona el autocompletado del SMS en Android e iOS y el pegado.
 */
export function CampoCodigo({ valor, alCambiar, error, deshabilitado = false }: Props) {
  const paleta = usePaleta();
  const entrada = useRef<TextInput>(null);
  const [enfocado, setEnfocado] = useState(false);
  const digitos = valor.split('');

  return (
    <View style={estilos.contenedor}>
      <Pressable
        accessible={false}
        onPress={() => entrada.current?.focus()}
        style={estilos.casillas}>
        {Array.from({ length: LargoCodigo }, (_, i) => {
          const actual = enfocado && i === Math.min(valor.length, LargoCodigo - 1);
          return (
            <View
              key={i}
              style={[
                estilos.casilla,
                {
                  backgroundColor: paleta.superficie,
                  borderColor: error ? paleta.error : actual ? paleta.bordeFoco : paleta.borde,
                  borderWidth: actual || error ? 2 : 1.5,
                },
              ]}>
              <Text style={[estilos.digito, { color: paleta.texto }]}>{digitos[i] ?? ''}</Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={entrada}
        value={valor}
        onChangeText={(texto) => alCambiar(soloDigitos(texto).slice(0, LargoCodigo))}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        editable={!deshabilitado}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={LargoCodigo}
        autoFocus
        accessibilityLabel={`Código de ${LargoCodigo} números`}
        accessibilityHint={error ?? undefined}
        caretHidden
        style={estilos.oculto}
      />
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
  casillas: { flexDirection: 'row', justifyContent: 'space-between', gap: Espacio.s },
  casilla: {
    flex: 1,
    maxWidth: 56,
    height: 60,
    borderRadius: Radio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digito: { fontSize: 26, fontWeight: '600' },
  // Invisible pero presente: recibe el teclado, el pegado y el autocompletado del SMS.
  oculto: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  error: { fontSize: 14, lineHeight: 20 },
});
