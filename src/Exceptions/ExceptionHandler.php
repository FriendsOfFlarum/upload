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

namespace FoF\Upload\Exceptions;

use Flarum\Foundation\ErrorHandling\HandledError;

class ExceptionHandler
{
    public function handle(InvalidUploadException $e): HandledError
    {
        return (new HandledError(
            $e,
            "fof-upload.$e->type",
            $e->status
        ))->withDetails($this->errorDetails($e));
    }

    protected function errorDetails(InvalidUploadException $e): array
    {
        $errors = $e->errors();

        return array_map(function (string $field, array $messages): array {
            return [
                'detail' => implode("\n", $messages),
                'source' => ['pointer' => "/data/attributes/$field"],
            ];
        }, array_keys($errors), $errors);
    }
}
