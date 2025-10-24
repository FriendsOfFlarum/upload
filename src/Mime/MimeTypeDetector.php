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
            // Get MIME from php-mime-detector
            $detectorMime = $this->getMimeInternally();

            // Get MIME from PHP Fileinfo
            $fileinfoMime = mime_content_type($this->filePath);

            // Special handling for APKs (before mismatch rejection)
            if ($detectorMime === 'application/zip' || $fileinfoMime === 'application/zip') {
                if ($this->isApk($this->filePath)) {
                    return 'application/vnd.android.package-archive';
                }
            }

            // Reject if MIME mismatch occurs (AFTER checking for APKs)
            if ($detectorMime !== $fileinfoMime) {
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

            return $detectorMime;
        } catch (\Exception $e) {
            throw new ValidationException(['upload' => 'Could not detect MIME type.']);
        }
    }

    private function getMimeInternally(): bool|string
    {
        // Use existing MimeDetector library
        $mimeDetector = new MimeDetector($this->filePath);

        $mime = $mimeDetector->getMimeType();

        if (empty($mime)) {
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
