const image = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml', 'image/gif'];
const archive = ['application/zip', 'application/x-7z-compressed', 'application/gzip', 'application/vnd.rar', 'application/x-rar-compressed'];
const code = ['text/html', 'text/css', 'text/javascript', 'application/json', 'application/ld+json', 'text/javascript', 'application/x-httpd-php'];
const word = [
  'application/x-abiword',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
];

/**
 * Returns a FontAwesome icon class for a specified MIME type.
 *
 * If it's a known image type, it returns `image` instead.
 *
 * @param {string} fileType MIME type
 * @returns {string} Icon for MIME type
 */
export default function mimeToIcon(fileType) {
  // Display image (do not display for)
  if (image.includes(fileType)) {
    return 'image';
  }
  // Display image icon for other types
  else if (fileType.includes('image/')) {
    return 'far fa-file-image';
  }
  // Video icon
  else if (fileType.includes('video/')) {
    return 'far fa-file-video';
  }
  // Archive icon
  else if (archive.indexOf(fileType) >= 0) {
    return 'far fa-file-archive';
  }
  // PDF icon
  else if (fileType === 'application/pdf') {
    return 'far fa-file-pdf';
  }
  // Word
  else if (word.indexOf(fileType) >= 0) {
    return 'far fa-file-word';
  }
  // Audio icon
  else if (fileType.includes('audio/')) {
    return 'far fa-file-audio';
  }
  // Code files
  else if (code.indexOf(fileType) >= 0) {
    return 'far fa-file-code';
  }

  return 'far fa-file';
}
