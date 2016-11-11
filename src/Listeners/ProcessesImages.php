<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Events\File\WillBeSaved;
use Flagrow\Upload\Events\File\WillBeUploaded;
use Flagrow\Upload\Processors\ImageProcessor;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;

class ProcessesImages
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(WillBeUploaded::class, [$this, 'processor']);
        $events->listen(WillBeSaved::class, [$this, 'modifyMarkdown']);
    }

    public function processor(WillBeUploaded $event)
    {
        if ($this->validateMime($event->file->type)) {
            app(ImageProcessor::class)->process($event->file, $event->uploadedFile);
        }
    }

    public function modifyMarkdown(WillBeSaved $event)
    {
        if ($this->validateMime($event->file->type)) {
            $event->file->markdown_string = "![image {$event->file->base_name}]({$event->file->url})";
        }
    }

    protected function validateMime($mime)
    {
        if (Str::startsWith($mime, 'image/')) {
            return true;
        }

        return false;
    }
}
