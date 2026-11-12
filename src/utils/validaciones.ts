/**
 * Validaciones de los campos de acceso y registro.
 * Cada función devuelve el mensaje de error para mostrar, o null si el valor es válido.
 */

/** Deja solo los dígitos de lo que escribió el usuario. */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

/** Formatea un celular colombiano mientras se escribe: 300 123 4567. */
export function formatearCelular(valor: string): string {
  const d = soloDigitos(valor).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Celular móvil colombiano: 10 dígitos y empieza por 3. */
export function validarCelular(valor: string): string | null {
  const d = soloDigitos(valor);
  if (d.length === 0) return 'Escribe tu número de celular.';
  if (!d.startsWith('3')) return 'El celular debe empezar por 3.';
  if (d.length !== 10) return 'El celular debe tener 10 dígitos.';
  return null;
}

/** Convierte el celular al formato internacional que pide Firebase: +573001234567. */
export function aFormatoInternacional(valor: string): string {
  return `+57${soloDigitos(valor)}`;
}

/** Muestra el celular parcialmente oculto: +57 300 *** 4567. */
export function ocultarCelular(internacional: string): string {
  const d = internacional.replace('+57', '');
  return `+57 ${d.slice(0, 3)} *** ${d.slice(6)}`;
}

export const LargoCodigo = 6;

export function validarCodigo(valor: string): string | null {
  const d = soloDigitos(valor);
  if (d.length !== LargoCodigo) return `El código tiene ${LargoCodigo} números.`;
  return null;
}

export function validarNombre(valor: string): string | null {
  const limpio = valor.trim().replace(/\s+/g, ' ');
  if (limpio.length === 0) return 'Escribe tu nombre.';
  if (limpio.length < 3) return 'Tu nombre debe tener al menos 3 letras.';
  if (limpio.length > 60) return 'Tu nombre no puede pasar de 60 caracteres.';
  if (!/^[\p{L}][\p{L} '.-]*$/u.test(limpio)) return 'Usa solo letras en tu nombre.';
  return null;
}

export function validarBarrio(valor: string): string | null {
  const limpio = valor.trim();
  if (limpio.length === 0) return 'Escribe tu barrio.';
  if (limpio.length < 3) return 'El nombre del barrio es muy corto.';
  if (limpio.length > 50) return 'El nombre del barrio no puede pasar de 50 caracteres.';
  return null;
}
