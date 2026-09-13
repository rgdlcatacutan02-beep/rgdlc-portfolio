/**
 * Utilities for reading and handling PDF files, base64 encoding, and downloads.
 */

export interface ParsedPdfInfo {
  dataUrl: string;
  fileName: string;
  fileSize: string;
}

/**
 * Format bytes into human readable string (KB or MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Read a PDF file as Base64 Data URL
 */
export function readPdfAsBase64(
  file: File,
  maxSizeBytes = 750 * 1024
): Promise<ParsedPdfInfo> {
  return new Promise((resolve, reject) => {
    // Validate file type
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      reject(new Error('Please select a valid PDF document (.pdf).'));
      return;
    }

    if (file.size > maxSizeBytes) {
      const maxKb = Math.round(maxSizeBytes / 1024);
      reject(
        new Error(
          `File size (${formatBytes(file.size)}) exceeds ${maxKb}KB cloud database limit. Please compress your PDF or use an external URL link.`
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve({
        dataUrl,
        fileName: file.name,
        fileSize: formatBytes(file.size),
      });
    };
    reader.onerror = () => {
      reject(new Error('Failed to read the selected PDF file.'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Sanitizes URLs to prevent DOM-based XSS attacks via javascript:, vbscript:, data:text/html, etc.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();

  // Allow safe web protocols
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }

  // Allow safe document & image data URIs
  if (
    trimmed.startsWith('data:application/pdf') ||
    trimmed.startsWith('data:image/png') ||
    trimmed.startsWith('data:image/jpeg') ||
    trimmed.startsWith('data:image/webp') ||
    trimmed.startsWith('data:image/gif') ||
    trimmed.startsWith('data:image/svg+xml')
  ) {
    return trimmed;
  }

  // Allow internal page anchors and paths
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed;
  }

  // Allow safe communication protocols
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }

  // Block dangerous pseudo-protocols
  return '#';
}

/**
 * Safely triggers downloading of a file whether it is a data URI, blob, or web URL
 */
export function triggerPdfDownload(
  pdfUrl: string | undefined | null,
  fileName = 'Regie_De_Leon_Catacutan_CV.pdf'
) {
  const safeUrl = sanitizeUrl(pdfUrl);
  if (!safeUrl || safeUrl === '#') return;

  if (safeUrl.startsWith('data:')) {
    try {
      const arr = safeUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      return;
    } catch (e) {
      console.warn('Fallback standard download for data url:', e);
    }
  }

  const link = document.createElement('a');
  link.href = safeUrl;
  link.download = fileName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Safely opens a document or image for preview in a new window or tab
 */
export function openPdfPreview(pdfUrl: string | undefined | null) {
  const safeUrl = sanitizeUrl(pdfUrl);
  if (!safeUrl || safeUrl === '#') return;

  if (safeUrl.startsWith('data:')) {
    try {
      const arr = safeUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      return;
    } catch (e) {
      console.warn('Could not create preview blob:', e);
    }
  }

  window.open(safeUrl, '_blank');
}
