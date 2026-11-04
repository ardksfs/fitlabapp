import { h, render } from 'vue';
import { QrcodeCanvas } from 'qrcode.vue';

/**
 * Renders a QR code locally (no network request) and returns it as a PNG data URL.
 * Returns an empty string when canvas rendering is unavailable.
 */
export function createQrPngDataUrl(value: string, size = 640): string {
  if (typeof document === 'undefined') return '';

  const host = document.createElement('div');

  try {
    render(h(QrcodeCanvas, { value, size, level: 'M', margin: 1 }), host);
    const canvas = host.querySelector('canvas');
    return canvas ? canvas.toDataURL('image/png') : '';
  } catch (error) {
    console.error('Unable to render QR code:', error);
    return '';
  } finally {
    render(null, host);
  }
}
