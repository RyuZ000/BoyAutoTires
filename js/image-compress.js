/* ============================================================
   Shrinks photos in the browser before they are uploaded (admin.html).
   Phone photos are often 3-5MB; the site shows them at most ~1600px wide,
   so they are resized and re-encoded (JPEG, or WebP when the photo has
   transparent parts). Anything that isn't a still photo is left alone.
   ============================================================ */

const IMAGE_MAX_SIDE = 1600;
const IMAGE_QUALITY = 0.82;

function loadImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('cannot read image')); };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}

// Returns { blob, type } that is smaller than the original, or null when
// shrinking wouldn't help (already small, a GIF/SVG, or not an image at all).
async function compressImageBlob(blob) {
  if (!/^image\/(jpeg|png|webp|bmp)$/.test(blob.type)) return null;
  let img;
  try {
    img = await loadImageFromBlob(blob);
  } catch {
    return null;
  }
  const scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // JPEG has no transparency, so cut-out PNGs (e.g. a wheel on a clear
  // background) are saved as WebP instead to keep their see-through parts
  let transparent = false;
  if (blob.type !== 'image/jpeg') {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 255) { transparent = true; break; }
    }
  }
  const out = transparent
    ? await canvasToBlob(canvas, 'image/webp', IMAGE_QUALITY)
    : await canvasToBlob(canvas, 'image/jpeg', IMAGE_QUALITY);
  // browsers that can't write WebP hand back a PNG instead; keep the original then
  if (!out || (transparent && out.type !== 'image/webp')) return null;
  // not worth replacing unless it saves at least 20%
  if (out.size > blob.size * 0.8) return null;
  return { blob: out, type: out.type };
}

// For a new upload: returns a File ready to upload (the shrunk one, or the
// original when shrinking doesn't help). The file name's extension follows the new type.
async function compressImageFile(file) {
  const result = await compressImageBlob(file);
  if (!result) return file;
  const ext = result.type === 'image/webp' ? 'webp' : 'jpg';
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
  return new File([result.blob], name, { type: result.type });
}
