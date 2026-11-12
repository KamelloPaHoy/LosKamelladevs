/** Paso 3 (solo la primera vez): nombre, barrio y aceptación de la política de datos. */
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { Casilla } from '@/components/casilla';
import { Pantalla } from '@/components/pantalla';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio } from '@/constants/tema';
import { useCompletarRegistro } from '@/hooks/use-completar-registro';
import { abrirLey1581 } from '@/utils/abrir-ley';

export default function CompletarRegistro() {
  const vm = useCompletarRegistro();

  return (
    <Pantalla
      pie={
        <Boton
          titulo="Crear mi cuenta"
          alPresionar={vm.guardar}
          cargando={vm.guardando}
          textoCargando="Creando tu cuenta"
        />
      }>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <Titulo>Ya casi terminas</Titulo>
          <Parrafo secundario>
            Cuéntanos cómo te llamas y en qué barrio vives. Así te mostramos primero los trabajos más cercanos a ti.
          </Parrafo>
        </View>

        <CampoTexto
          etiqueta="Nombre"
          value={vm.nombre}
          onChangeText={vm.setNombre}
          onBlur={vm.validarNombreAlSalir}
          error={vm.errores.nombre}
          placeholder="Como quieres que te vean"
          textContentType="name"
          autoComplete="name"
          autoCapitalize="words"
          returnKeyType="next"
          maxLength={60}
        />

        <CampoTexto
          etiqueta="Barrio"
          value={vm.barrio}
          onChangeText={vm.setBarrio}
          onBlur={vm.validarBarrioAlSalir}
          error={vm.errores.barrio}
          ayuda="Solo mostramos el barrio, nunca tu dirección."
          placeholder="Nombre de tu barrio"
          autoCapitalize="words"
          returnKeyType="done"
          maxLength={50}
        />

        <View style={estilos.habeasData}>
          <Casilla
            marcada={vm.aceptaPolitica}
            alCambiar={vm.setAceptaPolitica}
            etiquetaAccesible="Autorizo el tratamiento de mis datos personales según la política de Kamello y la Ley 1581 de 2012"
            error={vm.errores.politica}>
            <Parrafo>
              Autorizo el tratamiento de mis datos personales (habeas data), según la política de
              Kamello y la Ley 1581 de 2012.
            </Parrafo>
          </Casilla>
          <View style={estilos.enlaces}>
            <Boton
              titulo="Leer la política"
              variante="texto"
              alPresionar={() => router.push('/politica')}
            />
            <Boton titulo="Leer la ley" variante="texto" alPresionar={abrirLey1581} />
          </View>
        </View>

        <AvisoError mensaje={vm.errorGeneral} />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  habeasData: { gap: Espacio.xs },
  // Alineados con el texto de la casilla (26 del cuadro + 16 de separación).
  enlaces: { flexDirection: 'row', flexWrap: 'wrap', columnGap: Espacio.l, marginLeft: 42 },
});
