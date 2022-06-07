<?php

namespace FoF\Upload\Console;

use FoF\Upload\File;
use Illuminate\Console\Command;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Query\JoinClause;

class MapFilesCommand extends Command
{
    protected $signature = 'fof:upload:map';
    protected $description = 'Helps restore mapping of uploaded files to their relative posts';

    public function handle(ConnectionInterface $db)
    {
        $table = (new File)->getTable();

        File::query()
            ->select(["$table.id as file_id", "posts.id as matching_post_id"])
            ->join('posts', function (JoinClause $join) use ($table, $db) {
                $join
                    ->on("$table.actor_id", "=", "posts.user_id")
                    ->where('content', 'like', $db->raw("CONCAT('%', $table.url, '%')"))
                    ->limit(1);
            })
            ->whereNull('post_id')
            ->whereNotNull('posts.id')
            ->whereDoesntHave('downloads')
            ->whereBetween("$table.created_at", [
                $db->raw("date_sub(posts.created_at, interval 1 hour)"), "posts.created_at"
            ])
            ->groupBy("$table.id")
            ->dd()
            ->update(['post_id' => $db->raw('posts.id')]);
    }
}
