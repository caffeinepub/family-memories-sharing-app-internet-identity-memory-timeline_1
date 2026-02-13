const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function validatePhoto(file: File, maxSizeMB: number): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPEG, or WebP image';
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image size must be less than ${maxSizeMB}MB`;
  }

  return null;
}

export async function fileToBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function blobToUrl(bytes: Uint8Array): string {
  // Create a new Uint8Array with ArrayBuffer to ensure compatibility with Blob constructor
  const standardBytes = new Uint8Array(bytes);
  const blob = new Blob([standardBytes], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}
