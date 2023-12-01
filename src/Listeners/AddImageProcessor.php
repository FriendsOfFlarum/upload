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

namespace FoF\Upload\Listeners;

use FoF\Upload\Events\File\WillBeUploaded;
use FoF\Upload\Processors\ImageProcessor;

class AddImageProcessor
{
    public function __construct(
        public ImageProcessor $processor
    ) {
    }

    public function handle(WillBeUploaded $event): void
    {
        if ($this->validateMime($event->mime)) {
            $this->processor->process($event->file, $event->uploadedFile, $event->mime);
        }
    }

    protected function validateMime($mime): bool
    {
        if ($mime == 'image/jpeg' || $mime == 'image/png' || $mime == 'image/gif' || $mime == 'image/svg+xml') {
            return true;
        }

        return false;
    }
}
