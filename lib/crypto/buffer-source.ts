/** Satisfies strict `BufferSource` typing for Web Crypto (TS + lib.dom). */
export function bufferSource(bytes: Uint8Array): BufferSource {
  return bytes as BufferSource;
}
