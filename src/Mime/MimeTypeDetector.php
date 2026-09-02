<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) FriendsOfFlarum.
 * Copyright (c) Flagrow.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Mime;

use Flarum\Foundation\ValidationException;
use SoftCreatR\MimeDetector\MimeDetector;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MimeTypeDetector
{
    protected ?string $filePath = null;
    protected ?UploadedFile $upload = null;

    /**
     * Names that denote the same format, mapped onto one representative each.
     *
     * getMimeType() cross-checks php-mime-detector against fileinfo and rejects the upload
     * when the two disagree. They frequently disagree about nothing: a format usually has
     * more than one registered name, the two libraries picked different ones, and the file
     * is exactly what it claims to be. A .wav is the common case — php-mime-detector answers
     * `audio/vnd.wave` (the IANA registration) and libmagic answers `audio/x-wav` (the name
     * that predates it) — and there is no file either library would accept.
     *
     * Merging these affects the cross-check only. getMimeType() still returns the detector's
     * own spelling, so the admin's MIME whitelist and the extension mapping see exactly what
     * they saw before.
     *
     * Nothing here crosses a format boundary, so the check keeps its purpose: a file whose
     * magic bytes and libmagic signature describe genuinely different formats is still
     * rejected. The two deliberate groupings are documented where they appear.
     */
    protected const EQUIVALENT_MIME_TYPES = [
        // Audio.
        'audio/wav'          => 'audio/vnd.wave',
        'audio/wave'         => 'audio/vnd.wave',
        'audio/x-wav'        => 'audio/vnd.wave',
        'audio/x-pn-wav'     => 'audio/vnd.wave',
        'audio/x-flac'       => 'audio/flac',
        'audio/x-aiff'       => 'audio/aiff',
        'audio/x-aifc'       => 'audio/aiff',
        'audio/m4a'          => 'audio/mp4',
        'audio/x-m4a'        => 'audio/mp4',
        'audio/mp3'          => 'audio/mpeg',
        'audio/x-mp3'        => 'audio/mpeg',
        'audio/mpeg3'        => 'audio/mpeg',
        'audio/x-mpeg3'      => 'audio/mpeg',
        'audio/x-mpeg'       => 'audio/mpeg',
        'audio/x-ape'        => 'audio/ape',
        'audio/x-wavpack'    => 'audio/wavpack',

        // Ogg is a container, and the two libraries answer at different levels: libmagic
        // names the container, php-mime-detector the codec inside it. Same bytes, and the
        // container is what an admin whitelisting `audio/ogg` means.
        'audio/x-ogg'        => 'audio/ogg',
        'audio/opus'         => 'audio/ogg',
        'audio/vorbis'       => 'audio/ogg',
        'audio/x-opus+ogg'   => 'audio/ogg',
        'audio/x-vorbis+ogg' => 'audio/ogg',

        // Video.
        'video/avi'          => 'video/vnd.avi',
        'video/msvideo'      => 'video/vnd.avi',
        'video/x-msvideo'    => 'video/vnd.avi',
        'video/x-matroska'   => 'video/matroska',
        'video/mpeg4'        => 'video/mp4',
        'video/x-m4v'        => 'video/mp4',
        'video/x-quicktime'  => 'video/quicktime',

        // Images.
        'image/ico'          => 'image/vnd.microsoft.icon',
        'image/x-icon'       => 'image/vnd.microsoft.icon',
        'image/x-ms-bmp'     => 'image/bmp',
        'image/x-bmp'        => 'image/bmp',
        'image/x-tiff'       => 'image/tiff',
        'image/psd'          => 'image/vnd.adobe.photoshop',
        'image/photoshop'    => 'image/vnd.adobe.photoshop',
        'image/x-photoshop'  => 'image/vnd.adobe.photoshop',

        // Fonts. TrueType and OpenType share the SFNT container, and libmagic reports some
        // builds of either as `font/sfnt` without distinguishing them, so the whole family
        // resolves to one name. TTF against OTF is not a security boundary.
        'font/ttf'                      => 'font/sfnt',
        'font/otf'                      => 'font/sfnt',
        'application/font-sfnt'         => 'font/sfnt',
        'application/x-font-ttf'        => 'font/sfnt',
        'application/x-font-truetype'   => 'font/sfnt',
        'application/x-font-otf'        => 'font/sfnt',
        'application/x-font-opentype'   => 'font/sfnt',
        'application/vnd.ms-opentype'   => 'font/sfnt',
        'application/font-woff'         => 'font/woff',
        'application/x-font-woff'       => 'font/woff',

        // Documents, archives, executables.
        'text/rtf'                                      => 'application/rtf',
        'text/xml'                                      => 'application/xml',
        'application/x-rar'                             => 'application/x-rar-compressed',
        'application/vnd.rar'                           => 'application/x-rar-compressed',
        'application/x-gzip'                            => 'application/gzip',
        'application/x-bzip'                            => 'application/x-bzip2',
        'application/x-debian-package'                  => 'application/x-deb',
        'application/vnd.debian.binary-package'         => 'application/x-deb',
        'application/x-dosexec'                         => 'application/x-msdownload',
        'application/x-ms-dos-executable'               => 'application/x-msdownload',
        'application/vnd.microsoft.portable-executable' => 'application/x-msdownload',
        'application/x-nes-rom'                         => 'application/x-nintendo-nes-rom',
        'application/vnd.sqlite3'                       => 'application/x-sqlite3',
    ];

    /**
     * Set the file path for MIME type detection.
     *
     * @param string $filePath
     *
     * @return $this
     */
    public function forFile(string $filePath): self
    {
        $this->filePath = $filePath;

        return $this;
    }

    /**
     * Set the upload object for fallback extension guessing.
     *
     * @param UploadedFile $upload
     *
     * @return $this
     */
    public function withUpload(UploadedFile $upload): self
    {
        $this->upload = $upload;

        return $this;
    }

    /**
     * Determine the MIME type of the file.
     *
     * @throws ValidationException
     *
     * @return string|null
     */
    public function getMimeType(): ?string
    {
        if (!$this->filePath) {
            throw new ValidationException(['upload' => 'File path is not set.']);
        }

        try {
            // Get MIME from php-mime-detector (magic-byte based; always available)
            $detectorMime = $this->getMimeInternally();

            if (self::fileinfoAvailable()) {
                // Get MIME from PHP Fileinfo for cross-validation
                $fileinfoMime = mime_content_type($this->filePath);

                // Special handling for APKs (before mismatch rejection)
                if ($detectorMime === 'application/zip' || $fileinfoMime === 'application/zip') {
                    if ($this->isApk($this->filePath)) {
                        return 'application/vnd.android.package-archive';
                    }
                }

                // Reject if MIME mismatch occurs (AFTER checking for APKs), comparing the
                // formats rather than the strings — see EQUIVALENT_MIME_TYPES.
                if ($this->canonicalMimeType($detectorMime) !== $this->canonicalMimeType($fileinfoMime)) {
                    $message = "MIME type mismatch detected: $detectorMime vs $fileinfoMime";
                    resolve('log')->error("[fof/upload] $message");

                    // Check if the file exists, if it does, delete it.
                    if (file_exists($this->filePath)) {
                        unlink($this->filePath);
                    }

                    throw new ValidationException([
                        'upload' => $message,
                    ]);
                }
            } else {
                // fileinfo not loaded — APK check still possible via ZipArchive
                if ($detectorMime === 'application/zip' && $this->isApk($this->filePath)) {
                    return 'application/vnd.android.package-archive';
                }

                resolve('log')->warning('[fof/upload] PHP fileinfo extension is not loaded. MIME cross-validation is disabled; uploads rely solely on the MimeDetector library.');
            }

            return $detectorMime;
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new ValidationException(['upload' => 'Could not detect MIME type.']);
        }
    }

    /**
     * Reduces a MIME type to the name this class compares on.
     *
     * Lower-cases it, drops any parameters (`text/xml; charset=utf-8`), and resolves the
     * alternative spellings in EQUIVALENT_MIME_TYPES onto one representative. An unknown
     * type is returned unchanged, so a name nobody has listed still has to match exactly.
     */
    protected function canonicalMimeType(?string $mime): ?string
    {
        if ($mime === null) {
            return null;
        }

        $mime = strtolower(trim(explode(';', $mime, 2)[0]));

        return static::EQUIVALENT_MIME_TYPES[$mime] ?? $mime;
    }

    /**
     * Whether the PHP fileinfo extension is available.
     * Centralised here so tests can mock it and the admin listener can reuse it.
     */
    public static function fileinfoAvailable(): bool
    {
        return extension_loaded('fileinfo');
    }

    private function getMimeInternally(): bool|string
    {
        // Use existing MimeDetector library
        $mimeDetector = new MimeDetector($this->filePath);

        $mime = $mimeDetector->getMimeType();

        if (empty($mime) && self::fileinfoAvailable()) {
            $mime = mime_content_type($this->filePath);
        }

        return $mime;
    }

    /**
     * Check if the file is a valid APK by inspecting its contents.
     *
     * @param string $filePath
     *
     * @return bool
     */
    private function isApk(string $filePath): bool
    {
        $zip = new \ZipArchive();
        if ($zip->open($filePath) === true) {
            $requiredFiles = ['AndroidManifest.xml', 'classes.dex'];

            foreach ($requiredFiles as $file) {
                if ($zip->locateName($file) === false) {
                    $zip->close();

                    return false; // Required file not found, reject as non-APK
                }
            }

            $zip->close();

            return true; // Valid APK structure detected
        }

        return false; // Not a valid ZIP file
    }

    /**
     * Determine the file extension based on the MIME type or original extension.
     *
     * @param array       $whitelistedExtensions Whitelisted extensions for validation
     * @param string|null $originalExtension     Original client extension
     *
     * @return string
     */
    public function getFileExtension(array $whitelistedExtensions = [], ?string $originalExtension = null): string
    {
        // Check if the original extension is in the whitelist
        if ($originalExtension && in_array($originalExtension, $whitelistedExtensions)) {
            return $originalExtension;
        }

        // Guess the extension based on MIME type
        $mimeType = $this->getMimeType();
        $guessedExtension = $this->guessExtensionFromMimeType($mimeType);

        // If guessed extension is valid, return it
        if ($guessedExtension) {
            return $guessedExtension;
        }

        // Fallback to $upload->guessExtension if $upload is available
        if ($this->upload) {
            $fallbackExtension = $this->upload->guessExtension();
            if ($fallbackExtension) {
                return $fallbackExtension;
            }
        }

        return 'bin'; // Default to binary if no extension could be determined
    }

    /**
     * Guess file extension based on MIME type.
     *
     * @param string|null $mimeType
     *
     * @return string|null
     */
    private function guessExtensionFromMimeType(?string $mimeType): ?string
    {
        foreach ($this->getMappings() as $mapping) {
            if ($mapping['mime'] === $mimeType) {
                return $mapping['extension'];
            }
        }

        return null;
    }

    protected function getMappings(): array
    {
        return resolve('fof-upload.mime-mappings');
    }
}
