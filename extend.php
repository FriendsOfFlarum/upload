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

namespace FoF\Upload;

use Flarum\Api\Context;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Extend;
use Flarum\Gdpr\Extend\UserData;
use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Revised;
use Flarum\Post\Post;
use Flarum\Search\Database\DatabaseSearchDriver;
use Flarum\Settings\Event\Deserializing;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Upload\Events\File\WillBeUploaded;
use FoF\Upload\Exceptions\ExceptionHandler;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\Extend\SvgSanitizer;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Filesystem\Factory;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js')
        ->jsDirectory(__DIR__.'/js/dist/admin')
        ->content(Content\AdminPayload::class),

    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js')
        ->jsDirectory(__DIR__.'/js/dist/forum'),

    (new Extend\Frontend('common'))
        ->jsDirectory(__DIR__.'/js/dist/common'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/fof/uploads', 'fof-upload.list', Api\Handlers\ListFilesHandler::class)
        ->get('/fof/upload/shared-files', 'fof-upload.shared-files.index', Api\Handlers\ListFilesHandler::class)
        ->post('/fof/upload', 'fof-upload.upload', Api\Handlers\UploadHandler::class)
        ->post('/fof/watermark', 'fof-upload.watermark', Api\Handlers\WatermarkUploadHandler::class)
        ->delete('/fof/watermark', 'fof-upload.watermark.delete', Api\Controllers\WatermarkDeleteController::class)
        ->get('/fof/download/{uuid}/{post}/{csrf}', 'fof-upload.download', Api\Controllers\DownloadController::class)
        ->get('/fof/download/{uuid}', 'fof-upload.download.uuid', Api\Controllers\DownloadController::class)
        ->post('/fof/upload/inspect-mime', 'fof-upload.inspect-mime', Api\Controllers\InspectMimeController::class)
        ->patch('/fof/upload/hide', 'fof-upload.hide', Api\Handlers\HideUploadFromMediaManagerHandler::class)
        ->delete('/fof/upload/delete/{uuid}', 'fof-upload.delete', Api\Controllers\DeleteFileController::class),

    (new Extend\Console())
        ->command(Console\MapFilesCommand::class)
        ->command(Console\BackfillImageDimensionsCommand::class)
        ->command(Console\BackfillThumbnailsCommand::class),

    (new Extend\Csrf())
        ->exemptRoute('fof-upload.download'),

    (new Extend\Model(User::class))
        ->cast('foffiles_current_count', 'int')
        ->cast('foffiles_count', 'int')
        ->hasMany('foffiles', File::class, 'actor_id')
        ->relationship('foffilesCurrent', function (User $model) {
            return $model->foffiles()->where('hidden', false);
        }),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(function () {
            return [
                Schema\Boolean::make('fof-upload.canUpload')
                    ->get(fn (object $forum, Context $context) => $context->getActor()->can('fof-upload.upload')),
                Schema\Boolean::make('fof-upload.canDownload')
                    ->get(fn (object $forum, Context $context) => $context->getActor()->can('fof-upload.download')),
                Schema\Str::make('fof-upload.composerButtonVisiblity')
                    ->get(fn () => resolve(SettingsRepositoryInterface::class)->get('fof-upload.composerButtonVisiblity', 'both')),
                Schema\Str::make('fof-watermarkUrl')
                    ->visible(fn () => (bool) resolve(SettingsRepositoryInterface::class)->get('fof-watermark_path'))
                    ->get(function () {
                        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                        $disk = resolve(Factory::class)->disk('flarum-assets');

                        return $disk->url(resolve(SettingsRepositoryInterface::class)->get('fof-watermark_path'));
                    }),
            ];
        })
        ->endpoint('show', function ($endpoint) {
            return $endpoint->after(function (Context $context, $data) {
                $actor = $context->getActor();
                if ($actor->isGuest() === false) {
                    $actor->load('foffiles');
                    $actor->load('foffilesCurrent');
                }

                return $data;
            });
        }),

    (new Extend\ApiResource(Resource\UserResource::class))
        ->fields(fn () => [
            Schema\Boolean::make('fof-upload-viewOthersMediaLibrary')
                ->hidden(fn (User $user, Context $context) => $context->getActor()->id !== $user->id || !$context->getActor()->hasPermission('fof-upload.viewUserUploads'))
                ->get(fn (User $user, Context $context) => $context->getActor()->hasPermission('fof-upload.viewUserUploads')),
            Schema\Boolean::make('fof-upload-deleteOthersMediaLibrary')
                ->hidden(fn (User $user, Context $context) => $context->getActor()->id !== $user->id || !$context->getActor()->hasPermission('fof-upload.deleteUserUploads'))
                ->get(fn (User $user, Context $context) => $context->getActor()->hasPermission('fof-upload.deleteUserUploads')),
            Schema\Boolean::make('fof-upload-uploadSharedFiles')
                ->hidden(fn (User $user, Context $context) => $context->getActor()->id !== $user->id || !$context->getActor()->hasPermission('fof-upload.upload-shared-files'))
                ->get(fn (User $user, Context $context) => $context->getActor()->hasPermission('fof-upload.upload-shared-files')),
            Schema\Boolean::make('fof-upload-accessSharedFiles')
                ->hidden(fn (User $user, Context $context) => $context->getActor()->id !== $user->id || !$context->getActor()->hasPermission('fof-upload.access-shared-files'))
                ->get(fn (User $user, Context $context) => $context->getActor()->hasPermission('fof-upload.access-shared-files')),
            Schema\Number::make('fof-upload-uploadCountCurrent')
                ->countRelation('foffilesCurrent'),
            Schema\Number::make('fof-upload-uploadCountAll')
                ->countRelation('foffiles'),
        ]),

    (new Extend\Event())
        ->listen(Deserializing::class, Listeners\AddAvailableOptionsInAdmin::class)
        ->listen(Posted::class, Listeners\LinkFilesToPostOnSave::class)
        ->listen(Revised::class, Listeners\LinkFilesToPostOnSave::class)
        ->listen(WillBeUploaded::class, Listeners\AddImageProcessor::class),

    (new Extend\ModelObserver(Post::class, Listeners\CleanUpFilesOnPostDelete::class)),

    (new Extend\Filesystem())
        ->disk('private-shared', Extenders\PrivateSharedDiskConfig::class),

    (new Extend\ServiceProvider())
        ->register(Providers\UtilProvider::class)
        ->register(Providers\StorageServiceProvider::class)
        ->register(Providers\DownloadProvider::class)
        ->register(Providers\SanitizerProvider::class)
        ->register(Providers\MimeMappingProvider::class),

    (new Extend\View())
        ->namespace('fof-upload.templates', __DIR__.'/resources/templates'),

    (new Extend\Formatter())
        ->render(Formatter\ImagePreview\FormatImagePreview::class)
        ->render(Formatter\TextPreview\FormatTextPreview::class),

    (new SvgSanitizer())
        ->removeTag('image')
        ->removeTag('style'),

    (new Extend\ErrorHandling())
        ->handler(InvalidUploadException::class, ExceptionHandler::class),

    (new Extend\Settings())
        ->default('fof-upload.maxFileSize', Util::DEFAULT_MAX_FILE_SIZE)
        ->default('fof-upload.s3CustomUrl', '')  // Default to empty, meaning use AWS default URL
        ->default('fof-upload.svgAnimateAllowed', false)
        ->default('fof-upload.generateThumbnails', true)
        ->default('fof-upload.thumbnailWebp', true)
        ->default('fof-upload.thumbnailMaxWidth', 1000)
        ->default('fof-upload.deleteFilesOnPostDelete', false),

    new Extenders\AddPostDownloadTags(),
    new Extenders\CreateStorageFolder('tmp'),

    (new Extend\Filesystem())
        ->disk('private-shared', Extenders\PrivateSharedDiskConfig::class),

    (new Extend\Policy())
        ->modelPolicy(File::class, Access\FilePolicy::class),

    (new Extend\Conditional())
        ->whenExtensionEnabled('flarum-gdpr', fn () => [
            (new UserData())
                ->addType(Data\Uploads::class),
        ]),
    new Extend\ApiResource(Api\Resource\FileResource::class),

    (new Extend\SearchDriver(DatabaseSearchDriver::class))
        ->addSearcher(File::class, Search\FileSearcher::class)
        ->addFilter(Search\FileSearcher::class, Search\Filter\SharedFilter::class)
        ->addFilter(Search\FileSearcher::class, Search\Filter\UserFilter::class)
        ->addMutator(Search\FileSearcher::class, Search\FileSearchMutator::class),
];
