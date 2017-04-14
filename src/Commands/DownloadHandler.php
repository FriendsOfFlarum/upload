<?php

namespace Flagrow\Upload\Commands;

use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Validators\DownloadValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\DiscussionRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DownloadHandler
{
    use AssertPermissionTrait;

    /**
     * @var FileRepository
     */
    private $files;
    /**
     * @var DownloadValidator
     */
    private $validator;
    /**
     * @var DiscussionRepository
     */
    private $discussions;

    public function __construct(FileRepository $files, DownloadValidator $validator, DiscussionRepository $discussions)
    {

        $this->files = $files;
        $this->validator = $validator;
        $this->discussions = $discussions;
    }

    /**
     * @param Download $command
     */
    public function handle(Download $command)
    {
        $discussion = $this->discussions->query()->find($command->discussionId);

        $this->assertCan(
            $command->actor,
            'flagrow.upload.download',
            $discussion ?: []
        );

        $file = $this->files->findByUuid($command->uuid);

        if (!$file) {
            throw new ModelNotFoundException();
        }

        $this->validator->assertValid(compact('file'));
    }
}
