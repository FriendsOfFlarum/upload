<?php

namespace FoF\Upload\Providers;

use Aws\S3\S3Client;
use FoF\Upload\Adapters;
use FoF\Upload\Adapters\Qiniu;
use FoF\Upload\Helpers\Settings;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Container\Container;
use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Adapter as FlyAdapters;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
use Overtrue\Flysystem\Qiniu\QiniuAdapter;
use Qiniu\Http\Client as QiniuClient;

class StorageServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        /** @var Settings $settings */
        $settings = $this->app->make(Settings::class);

        $this->instantiateUploadAdapters($this->app);

        if ($settings->get('overrideAvatarUpload')) {
            // .. todo
        }
    }

    /**
     * Sets the upload adapter for the specific preferred service.
     *
     * @param Container $app
     */
    protected function instantiateUploadAdapters(Container $app)
    {
        /** @var Settings $settings */
        $settings = $app->make(Settings::class);

        $settings->getMimeTypesConfiguration()
            ->each(function ($mimetype) use ($app, $settings) {
                $adapter = Arr::get($mimetype, 'adapter', $mimetype);

                // Skip if already bound.
                if ($app->bound("fof.upload-adapter.$adapter")) {
                    return;
                }

                $app->bind("fof.upload-adapter.$adapter", function () use ($settings, $adapter) {
                    switch ($adapter) {
                        case 'aws-s3':
                            if (class_exists(S3Client::class)) {
                                return $this->awsS3($settings);
                            }
                            break;
                        case 'ovh-svfs':
                            // Previously supported, but the driver package has been deleted by the author
                            // We keep this `case` so that an error is thrown in cas someone still had that config
                            break;
                        case 'imgur':
                            return $this->imgur($settings);
                        case 'qiniu':
                            if (class_exists(QiniuClient::class)) {
                                return $this->qiniu($settings);
                            }
                            break;
                        default:
                            return $this->local($settings);
                    }

                    throw new \Exception("Unknown adapter $adapter or missing dependency");
                });
            });
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\AwsS3
     */
    protected function awsS3(Settings $settings)
    {
        return new Adapters\AwsS3(
            new AwsS3Adapter(
                new S3Client([
                    'credentials' => [
                        'key' => $settings->get('awsS3Key'),
                        'secret' => $settings->get('awsS3Secret'),
                    ],
                    'region' => empty($settings->get('awsS3Region')) ? null : $settings->get('awsS3Region'),
                    'version' => 'latest',
                ]),
                $settings->get('awsS3Bucket')
            )
        );
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\Imgur
     */
    protected function imgur(Settings $settings)
    {
        return new Adapters\Imgur(
            new Guzzle([
                'base_uri' => 'https://api.imgur.com/3/',
                'headers' => [
                    'Authorization' => 'Client-ID ' . $settings->get('imgurClientId'),
                ],
            ])
        );
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\Local
     */
    protected function local(Settings $settings)
    {
        return new Adapters\Local(
            new FlyAdapters\Local(public_path('assets/files'))
        );
    }

    /**
     * @param  Settings $settings
     * @return Adapters\Qiniu
     */
    protected function qiniu(Settings $settings)
    {
        $client = new QiniuAdapter(
            $settings->get('qiniuKey'),
            $settings->get('qiniuSecret'),
            $settings->get('qiniuBucket'),
            $settings->get('cdnUrl')
        );

        return new Qiniu($client);
    }
}
