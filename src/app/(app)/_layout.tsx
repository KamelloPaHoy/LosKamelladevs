import { Stack } from 'expo-router';

import { usePaleta } from '@/hooks/use-paleta';

export default function AppLayout() {
  const paleta = usePaleta();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: paleta.fondo },
        headerTintColor: paleta.primario,
        headerTitleStyle: { color: paleta.texto },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: paleta.fondo },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="publicar" options={{ title: 'Publicar un trabajo' }} />
      <Stack.Screen name="trabajo/[id]" options={{ title: 'Detalle del trabajo' }} />
      <Stack.Screen name="calificar/[id]" options={{ title: 'Calificar' }} />
      <Stack.Screen name="mis-trabajos" options={{ title: 'Mis trabajos' }} />
      <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
    </Stack>
  );
}
