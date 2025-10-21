/* eslint-disable no-prototype-builtins */
/**
 *  Soundex
 *  Creates a soundex code from a string
 *  @param s string to generate the soundex code
 * 	@returns
 */

export const soundex = (s: string): string => {
  if (!s || typeof s !== 'string' || s.length === 0) {
    return ''; // Devuelve string vacío para inválidos o muy cortos
  }
  const a = s.toLowerCase().split('');
  const f = a.shift() as string;

  // Validar que f sea una letra o número para iniciar Soundex
  if (!/[a-z0-9]/.test(f)) {
    return ''; // O manejar de otra forma si el primer carácter no es válido
  }

  let r = '';
  const codes: Record<string, number | string> = {
    a: '',
    e: '',
    i: '',
    o: '',
    u: '',
    y: '',
    h: '',
    w: '', // Vocales y similares se ignoran después del primer caracter
    b: 1,
    f: 1,
    p: 1,
    v: 1,
    c: 2,
    g: 2,
    j: 2,
    k: 2,
    q: 2,
    s: 2,
    x: 2,
    z: 2,
    d: 3,
    t: 3,
    l: 4,
    m: 5,
    n: 5,
    r: 6,
  };

  r =
    f +
    a // Comenzar con el primer carácter original
      .map((v: string) => {
        if (codes.hasOwnProperty(v)) return codes[v];
        if (/[0-9]/.test(v)) return v; // Dígitos se mapean a sí mismos
        return ''; // Otros caracteres se ignoran
      })
      .filter((v, i, bArr) => {
        const prevCode =
          i === 0
            ? codes.hasOwnProperty(f)
              ? codes[f]
              : /[0-9]/.test(f)
                ? f
                : ''
            : bArr[i - 1];
        return v && v !== prevCode; // Asegurar que v no sea '' y diferente al anterior
      })
      .join('');

  return (r + '0000').slice(0, 4).toUpperCase();
};
