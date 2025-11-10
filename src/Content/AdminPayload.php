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

namespace FoF\Upload\Content;

use Flarum\Frontend\Document;
use FoF\Upload\Driver\Config as UploadConfig;

class AdminPayload
{
    public function __construct(
        protected UploadConfig $config
    ) {
    }

    public function __invoke(Document $document)
    {
        $document->payload['uploadS3SetByEnv'] = $this->config->shouldUseEnv();
        $document->payload['uploadLocalCdnSetByEnv'] = $this->config->shouldUseLocalCdnEnv();
    }
}
