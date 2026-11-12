/** Paso 1: el usuario escribe su celular y pide el código por SMS. */
import { View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { CampoTexto } from '@/components/campo-texto';
import { Pantalla } from '@/components/pantalla';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio } from '@/constants/tema';
import { useIngresoCelular } from '@/hooks/use-ingreso-celular';

export default function Celular() {
  const vm = useIngresoCelular();

  return (
    <Pantalla
      pie={
        <Boton
          titulo="Enviarme el código"
          alPresionar={vm.enviar}
          deshabilitado={!vm.puedeEnviar}
          cargando={vm.enviando}
          textoCargando="Enviando el código"
        />
      }>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <Titulo>¿Cuál es tu celular?</Titulo>
          <Parrafo secundario>
            Te enviaremos un código por SMS para confirmar que eres tú. Si es tu primera vez, con
            esto creamos tu cuenta.
          </Parrafo>
        </View>

        <CampoTexto
          etiqueta="Número de celular"
          prefijo="+57"
          value={vm.celular}
          onChangeText={vm.setCelular}
          onBlur={vm.validarAlSalir}
          onSubmitEditing={vm.enviar}
          error={vm.error}
          ayuda="Tu número no se muestra a nadie hasta que aceptes un trabajo."
          placeholder="300 123 4567"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType="send"
          maxLength={12}
          autoFocus
        />

        <AvisoError mensaje={vm.errorGeneral} />
      </View>
    </Pantalla>
  );
}
