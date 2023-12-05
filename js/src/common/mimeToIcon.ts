const mimeToIconMap = new Map<string, string>([
  ...[
    ['image/png', 'far fa-file-image'],
    ['image/jpg', 'far fa-file-image'],
    ['image/jpeg', 'far fa-file-image'],
    ['image/svg+xml', 'far fa-file-image'],
    ['image/gif', 'far fa-file-image'],
  ].map((type) => type as [string, string]),
  ...[
    ['application/zip', 'far fa-file-archive'],
    ['application/x-7z-compressed', 'far fa-file-archive'],
    ['application/gzip', 'far fa-file-archive'],
    ['application/vnd.rar', 'far fa-file-archive'],
    ['application/x-rar-compressed', 'far fa-file-archive'],
  ].map((type) => type as [string, string]),
  ...[
    ['text/plain', 'far fa-file-alt'],
    ['text/csv', 'far fa-file-csv'],
    ['text/xml', 'far fa-file-code'],
    ['text/html', 'far fa-file-code'],
    ['text/css', 'far fa-file-code'],
    ['text/javascript', 'far fa-file-code'],
    ['application/json', 'far fa-file-code'],
    ['application/ld+json', 'far fa-file-code'],
    ['application/x-httpd-php', 'far fa-file-code'],
  ].map((type) => type as [string, string]),
  ...[
    ['application/x-abiword', 'far fa-file-word'],
    ['application/msword', 'far fa-file-word'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'far fa-file-word'],
    ['application/pdf', 'far fa-file-word'],
  ].map((type) => type as [string, string]),
  ['application/pdf', 'far fa-file-pdf'],
]);

export default function mimeToIcon(fileType: string): string {
  // Check if the fileType is directly mapped
  if (mimeToIconMap.has(fileType)) {
    return mimeToIconMap.get(fileType) as string;
  }

  // Check for generic types
  if (fileType.startsWith('image/')) {
    return 'far fa-file-image';
  }
  if (fileType.startsWith('video/')) {
    return 'far fa-file-video';
  }
  if (fileType.startsWith('audio/')) {
    return 'far fa-file-audio';
  }

  // Default icon
  return 'far fa-file';
}
