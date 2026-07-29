/**
 * Compresses an image file by resizing it to a maximum dimension
 * and converting it to WebP/JPEG format with quality compression.
 * Returns a Promise that resolves to the compressed base64 data URL.
 */
export const compressImage = (file: File, maxSize = 1600, quality = 0.78): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let compressedDataUrl = canvas.toDataURL('image/webp', quality);
          // Fallback if browser canvas does not support image/webp toDataURL
          if (!compressedDataUrl.startsWith('data:image/webp')) {
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(compressedDataUrl);
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for compression.'));
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };
    reader.readAsDataURL(file);
  });
};
