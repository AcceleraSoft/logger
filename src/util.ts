
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
