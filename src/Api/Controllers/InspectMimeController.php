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

namespace FoF\Upload\Api\Controllers;

use Exception;
use Flarum\Http\RequestUtil;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SoftCreatR\MimeDetector\MimeDetector;
use SoftCreatR\MimeDetector\MimeDetectorException;

class InspectMimeController implements RequestHandlerInterface
{
    public function __construct(
        protected FileRepository $files,
        protected MimeDetector $mimeDetector
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        /**
         * @var UploadedFileInterface[] $files
         */
        $files = Arr::get($request->getUploadedFiles(), 'files', []);

        if (count($files) === 0) {
            return new JsonResponse(null, 400);
        }

        try {
            $upload = $this->files->moveUploadedFileToTemp(Arr::first($files));
        } catch (ValidationException $exception) {
            return new JsonResponse([
                'laravel_validation'       => false,
                'laravel_validation_error' => implode("\n", Arr::flatten($exception->errors())),
            ]);
        }

        $data = [
            'laravel_validation' => true,
        ];

        try {
            $this->mimeDetector->setFile($upload->getPathname());

            $uploadFileData = $this->mimeDetector->getFileType();

            if (isset($uploadFileData['mime'])) {
                $data['mime_detector'] = $uploadFileData['mime'];
            }
        } catch (MimeDetectorException $e) {
            // Ignore errors. The value will be absent in response
        }

        try {
            $data['php_mime'] = mime_content_type($upload->getPathname());
        } catch (Exception $e) {
            // Ignore errors. The value will be absent in response
        }

        try {
            $data['guessed_extension'] = $upload->guessExtension() ?: 'bin';
        } catch (Exception $e) {
            // Ignore errors. The value will be absent in response
        }

        return new JsonResponse($data);
    }
}
