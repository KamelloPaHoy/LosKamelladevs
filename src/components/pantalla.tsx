import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnchoMaximo, Espacio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

type Props = {
  children: ReactNode;
  /** Contenido fijo abajo (por ejemplo el botón principal), que sube con el teclado. */
  pie?: ReactNode;
};

/** Contenedor de cada pantalla: respeta la zona segura, se desplaza y no queda tapado por el teclado. */
export function Pantalla({ children, pie }: Props) {
  const paleta = usePaleta();
  return (
    <SafeAreaView style={[estilos.raiz, { backgroundColor: paleta.fondo }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={estilos.raiz}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={estilos.contenido}
          keyboardShouldPersistTaps="handled">
          <View style={estilos.columna}>{children}</View>
        </ScrollView>
        {pie ? <View style={[estilos.pie, estilos.columna]}>{pie}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: Espacio.m,
    paddingTop: Espacio.l,
    paddingBottom: Espacio.l,
  },
  columna: { width: '100%', maxWidth: AnchoMaximo, alignSelf: 'center' },
  pie: { paddingHorizontal: Espacio.m, paddingBottom: Espacio.m, gap: Espacio.s },
});
