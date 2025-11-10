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

namespace FoF\Upload\Driver;

use Flarum\Settings\SettingsRepositoryInterface;

class Config
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Check if all required S3 environment variables are set.
     */
    public function shouldUseEnv(): bool
    {
        $bucket = getenv('FOF_UPLOAD_AWS_S3_BUCKET');
        $region = getenv('FOF_UPLOAD_AWS_S3_REGION');
        $key = getenv('FOF_UPLOAD_AWS_S3_KEY');
        $secret = getenv('FOF_UPLOAD_AWS_S3_SECRET');
        $useIam = getenv('FOF_UPLOAD_AWS_S3_USE_IAM');

        // Basic requirement: bucket and region must be set
        if (empty($bucket) || empty($region)) {
            return false;
        }

        // Explicit IAM mode - only bucket and region required
        if (!empty($useIam) && filter_var($useIam, FILTER_VALIDATE_BOOLEAN)) {
            return true;
        }

        // Traditional mode - all 4 required (key, secret, bucket, region)
        return !empty($key) && !empty($secret);
    }

    /**
     * Check if Local CDN URL is set via environment variable.
     */
    public function shouldUseLocalCdnEnv(): bool
    {
        return !empty(getenv('FOF_UPLOAD_CDN_URL'));
    }

    /**
     * Get S3 configuration array.
     * Returns configuration from ENV if available, otherwise from settings.
     *
     * @return array{region: string|null, endpoint: string|null, use_path_style_endpoint: bool|null, credentials: array{key: string, secret: string}|null, bucket: string, acl: string|null, custom_url: string|null, cdn_url: string|null}
     */
    public function getS3Config(): array
    {
        $useEnv = $this->shouldUseEnv();

        if ($useEnv) {
            return $this->buildS3ConfigFromEnv();
        }

        return $this->buildS3ConfigFromSettings();
    }

    /**
     * Get Local CDN URL from ENV or settings.
     */
    public function getLocalCdnUrl(): ?string
    {
        $envCdnUrl = getenv('FOF_UPLOAD_CDN_URL');
        if ($envCdnUrl) {
            return $envCdnUrl;
        }

        $settingCdnUrl = $this->settings->get('fof-upload.cdnUrl');

        return empty($settingCdnUrl) ? null : $settingCdnUrl;
    }

    /**
     * Get S3 ACL from ENV or settings.
     */
    public function getS3Acl(): ?string
    {
        $useEnv = $this->shouldUseEnv();

        if ($useEnv) {
            return getenv('FOF_UPLOAD_AWS_S3_ACL') ?: null;
        }

        $acl = $this->settings->get('fof-upload.awsS3ACL');

        return empty($acl) ? null : $acl;
    }

    /**
     * Get S3 Custom URL from ENV or settings.
     */
    public function getS3CustomUrl(): ?string
    {
        $useEnv = $this->shouldUseEnv();

        if ($useEnv) {
            return getenv('FOF_UPLOAD_AWS_S3_CUSTOM_URL') ?: null;
        }

        $customUrl = $this->settings->get('fof-upload.awsS3CustomUrl');

        return empty($customUrl) ? null : $customUrl;
    }

    /**
     * Get S3 CDN URL from ENV or settings.
     */
    public function getS3CdnUrl(): ?string
    {
        $useEnv = $this->shouldUseEnv();

        if ($useEnv) {
            return getenv('FOF_UPLOAD_CDN_URL') ?: null;
        }

        $cdnUrl = $this->settings->get('fof-upload.cdnUrl');

        return empty($cdnUrl) ? null : $cdnUrl;
    }

    /**
     * Build S3 configuration from environment variables.
     */
    protected function buildS3ConfigFromEnv(): array
    {
        $region = getenv('FOF_UPLOAD_AWS_S3_REGION');
        $endpoint = getenv('FOF_UPLOAD_AWS_S3_ENDPOINT');
        $pathStyle = getenv('FOF_UPLOAD_AWS_S3_PATH_STYLE_ENDPOINT');
        $key = getenv('FOF_UPLOAD_AWS_S3_KEY');
        $secret = getenv('FOF_UPLOAD_AWS_S3_SECRET');
        $bucket = getenv('FOF_UPLOAD_AWS_S3_BUCKET');
        $acl = getenv('FOF_UPLOAD_AWS_S3_ACL');
        $customUrl = getenv('FOF_UPLOAD_AWS_S3_CUSTOM_URL');
        $cdnUrl = getenv('FOF_UPLOAD_CDN_URL');

        $config = [
            'region'                  => empty($region) ? null : $region,
            'endpoint'                => empty($endpoint) ? null : $endpoint,
            'use_path_style_endpoint' => empty($pathStyle) ? null : (bool) $pathStyle,
            'bucket'                  => $bucket,
            'acl'                     => empty($acl) ? null : $acl,
            'custom_url'              => empty($customUrl) ? null : $customUrl,
            'cdn_url'                 => empty($cdnUrl) ? null : $cdnUrl,
        ];

        // Only explicitly provide credentials if available.
        // Otherwise S3Client will attempt to use instance profile.
        if ($key && $secret) {
            $config['credentials'] = [
                'key'    => $key,
                'secret' => $secret,
            ];
        }

        return $config;
    }

    /**
     * Build S3 configuration from settings repository.
     */
    protected function buildS3ConfigFromSettings(): array
    {
        $region = $this->settings->get('fof-upload.awsS3Region');
        $endpoint = $this->settings->get('fof-upload.awsS3Endpoint');
        $pathStyle = $this->settings->get('fof-upload.awsS3UsePathStyleEndpoint');
        $key = $this->settings->get('fof-upload.awsS3Key');
        $secret = $this->settings->get('fof-upload.awsS3Secret');
        $bucket = $this->settings->get('fof-upload.awsS3Bucket');
        $acl = $this->settings->get('fof-upload.awsS3ACL');
        $customUrl = $this->settings->get('fof-upload.awsS3CustomUrl');
        $cdnUrl = $this->settings->get('fof-upload.cdnUrl');

        $config = [
            'region'                  => empty($region) ? null : $region,
            'endpoint'                => empty($endpoint) ? null : $endpoint,
            'use_path_style_endpoint' => empty($pathStyle) ? null : (bool) $pathStyle,
            'bucket'                  => $bucket,
            'acl'                     => empty($acl) ? null : $acl,
            'custom_url'              => empty($customUrl) ? null : $customUrl,
            'cdn_url'                 => empty($cdnUrl) ? null : $cdnUrl,
        ];

        // Only explicitly provide credentials if available.
        // Otherwise S3Client will attempt to use instance profile.
        if ($key && $secret) {
            $config['credentials'] = [
                'key'    => $key,
                'secret' => $secret,
            ];
        }

        return $config;
    }
}
