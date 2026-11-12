/**
 * Política de tratamiento de datos personales (HU-02).
 * BORRADOR: el texto final lo revisa el equipo (área de seguridad) antes del Hito 4.
 */
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';

import { Pantalla } from '@/components/pantalla';
import { Parrafo, Titulo } from '@/components/textos';
import { VersionPolitica } from '@/constants/politica';
import { Espacio } from '@/constants/tema';
import { abrirLey1581 } from '@/utils/abrir-ley';

const Secciones: { titulo: string; texto: string }[] = [
  {
    titulo: 'Quién trata tus datos',
    texto:
      "Kamello Pa' Hoy es un proyecto académico de estudiantes de Ingeniería Informática de UNIPAZ, en Barrancabermeja. Contacto: [correo del equipo].",
  },
  {
    titulo: 'Qué datos pedimos',
    texto:
      'Tu número de celular, tu nombre y tu barrio. Más adelante, si tú quieres, tu foto y tus habilidades.',
  },
  {
    titulo: 'Para qué los usamos',
    texto:
      'Para confirmar que tu cuenta es de una persona real, mostrarte primero los trabajos más cercanos a ti y que otros usuarios conozcan tu reputación. No vendemos ni compartimos tus datos con terceros.',
  },
  {
    titulo: 'Quién ve tu número',
    texto:
      'Nadie, hasta que tú y la otra persona aceptan el mismo trabajo. Antes de eso solo se ven tu nombre, tu barrio y tus calificaciones.',
  },
  {
    titulo: 'Tus derechos',
    texto:
      'Puedes conocer, actualizar, corregir o pedir que borremos tus datos, y retirar esta autorización cuando quieras, escribiendo al contacto de arriba.',
  },
];

export default function Politica() {
  return (
    <Pantalla>
      <View style={{ gap: Espacio.l }}>
        <View style={{ gap: Espacio.s }}>
          <Titulo>Tratamiento de datos personales</Titulo>
          <Parrafo secundario>
            Según la Ley 1581 de 2012. Versión {VersionPolitica}.
          </Parrafo>
        </View>
        {Secciones.map((seccion) => (
          <View key={seccion.titulo} style={estilos.seccion}>
            <Parrafo style={estilos.subtitulo} accessibilityRole="header">
              {seccion.titulo}
            </Parrafo>
            <Parrafo>{seccion.texto}</Parrafo>
          </View>
        ))}
        <Boton
          titulo="Leer la Ley 1581 de 2012"
          variante="secundario"
          alPresionar={abrirLey1581}
        />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  seccion: { gap: Espacio.xs },
  subtitulo: { fontWeight: '700', fontSize: 17 },
});
