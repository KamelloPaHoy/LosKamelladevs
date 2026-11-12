/** FE-02: formulario para publicar un trabajo. Meta del producto: publicarlo en menos de 3 minutos. */
import { View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { Pantalla } from '@/components/pantalla';
import { SelectorChips } from '@/components/selector-chips';
import { Espacio } from '@/constants/tema';
import { usePublicarTrabajo } from '@/hooks/use-publicar-trabajo';
import { Categorias, Cuandos } from '@/servicios/trabajos';

export default function Publicar() {
  const vm = usePublicarTrabajo();

  return (
    <Pantalla
      pie={
        <Boton
          titulo="Publicar trabajo"
          alPresionar={vm.publicar}
          cargando={vm.publicando}
          textoCargando="Publicando el trabajo"
        />
      }>
      <View style={{ gap: Espacio.l }}>
        <CampoTexto
          etiqueta="¿Qué necesitas?"
          value={vm.titulo}
          onChangeText={vm.setTitulo}
          error={vm.errores.titulo}
          placeholder="Ej.: Pintar la reja del frente"
          maxLength={60}
          returnKeyType="next"
        />

        <SelectorChips
          etiqueta="Categoría"
          opciones={Categorias}
          valor={vm.categoria}
          alCambiar={vm.setCategoria}
          error={vm.errores.categoria}
        />

        <CampoTexto
          etiqueta="Descripción"
          multilinea
          value={vm.descripcion}
          onChangeText={vm.setDescripcion}
          error={vm.errores.descripcion}
          ayuda="Qué hay que hacer, qué tamaño tiene y qué materiales pones tú."
          placeholder="Ej.: Son 4 metros de reja. Yo pongo la pintura."
          maxLength={300}
        />

        <CampoTexto
          etiqueta="¿Cuánto pagas?"
          prefijo="$"
          value={vm.precio}
          onChangeText={vm.setPrecio}
          error={vm.errores.precio}
          ayuda="El pago se acuerda y se hace directamente entre ustedes."
          placeholder="50.000"
          keyboardType="number-pad"
          maxLength={9}
        />

        <SelectorChips
          etiqueta="¿Para cuándo?"
          opciones={Cuandos}
          valor={vm.cuando}
          alCambiar={vm.setCuando}
        />

        <CampoTexto
          etiqueta="Barrio"
          value={vm.barrio}
          onChangeText={vm.setBarrio}
          error={vm.errores.barrio}
          ayuda="Solo se muestra el barrio, nunca tu dirección."
          autoCapitalize="words"
          maxLength={50}
        />

        <AvisoError mensaje={vm.errorGeneral} />
      </View>
    </Pantalla>
  );
}
