<?php

namespace FoF\Upload\Mime;

use Flarum\Foundation\ValidationException;
use SoftCreatR\MimeDetector\MimeDetector;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MimeTypeDetector
{
    protected ?string $filePath = null;
    protected ?UploadedFile $upload = null;

    /**
     * Set the file path for MIME type detection.
     *
     * @param string $filePath
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
     * @return string|null
     */
    public function getMimeType(): ?string
    {
        if (!$this->filePath) {
            throw new ValidationException(['upload' => 'File path is not set.']);
        }

        try {
            // Use existing MimeDetector library
            $mimeDetector = new MimeDetector($this->filePath);
            $type = $mimeDetector->getMimeType();

            // If the MIME type is detected, return it
            if (!empty($type)) {
                return $type;
            }

            // Fallback to PHP's mime_content_type
            $type = mime_content_type($this->filePath);

            // If mime_content_type returns application/zip or empty, perform magic byte detection
            if ($type === 'application/zip' || empty($type)) {
                return $this->detectUsingMagicBytes();
            }

            return $type;
        } catch (\Exception $e) {
            throw new ValidationException(['upload' => 'Could not detect MIME type.']);
        }
    }

    /**
     * Detect MIME type using file magic bytes.
     *
     * @return string|null
     */
    private function detectUsingMagicBytes(): ?string
    {
        $handle = fopen($this->filePath, 'rb');
        if (!$handle) {
            return null;
        }

        $magicBytes = fread($handle, 4); // Read the first 4 bytes
        fclose($handle);

        foreach ($this->getMappings() as $mapping) {
            foreach ($mapping['magicBytes'] as $bytes) {
                if ($magicBytes === $bytes) {
                    // Additional checks for APK-specific files
                    if ($mapping['extension'] === 'apk' && !$this->isApk($this->filePath)) {
                        continue; // Not an APK, fallback to other mappings
                    }

                    return $mapping['mime'];
                }
            }
        }

        return null;
    }

    /**
     * Check if the file is a valid APK by inspecting its contents.
     *
     * @param string $filePath
     * @return bool
     */
    private function isApk(string $filePath): bool
    {
        $zip = new \ZipArchive();
        if ($zip->open($filePath) === true) {
            // APKs should contain "AndroidManifest.xml" and "classes.dex"
            $requiredFiles = ['AndroidManifest.xml', 'classes.dex'];
            foreach ($requiredFiles as $file) {
                if ($zip->locateName($file) === false) {
                    $zip->close();
                    return false; // Required APK-specific file not found
                }
            }
            $zip->close();
            return true; // All required files found
        }

        return false; // Not a valid ZIP file
    }


    /**
     * Determine the file extension based on the MIME type or original extension.
     *
     * @param array $whitelistedExtensions Whitelisted extensions for validation
     * @param string|null $originalExtension Original client extension
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
