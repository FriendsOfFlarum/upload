const mimeToIconMap = new Map<string, string>([
  // Image formats
  ['image/png', 'far fa-file-image'],
  ['image/jpg', 'far fa-file-image'],
  ['image/jpeg', 'far fa-file-image'],
  ['image/svg+xml', 'far fa-file-image'],
  ['image/gif', 'far fa-file-image'],
  ['image/bmp', 'far fa-file-image'],
  ['image/webp', 'far fa-file-image'],

  // Compressed file formats
  ['application/zip', 'far fa-file-archive'],
  ['application/x-7z-compressed', 'far fa-file-archive'],
  ['application/gzip', 'far fa-file-archive'],
  ['application/vnd.rar', 'far fa-file-archive'],
  ['application/x-rar-compressed', 'far fa-file-archive'],
  ['application/x-tar', 'far fa-file-archive'],
  ['application/x-iso9660-image', 'far fa-file-archive'],

  // Text and code file formats
  ['text/plain', 'far fa-file-alt'],
  ['text/csv', 'far fa-file-csv'],
  ['text/xml', 'far fa-file-code'],
  ['text/html', 'far fa-file-code'],
  ['text/css', 'far fa-file-code'],
  ['text/javascript', 'far fa-file-code'],
  ['application/json', 'far fa-file-code'],
  ['application/ld+json', 'far fa-file-code'],
  ['application/x-httpd-php', 'far fa-file-code'],
  ['application/xml', 'far fa-file-code'],
  ['text/xml', 'far fa-file-code'],

  // Document formats
  ['application/x-abiword', 'far fa-file-word'],
  ['application/msword', 'far fa-file-word'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'far fa-file-word'],
  ['application/vnd.oasis.opendocument.text', 'far fa-file-word'],
  ['application/vnd.ms-excel', 'far fa-file-excel'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'far fa-file-excel'],
  ['application/vnd.oasis.opendocument.spreadsheet', 'far fa-file-excel'],
  ['application/vnd.ms-powerpoint', 'far fa-file-powerpoint'],
  ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'far fa-file-powerpoint'],
  ['application/vnd.oasis.opendocument.presentation', 'far fa-file-powerpoint'],
  ['application/pdf', 'far fa-file-pdf'],
  ['application/rtf', 'far fa-file-alt'],

  // eBook formats
  ['application/epub+zip', 'far fa-book'],
  ['application/x-mobipocket-ebook', 'far fa-book'],
  ['application/vnd.amazon.ebook', 'far fa-book'],

  // Audio formats
  ['audio/mpeg', 'far fa-file-audio'],
  ['audio/wav', 'far fa-file-audio'],
  ['audio/x-wav', 'far fa-file-audio'],
  ['audio/aac', 'far fa-file-audio'],
  ['audio/ogg', 'far fa-file-audio'],
  ['audio/flac', 'far fa-file-audio'],
  ['audio/aiff', 'far fa-file-audio'],
  ['audio/x-aiff', 'far fa-file-audio'],

  // Video formats
  ['video/x-msvideo', 'far fa-file-video'],
  ['video/mp4', 'far fa-file-video'],
  ['video/quicktime', 'far fa-file-video'],
]);

export default function mimeToIcon(fileType: string): string {
  // Directly return the icon if the fileType is in the map
  return (
    mimeToIconMap.get(fileType) ||
    (function () {
      // Check for generic types
      if (fileType.startsWith('image/')) {
        return 'far fa-file-image';
      } else if (fileType.startsWith('video/')) {
        return 'far fa-file-video';
      } else if (fileType.startsWith('audio/')) {
        return 'far fa-file-audio';
      }

      // Default icon
      return 'far fa-file';
    })()
  );
}
