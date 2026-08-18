export interface CompressOptions {
  /** Longest-edge cap in CSS pixels. Images already smaller are never upscaled. */
  maxSize?: number;
  /** WebP/JPEG encoder quality, 0-1. */
  quality?: number;
}

/**
 * Presets keep the size/quality trade-off in one place. Images are stored inline as base64 in
 * page_content, so every extra pixel is payload — only full-bleed art gets the big budget.
 *
 * `hero`: full-bleed backgrounds. The hero layer is 140% tall and parallax-scales to 1.18x, so on
 * a 2560px display it needs roughly 3000px of source to stay sharp.
 * `content`: in-flow images (cards, galleries, article bodies) that never exceed a column width.
 */
export const IMAGE_PRESETS = {
  hero: { maxSize: 3000, quality: 0.86 },
  content: { maxSize: 1600, quality: 0.78 },
} satisfies Record<string, Required<CompressOptions>>;

/**
 * Downscales in halving steps before the final draw. Canvas resampling is a short-radius filter,
 * so collapsing a 6000px photo to 1600px in one drawImage undersamples and reads as mush; halving
 * keeps the detail that the single-step path throws away.
 */
const drawResized = (img: HTMLImageElement, width: number, height: number): HTMLCanvasElement => {
  let src: HTMLCanvasElement | HTMLImageElement = img;
  let curWidth = img.width;
  let curHeight = img.height;

  while (curWidth > width * 2 && curHeight > height * 2) {
    curWidth = Math.round(curWidth / 2);
    curHeight = Math.round(curHeight / 2);
    const step = document.createElement('canvas');
    step.width = curWidth;
    step.height = curHeight;
    const stepCtx = step.getContext('2d');
    if (!stepCtx) break;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';
    stepCtx.drawImage(src, 0, 0, curWidth, curHeight);
    src = step;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, width, height);
  }
  return canvas;
};

/**
 * Compresses an image file by resizing it to a maximum dimension and converting it to WebP/JPEG.
 * Resolves to the compressed base64 data URL. Pass a preset from IMAGE_PRESETS (or explicit
 * options) to widen the budget for full-bleed images.
 */
export const compressImage = (file: File, options: CompressOptions = {}): Promise<string> => {
  const { maxSize = IMAGE_PRESETS.content.maxSize, quality = IMAGE_PRESETS.content.quality } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Only ever shrink: upscaling here would bake in blur and inflate the stored payload.
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = drawResized(img, width, height);
        if (!canvas.getContext('2d')) {
          resolve(dataUrl);
          return;
        }

        let compressedDataUrl = canvas.toDataURL('image/webp', quality);
        // Fallback if browser canvas does not support image/webp toDataURL
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(compressedDataUrl);
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
