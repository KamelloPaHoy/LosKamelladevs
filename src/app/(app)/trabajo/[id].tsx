/**
 * Detalle de un trabajo (FE-04). Cambia según quién lo mira y en qué estado está:
 * postularse · ver postulados y elegir · aceptar o rechazar · contacto, chat y terminar · calificar.
 */
import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AvisoError } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { Reputacion } from '@/components/estrellas';
import { Pantalla } from '@/components/pantalla';
import { TarjetaContacto } from '@/components/tarjeta-contacto';
import { EstadoChip, Etiqueta } from '@/components/tarjeta-trabajo';
import { Parrafo, Titulo } from '@/components/textos';
import { Espacio, Radio } from '@/constants/tema';
import { useDetalleTrabajo } from '@/hooks/use-detalle-trabajo';
import { estadoParaContratante, estadoParaTrabajador } from '@/hooks/use-mis-trabajos';
import { usePaleta } from '@/hooks/use-paleta';
import { formatearPrecio, textoCuando } from '@/utils/trabajos';

export default function DetalleTrabajo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useDetalleTrabajo(id);
  const paleta = usePaleta();

  if (vm.cargando) {
    return (
      <Pantalla>
        <View style={estilos.centro}>
          <ActivityIndicator color={paleta.primario} size="large" />
        </View>
      </Pantalla>
    );
  }

  const t = vm.trabajo;
  if (!t) {
    return (
      <Pantalla>
        <AvisoError mensaje="Este trabajo ya no existe." />
      </Pantalla>
    );
  }

  const abrirChat = () => router.push({ pathname: '/chat/[id]', params: { id: t.id } });
  const calificar = () => router.push({ pathname: '/calificar/[id]', params: { id: t.id } });
  const nombreTrabajador = t.trabajador?.nombre ?? '';
  const nombreContratante = t.publicadoPor.nombre;

  // Lo que se muestra debajo de la información del trabajo y el botón principal (pie).
  let panel: ReactNode = null;
  let pie: ReactNode = null;

  if (vm.rol === 'contratante') {
    if (t.estado === 'Disponible') {
      panel = (
        <Caja titulo={`Postulados (${vm.postulados.length})`}>
          {vm.postulados.length === 0 ? (
            <View style={estilos.esperando}>
              <ActivityIndicator color={paleta.primario} />
              <Parrafo secundario style={{ flex: 1 }}>
                Todavía nadie se ha postulado. En cuanto alguien lo haga, aparece aquí.
              </Parrafo>
            </View>
          ) : (
            vm.postulados.map((p) => (
              <View key={p.uid} style={[estilos.postulado, { borderTopColor: paleta.borde }]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Parrafo style={{ fontWeight: '700' }}>{p.nombre}</Parrafo>
                  <Reputacion persona={p} />
                </View>
                <Boton
                  titulo="Elegir"
                  variante="secundario"
                  alPresionar={() => vm.elegir(p.uid)}
                  cargando={vm.ocupado === 'elegir'}
                  deshabilitado={!!vm.ocupado}
                  textoCargando={`Eligiendo a ${p.nombre}`}
                />
              </View>
            ))
          )}
          <Parrafo secundario style={estilos.nota}>
            Los números de celular se comparten solo cuando eliges a alguien y esa persona acepta.
          </Parrafo>
        </Caja>
      );
    } else if (t.estado === 'Asignado') {
      panel = (
        <Caja titulo="Esperando respuesta">
          <View style={estilos.esperando}>
            <ActivityIndicator color={paleta.primario} />
            <Parrafo style={{ flex: 1 }}>
              Elegiste a <Text style={{ fontWeight: '700' }}>{nombreTrabajador}</Text>. Te avisamos
              cuando acepte el trabajo.
            </Parrafo>
          </View>
        </Caja>
      );
    } else if (t.estado === 'En curso') {
      panel = vm.contacto ? <TarjetaContacto contacto={vm.contacto} /> : null;
      pie = (
        <>
          <Boton titulo={`Escribirle a ${nombreTrabajador}`} alPresionar={abrirChat} />
          <Boton
            titulo="Marcar como terminado"
            variante="secundario"
            alPresionar={vm.terminar}
            cargando={vm.ocupado === 'terminar'}
            textoCargando="Marcando como terminado"
          />
        </>
      );
    }
  } else if (vm.rol === 'trabajador') {
    if (t.estado === 'Asignado') {
      panel = (
        <Caja titulo="¡Te eligieron!" destacado>
          <Parrafo>
            <Text style={{ fontWeight: '700' }}>{nombreContratante}</Text> te eligió para este
            trabajo. Si aceptas, los dos podrán ver el celular del otro y escribirse.
          </Parrafo>
        </Caja>
      );
      pie = (
        <>
          <Boton
            titulo="Aceptar trabajo"
            alPresionar={vm.aceptar}
            cargando={vm.ocupado === 'aceptar'}
            deshabilitado={!!vm.ocupado}
            textoCargando="Aceptando el trabajo"
          />
          <Boton
            titulo="No puedo, rechazar"
            variante="texto"
            alPresionar={vm.rechazar}
            deshabilitado={!!vm.ocupado}
          />
        </>
      );
    } else if (t.estado === 'En curso') {
      panel = (
        <View style={{ gap: Espacio.m }}>
          {vm.contacto ? <TarjetaContacto contacto={vm.contacto} /> : null}
          <Parrafo secundario style={estilos.nota}>
            Cuando termines, {nombreContratante} lo marca como terminado y se califican entre los
            dos.
          </Parrafo>
        </View>
      );
      pie = <Boton titulo={`Escribirle a ${nombreContratante}`} alPresionar={abrirChat} />;
    }
  } else if (t.estado === 'Disponible') {
    pie = vm.yaPostulado ? (
      <View style={[estilos.exito, { borderColor: paleta.exito }]} accessibilityLiveRegion="polite">
        <Text style={[estilos.textoExito, { color: paleta.exito }]}>
          ✓ Te postulaste. Si te eligen, te avisamos aquí y en «Mis trabajos».
        </Text>
      </View>
    ) : (
      <Boton
        titulo="Postularme"
        alPresionar={vm.postularse}
        cargando={vm.ocupado === 'postularse'}
        textoCargando="Enviando tu postulación"
      />
    );
  } else {
    panel = <AvisoError mensaje="Este trabajo ya no está disponible." />;
  }

  if (t.estado === 'Terminado' && vm.rol !== 'visitante') {
    panel = (
      <Caja titulo="Trabajo terminado">
        <Parrafo>
          {vm.porCalificar
            ? `Cuéntales a otros cómo te fue con ${vm.porCalificar.nombre}.`
            : 'Ya calificaste este trabajo. ¡Gracias!'}
        </Parrafo>
      </Caja>
    );
    pie = vm.porCalificar ? (
      <Boton titulo={`Calificar a ${vm.porCalificar.nombre}`} alPresionar={calificar} />
    ) : null;
  }

  const estadoTexto =
    vm.rol === 'contratante'
      ? estadoParaContratante(t)
      : vm.rol === 'trabajador'
        ? estadoParaTrabajador(t)
        : null;

  return (
    <Pantalla pie={pie}>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <View style={estilos.fila}>
            <Etiqueta texto={t.categoria} />
            {estadoTexto ? (
              <EstadoChip texto={estadoTexto} />
            ) : (
              <Text style={[estilos.dato, { color: paleta.textoSecundario }]}>
                {textoCuando(t.cuando)}
              </Text>
            )}
          </View>
          <Titulo>{t.titulo}</Titulo>
          <Text style={[estilos.precio, { color: paleta.texto }]}>{formatearPrecio(t.precio)}</Text>
          <Text style={[estilos.dato, { color: vm.cercano ? paleta.exito : paleta.textoSecundario }]}>
            {vm.cercano ? `● En tu barrio · ${t.barrio}` : t.barrio}
            {estadoTexto ? ` · ${textoCuando(t.cuando)}` : ''}
          </Text>
        </View>

        {panel}

        <Parrafo>{t.descripcion}</Parrafo>

        {vm.rol !== 'contratante' ? (
          <Caja titulo="Publicado por">
            <Parrafo style={{ fontWeight: '700' }}>{nombreContratante}</Parrafo>
            <Reputacion persona={t.publicadoPor} />
          </Caja>
        ) : null}

        <AvisoError mensaje={vm.errorGeneral} />
      </View>
    </Pantalla>
  );
}

function Caja({
  titulo,
  destacado = false,
  children,
}: {
  titulo: string;
  destacado?: boolean;
  children: ReactNode;
}) {
  const paleta = usePaleta();
  return (
    <View
      style={[
        estilos.caja,
        {
          borderColor: destacado ? paleta.exito : paleta.borde,
          borderWidth: destacado ? 2 : 1,
          backgroundColor: paleta.superficie,
        },
      ]}>
      <Text
        accessibilityRole="header"
        style={[estilos.etiquetaCaja, { color: destacado ? paleta.exito : paleta.textoSecundario }]}>
        {titulo.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { paddingVertical: Espacio.xl, alignItems: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dato: { fontSize: 15, fontWeight: '600' },
  precio: { fontSize: 30, fontWeight: '800', fontVariant: ['tabular-nums'] },
  caja: { borderRadius: Radio, padding: Espacio.m, gap: Espacio.s },
  etiquetaCaja: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  esperando: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
  postulado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espacio.m,
    borderTopWidth: 1,
    paddingTop: Espacio.s,
  },
  nota: { fontSize: 14, lineHeight: 20 },
  exito: { borderWidth: 1.5, borderRadius: Radio, padding: Espacio.m },
  textoExito: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
});
