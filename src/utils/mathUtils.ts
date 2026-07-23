// Deterministic pseudo-random number generator
export function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Helper to convert string to numeric seed
export function stringToSeed(str: string): number {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = Math.imul(31, seed) + str.charCodeAt(i) | 0;
  }
  return seed;
}
