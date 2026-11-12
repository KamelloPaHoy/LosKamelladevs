/** Bienvenida: primera pantalla para quien no ha iniciado sesión. */
import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Pantalla } from '@/components/pantalla';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio } from '@/constants/tema';
import { usePaleta } from '@/hooks/use-paleta';

export default function Bienvenida() {
  const paleta = usePaleta();
  return (
    <Pantalla
      pie={
        <>
          <Boton titulo="Entrar con mi celular" alPresionar={() => router.push('/celular')} />
          <Parrafo secundario style={estilos.legal}>
            Al continuar te mostramos nuestra{' '}
            <Link href="/politica" style={{ color: paleta.primario, fontWeight: '600' }}>
              política de tratamiento de datos
            </Link>
            .
          </Parrafo>
        </>
      }>
      <View style={estilos.centro}>
        <View
          accessible
          accessibilityLabel="Kamello Pa' Hoy"
          style={[estilos.marca, { backgroundColor: paleta.primario }]}>
          <Text style={[estilos.letra, { color: paleta.sobrePrimario }]}>K</Text>
        </View>
        <Titulo style={estilos.nombre}>Kamello Pa&apos; Hoy</Titulo>
        <Parrafo secundario style={estilos.lema}>
          Trabajos sencillos en Barrancabermeja, con gente del barrio y para hoy mismo.
        </Parrafo>

        <View style={estilos.puntos}>
          <Punto texto="Publica lo que necesitas y recibe postulaciones." />
          <Punto texto="Mira todos los trabajos publicados, con los más cercanos a ti primero." />
          <Punto texto="Tu número solo se ve cuando ambos aceptan el trabajo." />
        </View>
      </View>
    </Pantalla>
  );
}

function Punto({ texto }: { texto: string }) {
  const paleta = usePaleta();
  return (
    <View style={estilos.punto}>
      <View style={[estilos.vineta, { backgroundColor: paleta.primario }]} />
      <Parrafo style={estilos.textoPunto}>{texto}</Parrafo>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', gap: Espacio.m },
  marca: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letra: { fontSize: 40, fontWeight: '800' },
  nombre: { fontSize: 32, lineHeight: 38, marginTop: Espacio.s },
  lema: { fontSize: 18, lineHeight: 26 },
  puntos: { gap: Espacio.m, marginTop: Espacio.l },
  punto: { flexDirection: 'row', gap: Espacio.m, alignItems: 'flex-start' },
  vineta: { width: 8, height: 8, borderRadius: 4, marginTop: 9 },
  textoPunto: { flex: 1 },
  legal: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
