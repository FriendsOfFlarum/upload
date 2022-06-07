<?php

namespace FoF\Upload\Listeners;

use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Revised;
use FoF\Upload\File;
use Illuminate\Database\Query\JoinClause;

class LinkImageToPostOnSave
{
    public function handle(Posted|Revised $event)
    {
        $table = (new File)->getTable();
        $db = $event->post->getConnection();

        File::query()
            ->select(["$table.id as file_id", "posts.id as matching_post_id"])
            ->join('posts', function (JoinClause $join) use ($table, $db) {

                $join
                    ->on("$table.actor_id", "=", "posts.user_id")
                    ->where('content', 'like', $db->raw("CONCAT('%', $table.url, '%')"))
                    ->limit(1);
            })
            ->where('actor_id', $event->actor->id)
            ->whereNull('post_id')
            ->whereNotNull('posts.id')
            ->whereDoesntHave('downloads')
            ->whereBetween("$table.created_at", [
                (clone $event->post->created_at)->subHour(),
                $event->post->created_at
            ])
            ->groupBy("$table.id")
            ->update(['post_id' => $db->raw('posts.id')]);
    }
}
