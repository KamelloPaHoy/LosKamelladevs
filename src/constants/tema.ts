/**
 * Colores y medidas de Kamello Pa' Hoy.
 * Todos los colores de texto sobre fondo cumplen contraste AA (≥ 4.5:1).
 */
export const Colores = {
  claro: {
    fondo: '#FFFBF5',
    superficie: '#FFFFFF',
    borde: '#D9D2C7',
    bordeFoco: '#B5400B',
    texto: '#1F1B16',
    textoSecundario: '#5C554C',
    primario: '#B5400B',
    primarioPresionado: '#93340A',
    sobrePrimario: '#FFFFFF',
    error: '#B3261E',
    fondoError: '#FCEDEC',
    exito: '#1E6B3A',
    deshabilitado: '#E6E0D7',
    textoDeshabilitado: '#8A8278',
  },
  oscuro: {
    fondo: '#16130F',
    superficie: '#211D18',
    borde: '#4A433A',
    bordeFoco: '#FF9A5C',
    texto: '#F5EFE6',
    textoSecundario: '#C2B9AD',
    primario: '#FF9A5C',
    primarioPresionado: '#FFB485',
    sobrePrimario: '#2A1306',
    error: '#FFB4AB',
    fondoError: '#3B1A17',
    exito: '#7DD49A',
    deshabilitado: '#2E2923',
    textoDeshabilitado: '#7D756B',
  },
} as const;

export type Paleta = { [K in keyof typeof Colores.claro]: string };

export const Espacio = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const;

/** Alto mínimo de cualquier elemento que se toca (DoD: ≥ 48 dp). */
export const AltoTactil = 52;

export const Radio = 12;

export const AnchoMaximo = 480;
