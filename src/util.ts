
/**
 * Convert a binary number to RGB values.
 *
 * The first byte will be used for red, the second for green and the third byte for blue.
 * The fourth byte usually stands for the alpha channel but it is discarded by this function.
 */
export function toRGB(c: number): [r: number, g: number, b: number] {
  return [ c & 255, (c >> 8) & 255, (c >> 16) & 255 ]
}

/**
 * The simple DJB2 hash function.
 *
 * This inefficient but simple hash is ideal for generating a fairly unique number 
 * for a strign, such as a color value.
 */
export function hash(s: string): number {
  let out = 5381;
  for (const ch of s) {
    out = ((out << 5) + out) + ch.charCodeAt(0);
  }
  return out;
}
