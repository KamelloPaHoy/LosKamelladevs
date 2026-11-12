/** Paso 2: el usuario escribe el código de 6 números que le llegó por SMS. */
import { Redirect, router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoCodigo } from '@/components/campo-codigo';
import { Pantalla } from '@/components/pantalla';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio, Radio } from '@/constants/tema';
import { useVerificarCodigo } from '@/hooks/use-verificar-codigo';
import { usePaleta } from '@/hooks/use-paleta';
import { CodigoDePrueba } from '@/servicios/auth/auth-simulado';
import { UsandoAuthSimulado } from '@/servicios/auth';
import { ocultarCelular } from '@/utils/validaciones';

export default function Codigo() {
  const vm = useVerificarCodigo();
  const paleta = usePaleta();

  // Si se llega aquí sin haber pedido un SMS (por ejemplo, recargando), se vuelve al paso 1.
  if (!vm.verificacion) return <Redirect href="/celular" />;

  const textoReenvio =
    vm.segundosParaReenviar > 0
      ? `Pedir otro código en ${vm.segundosParaReenviar} s`
      : 'Pedir otro código';

  return (
    <Pantalla
      pie={
        <>
          <Boton
            titulo={textoReenvio}
            variante="secundario"
            alPresionar={vm.reenviar}
            deshabilitado={vm.segundosParaReenviar > 0 || vm.verificando}
            cargando={vm.reenviando}
            textoCargando="Enviando otro código"
          />
          <Boton titulo="Cambiar número" variante="texto" alPresionar={() => router.back()} />
        </>
      }>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <Titulo>Escribe el código</Titulo>
          <Parrafo secundario>
            Lo enviamos por SMS al {ocultarCelular(vm.verificacion.celular)}.
          </Parrafo>
        </View>

        <CampoCodigo
          valor={vm.codigo}
          alCambiar={vm.setCodigo}
          error={vm.error}
          deshabilitado={vm.verificando}
        />

        {vm.verificando ? (
          <View style={estilos.verificando} accessibilityLiveRegion="polite">
            <ActivityIndicator color={paleta.primario} />
            <Parrafo secundario>Verificando…</Parrafo>
          </View>
        ) : null}

        <AvisoError mensaje={vm.errorGeneral} />

        {UsandoAuthSimulado ? (
          <View style={[estilos.prueba, { borderColor: paleta.borde }]}>
            <Parrafo secundario style={estilos.textoPrueba}>
              Modo de prueba (sin Firebase): usa el código {CodigoDePrueba}.
            </Parrafo>
          </View>
        ) : null}
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  verificando: { flexDirection: 'row', alignItems: 'center', gap: Espacio.s },
  prueba: { borderWidth: 1, borderStyle: 'dashed', borderRadius: Radio, padding: Espacio.m },
  textoPrueba: { fontSize: 14, lineHeight: 20 },
});
