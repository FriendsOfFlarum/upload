<?php

namespace FoF\Upload\Extenders;

use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;

class PrivateSharedDiskConfig
{
    public function __invoke(Paths $paths, UrlGenerator $url): array
    {
        return [
            'root' => $paths->storage . '/private-shared/files',
            'visibility' => 'private',
        ];
    }
}
