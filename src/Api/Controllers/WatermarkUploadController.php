<?php

namespace FoF\Upload\Api\Controllers;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class WatermarkUploadController extends ShowForumController
{
    use AssertPermissionTrait;

    protected $settings;
    protected $app;

    public function __construct(SettingsRepositoryInterface $settings, Application $app)
    {
        $this->settings = $settings;
        $this->app = $app;
    }

    public function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $file = array_get($request->getUploadedFiles(), 'fof/watermark');

        $tmpFile = tempnam($this->app->storagePath().'/tmp', 'fof-watermark');

        $file->moveTo($tmpFile);

        $mount = new MountManager([
            'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
            'target' => new Filesystem(new Local($this->app->storagePath())),
        ]);

        if (($path = $this->settings->get('fof-upload.watermark')) && $mount->has($file = "target://$path")) {
            $mount->delete($file);
        }

        $uploadName = 'fof-upload-watermark-'.Str::lower(Str::random(8));

        $mount->move('source://'.pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");

        $this->settings->set('fof-upload.watermark', $uploadName);

        return parent::data($request, $document);
    }
}
