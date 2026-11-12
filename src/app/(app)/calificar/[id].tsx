/** FE-06: calificar con estrellas y comentario cuando el trabajo termina. */
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { SelectorEstrellas } from '@/components/estrellas';
import { Pantalla } from '@/components/pantalla';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio } from '@/constants/tema';
import { useCalificar } from '@/hooks/use-calificar';
import { usePaleta } from '@/hooks/use-paleta';

export default function Calificar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useCalificar(id);
  const paleta = usePaleta();

  if (vm.estado === 'cargando') {
    return (
      <Pantalla>
        <View style={estilos.centro}>
          <ActivityIndicator color={paleta.primario} size="large" />
        </View>
      </Pantalla>
    );
  }

  if (vm.estado === 'no-existe' || !vm.pendiente) {
    return (
      <Pantalla>
        <AvisoError mensaje="Ya calificaste este trabajo o no está disponible." />
      </Pantalla>
    );
  }

  const { calificado, trabajo } = vm.pendiente;

  return (
    <Pantalla
      pie={
        <Boton
          titulo="Enviar calificación"
          alPresionar={vm.enviar}
          cargando={vm.enviando}
          textoCargando="Enviando la calificación"
        />
      }>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <Titulo>¿Cómo te fue con {calificado.nombre}?</Titulo>
          <Parrafo secundario>Trabajo: {trabajo.titulo}</Parrafo>
        </View>

        <SelectorEstrellas
          valor={vm.estrellas}
          alCambiar={vm.setEstrellas}
          error={vm.errorEstrellas}
        />

        <CampoTexto
          etiqueta="Comentario (opcional)"
          multilinea
          value={vm.comentario}
          onChangeText={vm.setComentario}
          error={vm.errorComentario}
          ayuda="Tu calificación se publica con tu nombre."
          placeholder="Ej.: Llegó a tiempo y dejó todo limpio."
          maxLength={300}
        />

        <AvisoError mensaje={vm.errorGeneral} />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  centro: { paddingVertical: Espacio.xl, alignItems: 'center' },
});
