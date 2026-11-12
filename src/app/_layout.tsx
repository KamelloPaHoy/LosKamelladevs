import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePaleta } from '@/hooks/use-paleta';
import { ProveedorSesion, useSesion } from '@/sesion/proveedor-sesion';

SplashScreen.preventAutoHideAsync();

export default function RaizLayout() {
  const esquema = useColorScheme();
  return (
    <ThemeProvider value={esquema === 'dark' ? DarkTheme : DefaultTheme}>
      <ProveedorSesion>
        <Navegacion />
      </ProveedorSesion>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function Navegacion() {
  const { listo, usuario, perfil } = useSesion();
  const paleta = usePaleta();

  useEffect(() => {
    if (listo) SplashScreen.hideAsync();
  }, [listo]);

  if (!listo) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: paleta.fondo },
      }}>
      {/* Sin sesión: bienvenida, celular y código. */}
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="(acceso)" />
      </Stack.Protected>

      {/* Con sesión pero sin perfil: primera vez que entra. */}
      <Stack.Protected guard={!!usuario && !perfil}>
        <Stack.Screen name="completar-registro" />
      </Stack.Protected>

      {/* Con sesión y perfil: el resto de la app. */}
      <Stack.Protected guard={!!usuario && !!perfil}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      {/* Se puede abrir desde cualquier lado. */}
      <Stack.Screen
        name="politica"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Política de datos',
          headerStyle: { backgroundColor: paleta.fondo },
          headerTintColor: paleta.primario,
          headerTitleStyle: { color: paleta.texto },
        }}
      />
    </Stack>
  );
}
