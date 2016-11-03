<?php

namespace Flagrow\Upload\Adapters;

use Flagrow\Upload\File;

class AwsS3v3 extends Local
{
    protected function generateUrl(File $file)
    {
        return sprintf(
            'https://s3.%s.amazonaws.com/%s/%s',
            $this->filesystem->getAdapter()->getClient()->getRegion(),
            $this->filesystem->getBucket(),
            $file->path
        );
    }
}
