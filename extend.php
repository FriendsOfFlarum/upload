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

use Blomstra\Gdpr\Extend\UserData;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ListPostsController;
use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Controller\ShowUserController;
use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend;
use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Revised;
use Flarum\Settings\Event\Deserializing;
use Flarum\User\User;
use FoF\Upload\Events\File\WillBeUploaded;
use FoF\Upload\Exceptions\ExceptionHandler;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\Extend\SvgSanitizer;
use FoF\Upload\Extenders\LoadFilesRelationship;
use FoF\Upload\Helpers\Util;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/fof/uploads', 'fof-upload.list', Api\Controllers\ListUploadsController::class)
        ->post('/fof/upload', 'fof-upload.upload', Api\Controllers\UploadController::class)
        ->post('/fof/watermark', 'fof-upload.watermark', Api\Controllers\WatermarkUploadController::class)
        ->delete('/fof/watermark', 'fof-upload.watermark.delete', Api\Controllers\WatermarkDeleteController::class)
        ->get('/fof/download/{uuid}/{post}/{csrf}', 'fof-upload.download', Api\Controllers\DownloadController::class)
        ->get('/fof/download/{uuid}', 'fof-upload.download.uuid', Api\Controllers\DownloadController::class)
        ->post('/fof/upload/inspect-mime', 'fof-upload.inspect-mime', Api\Controllers\InspectMimeController::class)
        ->patch('/fof/upload/hide', 'fof-upload.hide', Api\Controllers\HideUploadFromMediaManagerController::class)
        ->get('/fof/upload/shared-files', 'fof-upload.shared-files.index', Api\Controllers\ListSharedUploadsController::class)
        ->delete('/fof/upload/delete/{uuid}', 'fof-upload.delete', Api\Controllers\DeleteFileController::class),

    // Disabled pending https://github.com/FriendsOfFlarum/upload/issues/374
    // (new Extend\Console())
    //     ->command(Console\MapFilesCommand::class),

    (new Extend\Csrf())
        ->exemptRoute('fof-upload.download'),

    (new Extend\Model(User::class))
        ->cast('foffiles_current_count', 'int')
        ->cast('foffiles_count', 'int')
        ->hasMany('foffiles', File::class, 'actor_id')
        ->relationship('foffilesCurrent', function (User $model) {
            return $model->foffiles()->where('hidden', false);
        }),

    (new Extend\ApiController(ShowUserController::class))
        ->prepareDataForSerialization([LoadFilesRelationship::class, 'countRelations']),
    (new Extend\ApiController(ShowForumController::class))
        ->prepareDataForSerialization([LoadFilesRelationship::class, 'countRelations']),
    (new Extend\ApiController(ListDiscussionsController::class))
        ->prepareDataForSerialization([LoadFilesRelationship::class, 'countRelations']),
    (new Extend\ApiController(ListPostsController::class))
        ->prepareDataForSerialization([LoadFilesRelationship::class, 'countRelations']),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(Extenders\AddForumAttributes::class),

    (new Extend\Event())
        ->listen(Deserializing::class, Listeners\AddAvailableOptionsInAdmin::class)
        ->listen(Posted::class, Listeners\LinkImageToPostOnSave::class)
        ->listen(Revised::class, Listeners\LinkImageToPostOnSave::class)
        ->listen(WillBeUploaded::class, Listeners\AddImageProcessor::class),

    (new Extend\Filesystem())
        ->disk('private-shared', Extenders\PrivateSharedDiskConfig::class),

    (new Extend\ServiceProvider())
        ->register(Providers\UtilProvider::class)
        ->register(Providers\StorageServiceProvider::class)
        ->register(Providers\DownloadProvider::class)
        ->register(Providers\SanitizerProvider::class),

    (new Extend\View())
        ->namespace('fof-upload.templates', __DIR__.'/resources/templates'),

    (new Extend\ApiSerializer(CurrentUserSerializer::class))
        ->attributes(Extenders\AddCurrentUserAttributes::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(Extenders\AddUserAttributes::class),

    (new Extend\Formatter())
        ->render(Formatter\TextPreview\FormatTextPreview::class),

    (new SvgSanitizer())
        ->allowTag('animate'),

    (new Extend\ErrorHandling())
        ->handler(InvalidUploadException::class, ExceptionHandler::class),

    (new Extend\Settings())
        ->default('fof-upload.maxFileSize', Util::DEFAULT_MAX_FILE_SIZE)
        ->default('fof-upload.s3CustomUrl', ''),  // Default to empty, meaning use AWS default URL

    new Extenders\AddPostDownloadTags(),
    new Extenders\CreateStorageFolder('tmp'),

    (new Extend\Filesystem())
        ->disk('private-shared', Extenders\PrivateSharedDiskConfig::class),

    (new Extend\Policy())
        ->modelPolicy(File::class, Access\FilePolicy::class),

    (new Extend\Conditional())
        ->whenExtensionEnabled('blomstra-gdpr', fn () => [
            (new UserData())
                ->addType(Data\Uploads::class),
        ]),
];
