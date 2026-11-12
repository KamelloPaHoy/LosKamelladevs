import { Stack } from 'expo-router';

import { usePaleta } from '@/hooks/use-paleta';

export default function AccesoLayout() {
  const paleta = usePaleta();
  return (
    <Stack
      screenOptions={{
        title: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: paleta.fondo },
        headerTintColor: paleta.primario,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: paleta.fondo },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="celular" />
      <Stack.Screen name="codigo" />
    </Stack>
  );
}
