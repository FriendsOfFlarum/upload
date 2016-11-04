<?php

namespace Flagrow\Upload\Contracts;

use Flagrow\Upload\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface Processable
{

    /**
     * @param File $file
     * @param UploadedFile $upload
     * @return File
     */
    public function process(File &$file, UploadedFile &$upload);

}