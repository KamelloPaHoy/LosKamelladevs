/**
 * Inicio: todos los trabajos disponibles, con los más cercanos primero (FE-04),
 * y los trabajos terminados que faltan por calificar (FE-06).
 */
import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { Pantalla } from '@/components/pantalla';
import { TarjetaTrabajo } from '@/components/tarjeta-trabajo';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio, Radio } from '@/constants/tema';
import { useListaTrabajos } from '@/hooks/use-lista-trabajos';
import { usePaleta } from '@/hooks/use-paleta';
import { UsandoTrabajosSimulados, type Trabajo } from '@/servicios/trabajos';
import { useSesion } from '@/sesion/proveedor-sesion';

export default function Inicio() {
  const { perfil, cerrarSesion } = useSesion();
  const vm = useListaTrabajos();
  const paleta = usePaleta();
  const primerNombre = perfil?.nombre.split(' ')[0] ?? '';

  const abrir = (t: Trabajo) => router.push({ pathname: '/trabajo/[id]', params: { id: t.id } });

  return (
    <Pantalla
      pie={<Boton titulo="Publicar un trabajo" alPresionar={() => router.push('/publicar')} />}>
      <View style={estilos.columna}>
        <View style={estilos.encabezado}>
          <View style={estilos.saludo}>
            <Titulo>Hola, {primerNombre}</Titulo>
            <Parrafo secundario>Trabajos publicados en Barrancabermeja</Parrafo>
          </View>
          <Boton titulo="Salir" variante="texto" alPresionar={cerrarSesion} />
        </View>

        <Boton
          titulo="Mis trabajos"
          variante="secundario"
          alPresionar={() => router.push('/mis-trabajos')}
        />

        {vm.pendientes.map((p) => (
          <View
            key={p.trabajo.id}
            style={[estilos.pendiente, { borderColor: paleta.primario, backgroundColor: paleta.superficie }]}>
            <Parrafo>
              <Text style={{ fontWeight: '700' }}>Califica a {p.calificado.nombre}</Text> por
              «{p.trabajo.titulo}». Tu opinión ayuda a otros a escoger.
            </Parrafo>
            <Boton
              titulo="Calificar"
              variante="secundario"
              alPresionar={() =>
                router.push({ pathname: '/calificar/[id]', params: { id: p.trabajo.id } })
              }
            />
          </View>
        ))}

        {vm.estado === 'cargando' ? (
          <View style={estilos.centro} accessibilityLiveRegion="polite">
            <ActivityIndicator color={paleta.primario} size="large" />
            <Parrafo secundario>Buscando trabajos…</Parrafo>
          </View>
        ) : vm.estado === 'error' ? (
          <View style={{ gap: Espacio.m }}>
            <AvisoError mensaje={vm.error} />
            <Boton titulo="Intentar de nuevo" variante="secundario" alPresionar={vm.reintentar} />
          </View>
        ) : vm.cercanos.length + vm.otros.length === 0 ? (
          <View style={estilos.centro}>
            <Parrafo style={estilos.vacioTitulo}>Todavía no hay trabajos publicados</Parrafo>
            <Parrafo secundario style={estilos.vacioTexto}>
              Publica lo que necesitas y la gente del distrito podrá postularse.
            </Parrafo>
          </View>
        ) : (
          <>
            {vm.cercanos.length > 0 ? (
              <Seccion titulo={`Más cercanos a ti · ${vm.miBarrio}`}>
                {vm.cercanos.map((t) => (
                  <TarjetaTrabajo key={t.id} trabajo={t} cercano alPresionar={() => abrir(t)} />
                ))}
              </Seccion>
            ) : null}
            {vm.otros.length > 0 ? (
              <Seccion titulo={vm.cercanos.length > 0 ? 'Otros barrios' : 'Todos los trabajos'}>
                {vm.otros.map((t) => (
                  <TarjetaTrabajo
                    key={t.id}
                    trabajo={t}
                    cercano={false}
                    alPresionar={() => abrir(t)}
                  />
                ))}
              </Seccion>
            ) : null}
          </>
        )}

        {UsandoTrabajosSimulados ? (
          <View style={[estilos.prueba, { borderColor: paleta.borde }]}>
            <Parrafo secundario style={estilos.textoPrueba}>
              Modo de prueba: estos trabajos y personas son ejemplos inventados.
            </Parrafo>
          </View>
        ) : null}
      </View>
    </Pantalla>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const paleta = usePaleta();
  return (
    <View style={{ gap: Espacio.s }}>
      <Text accessibilityRole="header" style={[estilos.seccion, { color: paleta.textoSecundario }]}>
        {titulo.toUpperCase()}
      </Text>
      <View style={{ gap: Espacio.m }}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  columna: { gap: Espacio.l },
  encabezado: { flexDirection: 'row', alignItems: 'flex-start', gap: Espacio.m },
  saludo: { flex: 1, gap: Espacio.xs },
  pendiente: { borderWidth: 2, borderRadius: Radio, padding: Espacio.m, gap: Espacio.m },
  centro: { alignItems: 'center', gap: Espacio.s, paddingVertical: Espacio.xl },
  vacioTitulo: { fontWeight: '700', textAlign: 'center' },
  vacioTexto: { textAlign: 'center' },
  seccion: { fontSize: 13, fontWeight: '700', letterSpacing: 0.6 },
  prueba: { borderWidth: 1, borderStyle: 'dashed', borderRadius: Radio, padding: Espacio.m },
  textoPrueba: { fontSize: 14, lineHeight: 20 },
});
