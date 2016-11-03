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

class AwsS3v3 extends Local
{
    protected function generateUrl(File $file)
    {
        return sprintf(
            'https://s3.%s.amazonaws.com/%s/%s',
            $this->filesystem->getAdapter()->getClient()->getRegion(),
            $this->filesystem->getAdapter()->getBucket(),
            $file->path
        );
    }
}
