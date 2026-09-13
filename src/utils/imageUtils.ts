/**
 * Utility to compress and encode an image file into a compact base64 data URL.
 * Automatically downscales images so they fit in browser localStorage and Firestore docs (<150KB).
 */
export function compressAndEncodeImage(
  file: File,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.src = src;

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with specified quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load and process image file.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file from disk.'));
    };
  });
}
