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
  maxSizeBytes = 4 * 1024 * 1024
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
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      reject(
        new Error(
          `File size (${formatBytes(file.size)}) exceeds ${maxMb}MB limit. Please choose a smaller PDF or provide an external URL.`
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
 * Safely triggers downloading of a PDF whether it is a data URI, blob, or web URL
 */
export function triggerPdfDownload(
  pdfUrl: string,
  fileName = 'Regie_De_Leon_Catacutan_CV.pdf'
) {
  if (!pdfUrl) return;

  if (pdfUrl.startsWith('data:')) {
    try {
      const arr = pdfUrl.split(',');
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
  link.href = pdfUrl;
  link.download = fileName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Safely opens a PDF for preview in a new window or tab
 */
export function openPdfPreview(pdfUrl: string) {
  if (!pdfUrl) return;

  if (pdfUrl.startsWith('data:')) {
    try {
      const arr = pdfUrl.split(',');
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

  window.open(pdfUrl, '_blank');
}
