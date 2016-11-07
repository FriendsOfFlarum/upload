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

namespace Flagrow\Upload\Adapters;

use Flagrow\Upload\File;

class AwsS3 extends Local
{
    protected function generateUrl(File $file)
    {
        $baseUrl = $this->filesystem->getAdapter()->getClient()->getRegion() == null
            ?
            'https://s3.amazonaws.com/'
            :
            sprintf('https://s3.%s.amazonaws.com/', $this->filesystem->getAdapter()->getClient()->getRegion());

        $file->url = sprintf(
            $baseUrl . '%s/%s',
            $this->filesystem->getAdapter()->getBucket(),
            $file->path
        );
    }
}
