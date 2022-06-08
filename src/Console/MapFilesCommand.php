<?php

namespace FoF\Upload\Console;

use FoF\Upload\Concerns\MatchingPosts;
use Illuminate\Console\Command;
use Illuminate\Database\ConnectionInterface;

class MapFilesCommand extends Command
{
    use MatchingPosts;

    protected $signature = 'fof:upload:map';
    protected $description = 'Helps restore mapping of uploaded files to their relative posts';

    public function handle(ConnectionInterface $db)
    {
        $updated = $this->matchPosts();

        $this->info("$updated files have been matched against posts.");
    }
}
