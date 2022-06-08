<?php

namespace FoF\Upload\Concerns;

use FoF\Upload\File;
use Illuminate\Database\Query\JoinClause;

trait MatchingPosts
{
    protected function matchPosts(callable $mutate = null): int
    {
        $table = (new File)->getTable();
        $db = (new File)->getConnection();

        return File::query()
            ->join('posts', function (JoinClause $join) use ($table, $db) {
                $join
                    ->on("$table.actor_id", "=", "posts.user_id")
                    ->where('content', 'like', $db->raw("CONCAT('%', $table.url, '%')"))
                    ->limit(1);
            })
            ->whereNull('post_id')
            ->whereNotNull('posts.id')
            ->when($mutate, $mutate)
            ->whereDoesntHave('downloads')
            ->whereBetween("$table.created_at", [
                $db->raw("date_sub(posts.created_at, interval 1 hour)"),
                $db->raw("date_add(posts.created_at, interval 1 hour)")
            ])
            ->groupBy("$table.id")
            ->update([
                "$table.post_id" => $db->raw('posts.id'),
                "$table.discussion_id" => $db->raw('posts.discussion_id'),
            ]);
    }
}
