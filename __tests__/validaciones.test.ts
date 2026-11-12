import {
  aFormatoInternacional,
  formatearCelular,
  ocultarCelular,
  validarBarrio,
  validarCelular,
  validarCodigo,
  validarNombre,
} from '@/utils/validaciones';

describe('celular', () => {
  it('formatea mientras se escribe', () => {
    expect(formatearCelular('300')).toBe('300');
    expect(formatearCelular('3001')).toBe('300 1');
    expect(formatearCelular('3001234567')).toBe('300 123 4567');
    expect(formatearCelular('300-123-4567 89')).toBe('300 123 4567');
  });

  it('acepta un celular colombiano de 10 dígitos que empieza por 3', () => {
    expect(validarCelular('300 123 4567')).toBeNull();
    expect(validarCelular('3151234567')).toBeNull();
  });

  it('rechaza lo que no es un celular colombiano', () => {
    expect(validarCelular('')).toBe('Escribe tu número de celular.');
    expect(validarCelular('6071234567')).toBe('El celular debe empezar por 3.');
    expect(validarCelular('300123456')).toBe('El celular debe tener 10 dígitos.');
  });

  it('convierte al formato que pide Firebase y lo oculta para mostrarlo', () => {
    expect(aFormatoInternacional('300 123 4567')).toBe('+573001234567');
    expect(ocultarCelular('+573001234567')).toBe('+57 300 *** 4567');
  });
});

describe('código del SMS', () => {
  it('pide exactamente 6 números', () => {
    expect(validarCodigo('123456')).toBeNull();
    expect(validarCodigo('12345')).toBe('El código tiene 6 números.');
    expect(validarCodigo('')).toBe('El código tiene 6 números.');
  });
});

describe('nombre', () => {
  it('acepta nombres con tildes, ñ y apellidos', () => {
    expect(validarNombre('María José Peñaloza')).toBeNull();
    expect(validarNombre('  Luzdey   Marín ')).toBeNull();
  });

  it('rechaza nombres vacíos, cortos o con números', () => {
    expect(validarNombre('   ')).toBe('Escribe tu nombre.');
    expect(validarNombre('Al')).toBe('Tu nombre debe tener al menos 3 letras.');
    expect(validarNombre('Luz 123')).toBe('Usa solo letras en tu nombre.');
    expect(validarNombre('a'.repeat(61))).toBe('Tu nombre no puede pasar de 60 caracteres.');
  });
});

describe('barrio', () => {
  it('pide un barrio de 3 a 50 caracteres', () => {
    expect(validarBarrio('El Centro')).toBeNull();
    expect(validarBarrio('')).toBe('Escribe tu barrio.');
    expect(validarBarrio('ab')).toBe('El nombre del barrio es muy corto.');
    expect(validarBarrio('b'.repeat(51))).toBe(
      'El nombre del barrio no puede pasar de 50 caracteres.',
    );
  });
});
