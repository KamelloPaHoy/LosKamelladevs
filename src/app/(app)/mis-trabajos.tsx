/** Mis trabajos: lo que publiqué (contratante) y donde me postulé (trabajador), con su estado. */
import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Pantalla } from '@/components/pantalla';
import { TarjetaTrabajo } from '@/components/tarjeta-trabajo';
import { Parrafo } from '@/components/textos';
import { Espacio } from '@/constants/tema';
import {
  estadoParaContratante,
  estadoParaTrabajador,
  useMisTrabajos,
} from '@/hooks/use-mis-trabajos';
import { usePaleta } from '@/hooks/use-paleta';
import type { Trabajo } from '@/servicios/trabajos';

export default function MisTrabajos() {
  const vm = useMisTrabajos();
  const paleta = usePaleta();
  const abrir = (t: Trabajo) => router.push({ pathname: '/trabajo/[id]', params: { id: t.id } });

  return (
    <Pantalla>
      <View style={{ gap: Espacio.l }}>
        {vm.cargando ? (
          <View style={estilos.centro}>
            <ActivityIndicator color={paleta.primario} size="large" />
          </View>
        ) : vm.error ? (
          <AvisoError mensaje={vm.error} />
        ) : vm.datos ? (
          <>
            <Seccion titulo="Lo que publiqué" vacio="Todavía no has publicado trabajos.">
              {vm.datos.publicados.map((t) => (
                <TarjetaTrabajo
                  key={t.id}
                  trabajo={t}
                  cercano={false}
                  estadoTexto={estadoParaContratante(t)}
                  alPresionar={() => abrir(t)}
                />
              ))}
            </Seccion>
            <Seccion titulo="Donde me postulé" vacio="Todavía no te has postulado a ningún trabajo.">
              {vm.datos.comoTrabajador.map((t) => (
                <TarjetaTrabajo
                  key={t.id}
                  trabajo={t}
                  cercano={false}
                  estadoTexto={estadoParaTrabajador(t)}
                  alPresionar={() => abrir(t)}
                />
              ))}
            </Seccion>
          </>
        ) : null}
      </View>
    </Pantalla>
  );
}

function Seccion({
  titulo,
  vacio,
  children,
}: {
  titulo: string;
  vacio: string;
  children: React.ReactNode[];
}) {
  const paleta = usePaleta();
  return (
    <View style={{ gap: Espacio.s }}>
      <Text accessibilityRole="header" style={[estilos.seccion, { color: paleta.textoSecundario }]}>
        {titulo.toUpperCase()}
      </Text>
      {children.length === 0 ? (
        <Parrafo secundario>{vacio}</Parrafo>
      ) : (
        <View style={{ gap: Espacio.m }}>{children}</View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { paddingVertical: Espacio.xl, alignItems: 'center' },
  seccion: { fontSize: 13, fontWeight: '700', letterSpacing: 0.6 },
});
