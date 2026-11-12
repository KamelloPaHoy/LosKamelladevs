import type { ReactNode } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { usePaleta } from '@/hooks/use-paleta';

export function Titulo({ children, style, ...resto }: TextProps & { children: ReactNode }) {
  const paleta = usePaleta();
  return (
    <Text accessibilityRole="header" style={[estilos.titulo, { color: paleta.texto }, style]} {...resto}>
      {children}
    </Text>
  );
}

export function Parrafo({
  children,
  secundario = false,
  style,
  ...resto
}: TextProps & { children: ReactNode; secundario?: boolean }) {
  const paleta = usePaleta();
  return (
    <Text
      style={[estilos.parrafo, { color: secundario ? paleta.textoSecundario : paleta.texto }, style]}
      {...resto}>
      {children}
    </Text>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  parrafo: { fontSize: 16, lineHeight: 24 },
});
