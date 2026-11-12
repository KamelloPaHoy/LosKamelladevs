/** FE-05: chat entre contratante y trabajador, disponible mientras el trabajo está En curso. */
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AltoTactil, AnchoMaximo, Espacio, Radio } from '@/constants/tema';
import { LargoMaximoMensaje, useChat } from '@/hooks/use-chat';
import { usePaleta } from '@/hooks/use-paleta';
import type { Mensaje } from '@/servicios/trabajos';

/** «8:05 a. m.» sin depender de Intl. */
function hora(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useChat(id);
  const paleta = usePaleta();
  const lista = useRef<FlatList<Mensaje>>(null);

  // Cada mensaje nuevo lleva la lista hasta abajo.
  useEffect(() => {
    if (vm.mensajes.length > 0) lista.current?.scrollToEnd({ animated: true });
  }, [vm.mensajes.length]);

  const puedeEnviar = vm.puedeEscribir && vm.texto.trim().length > 0 && !vm.enviando;

  return (
    <SafeAreaView edges={['bottom']} style={[estilos.raiz, { backgroundColor: paleta.fondo }]}>
      <Stack.Screen options={{ title: vm.nombreOtra }} />
      <KeyboardAvoidingView
        style={estilos.raiz}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={lista}
          data={vm.mensajes}
          keyExtractor={(m) => m.id}
          contentContainerStyle={estilos.contenido}
          onContentSizeChange={() => lista.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={
            <Text style={[estilos.aviso, { color: paleta.textoSecundario }]}>
              {vm.trabajo ? `Trabajo: ${vm.trabajo.titulo}. ` : ''}Por tu seguridad, no compartas
              datos bancarios ni claves.
            </Text>
          }
          ListEmptyComponent={
            <Text style={[estilos.vacio, { color: paleta.textoSecundario }]}>
              Escribe el primer mensaje para acordar la hora y los detalles.
            </Text>
          }
          renderItem={({ item }) => {
            const mio = vm.esMio(item);
            return (
              <View
                accessibilityLabel={`${mio ? 'Tú' : vm.nombreOtra}: ${item.texto}. ${hora(item.enviadoEn)}`}
                style={[
                  estilos.burbuja,
                  mio
                    ? [estilos.mia, { backgroundColor: paleta.primario }]
                    : [
                        estilos.suya,
                        { backgroundColor: paleta.superficie, borderColor: paleta.borde },
                      ],
                ]}>
                <Text style={[estilos.texto, { color: mio ? paleta.sobrePrimario : paleta.texto }]}>
                  {item.texto}
                </Text>
                <Text
                  style={[
                    estilos.hora,
                    { color: mio ? paleta.sobrePrimario : paleta.textoSecundario },
                  ]}>
                  {hora(item.enviadoEn)}
                </Text>
              </View>
            );
          }}
        />

        {vm.error ? (
          <Text accessibilityLiveRegion="polite" style={[estilos.error, { color: paleta.error }]}>
            {vm.error}
          </Text>
        ) : null}

        {vm.puedeEscribir ? (
          <View style={[estilos.barra, { borderTopColor: paleta.borde }]}>
            <TextInput
              value={vm.texto}
              onChangeText={vm.setTexto}
              placeholder="Escribe un mensaje"
              placeholderTextColor={paleta.textoDeshabilitado}
              accessibilityLabel="Mensaje"
              multiline
              maxLength={LargoMaximoMensaje}
              style={[
                estilos.entrada,
                { color: paleta.texto, backgroundColor: paleta.superficie, borderColor: paleta.borde },
                Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
              ]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              accessibilityState={{ disabled: !puedeEnviar, busy: vm.enviando }}
              disabled={!puedeEnviar}
              onPress={vm.enviar}
              style={[
                estilos.enviar,
                { backgroundColor: puedeEnviar ? paleta.primario : paleta.deshabilitado },
              ]}>
              <Text
                style={[
                  estilos.textoEnviar,
                  { color: puedeEnviar ? paleta.sobrePrimario : paleta.textoDeshabilitado },
                ]}>
                Enviar
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text style={[estilos.cerrado, { color: paleta.textoSecundario, borderTopColor: paleta.borde }]}>
            {vm.trabajo?.estado === 'Terminado'
              ? 'El trabajo terminó. El chat queda solo para leer.'
              : 'El chat se abre cuando el trabajo está en curso.'}
          </Text>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  contenido: {
    padding: Espacio.m,
    gap: Espacio.s,
    width: '100%',
    maxWidth: AnchoMaximo,
    alignSelf: 'center',
    flexGrow: 1,
  },
  aviso: { fontSize: 13, lineHeight: 18, textAlign: 'center', marginBottom: Espacio.s },
  vacio: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: Espacio.xl },
  burbuja: { maxWidth: '82%', borderRadius: Radio, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  mia: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  suya: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  texto: { fontSize: 16, lineHeight: 22 },
  hora: { fontSize: 11, opacity: 0.85, alignSelf: 'flex-end' },
  error: { fontSize: 14, paddingHorizontal: Espacio.m, paddingBottom: Espacio.xs },
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Espacio.s,
    padding: Espacio.s,
    paddingHorizontal: Espacio.m,
    borderTopWidth: 1,
  },
  entrada: {
    flex: 1,
    minHeight: AltoTactil,
    maxHeight: 120,
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: Espacio.m,
    paddingVertical: 12,
    fontSize: 16,
  },
  enviar: {
    minHeight: AltoTactil,
    borderRadius: 26,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  textoEnviar: { fontSize: 16, fontWeight: '700' },
  cerrado: {
    fontSize: 14,
    textAlign: 'center',
    padding: Espacio.m,
    borderTopWidth: 1,
  },
});
