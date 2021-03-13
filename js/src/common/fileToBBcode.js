export default function fileToBBcode(file) {
    switch (file.tag()) {
        // File
        case 'file':
            return `[upl-file uuid=${file.uuid()} size=${file.humanSize()}]${file.baseName()}[/upl-file]`;

        // Image template
        case 'image':
            return `[upl-image uuid=${file.uuid()} size=${file.humanSize()} url=${file.url()}]${file.baseName()}[/upl-image]`;

        // Image preview
        case 'image-preview':
            return `[upl-image-preview url=${file.url()}]`;

        // 'just-url' or unknown
        default:
            return file.url();
    }
}
