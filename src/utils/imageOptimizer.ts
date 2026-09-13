/**
 * Image optimization & normalization utility for IDGuard AI
 * Ensures all document and biometric captures have consistent format,
 * reasonable payload size (<500KB instead of 10-30MB), and clean base64 data URLs.
 */

export interface ImageHeuristics {
  sharpnessScore: number;
  glareDetected: boolean;
  glareLevel: 'none' | 'minor' | 'excessive';
  lightingCondition: 'optimal' | 'underexposed' | 'overexposed' | 'uneven';
  framingValid: boolean;
  resolutionAdequate: boolean;
  aspectRatio: number;
  width: number;
  height: number;
  estimatedKb: number;
}

export interface OptimizedImageResult {
  dataUrl: string;
  heuristics: ImageHeuristics;
}

export async function optimizeImage(
  fileOrDataUrl: File | string,
  maxDimension = 1600,
  quality = 0.88
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    let sourceUrl = '';
    let isObjectUrl = false;

    if (typeof fileOrDataUrl === 'string') {
      sourceUrl = fileOrDataUrl;
    } else if (fileOrDataUrl && typeof (fileOrDataUrl as unknown) === 'object') {
      sourceUrl = URL.createObjectURL(fileOrDataUrl as Blob);
      isObjectUrl = true;
    } else {
      return reject(new Error('Invalid image source provided.'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          width = 1200;
          height = 800;
        }

        // Calculate aspect-ratio preserving dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable.');
        }

        // Draw image onto canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Analyze image heuristics for realistic quality & glare checks
        const heuristics = analyzeCanvasPixels(ctx, width, height);

        // Export as optimized JPEG
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxSizeKb = Math.round((optimizedDataUrl.length * 0.75) / 1024);
        heuristics.estimatedKb = approxSizeKb;

        if (isObjectUrl) {
          URL.revokeObjectURL(sourceUrl);
        }

        resolve({
          dataUrl: optimizedDataUrl,
          heuristics,
        });
      } catch (err) {
        if (isObjectUrl) URL.revokeObjectURL(sourceUrl);
        reject(err);
      }
    };

    img.onerror = (e) => {
      if (isObjectUrl) URL.revokeObjectURL(sourceUrl);
      reject(new Error('Failed to load image for processing. Please ensure the file is a valid image.'));
    };

    img.src = sourceUrl;
  });
}

function analyzeCanvasPixels(ctx: CanvasRenderingContext2D, width: number, height: number): ImageHeuristics {
  // Sample a grid of pixels for fast performance
  const sampleStep = Math.max(4, Math.floor(Math.min(width, height) / 80));
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let totalLuminance = 0;
  let sampleCount = 0;
  let glarePixels = 0;
  let darkPixels = 0;
  let varianceAccumulator = 0;
  let prevLuma = -1;

  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Standard perceptual luminance formula
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      totalLuminance += luma;
      sampleCount++;

      if (luma > 248 && r > 240 && g > 240 && b > 240) {
        glarePixels++;
      } else if (luma < 35) {
        darkPixels++;
      }

      if (prevLuma >= 0) {
        varianceAccumulator += Math.abs(luma - prevLuma);
      }
      prevLuma = luma;
    }
  }

  const avgLuma = sampleCount > 0 ? totalLuminance / sampleCount : 128;
  const glareRatio = sampleCount > 0 ? glarePixels / sampleCount : 0;
  const darkRatio = sampleCount > 0 ? darkPixels / sampleCount : 0;
  const avgContrast = sampleCount > 1 ? varianceAccumulator / (sampleCount - 1) : 20;

  // Sharpness approximation: higher local contrast variance = sharper edges
  let sharpness = Math.min(100, Math.max(20, Math.round(avgContrast * 3.2 + 25)));

  // Glare classification
  let glareDetected = false;
  let glareLevel: 'none' | 'minor' | 'excessive' = 'none';
  if (glareRatio > 0.08) {
    glareDetected = true;
    glareLevel = 'excessive';
    sharpness = Math.max(15, sharpness - 35);
  } else if (glareRatio > 0.025) {
    glareDetected = true;
    glareLevel = 'minor';
  }

  // Lighting classification
  let lightingCondition: 'optimal' | 'underexposed' | 'overexposed' | 'uneven' = 'optimal';
  if (avgLuma < 55 || darkRatio > 0.4) {
    lightingCondition = 'underexposed';
  } else if (avgLuma > 215) {
    lightingCondition = 'overexposed';
  } else if (darkRatio > 0.2 && glareRatio > 0.03) {
    lightingCondition = 'uneven';
  }

  const aspectRatio = width / height;
  const framingValid = width >= 400 && height >= 250;
  const resolutionAdequate = width >= 640 && height >= 400;

  return {
    sharpnessScore: sharpness,
    glareDetected,
    glareLevel,
    lightingCondition,
    framingValid,
    resolutionAdequate,
    aspectRatio,
    width,
    height,
    estimatedKb: 0,
  };
}
