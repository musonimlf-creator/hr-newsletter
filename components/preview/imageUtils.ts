export function safeImageSrc(photoUrl?: string): string | undefined {
  if (!photoUrl) return undefined;

  // If running in the browser, use window.location as base for relative URLs
  const base = typeof window !== 'undefined' ? window.location.href : 'http://localhost';

  try {
    const resolved = new URL(photoUrl, base);
    // Accept http(s) and data URIs
    if (['http:', 'https:', 'data:'].includes(resolved.protocol)) return resolved.href;
    // As a fallback, allow absolute path starting with '/'
    if (photoUrl.startsWith('/')) return photoUrl;
  } catch (e) {
    // If new URL throws, allow some safe patterns
    if (photoUrl.startsWith('/') || photoUrl.startsWith('data:') || photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return photoUrl;
  }

  // Otherwise unsafe
  return undefined;
}
