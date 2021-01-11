<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\User\User;
use FoF\Upload\Contracts\Template;
use FoF\Upload\Contracts\UploadAdapter;
use Illuminate\Support\Str;

/**
 * @property int                                                 $id
 * @property string                                              $base_name
 * @property string                                              $path
 * @property string                                              $url
 * @property string                                              $type
 * @property int                                                 $size
 * @property string                                              $uuid
 * @property string                                              $humanSize
 * @property string                                              $upload_method
 * @property string                                              $remote_id
 * @property string                                              $tag
 * @property int                                                 $post_id
 * @property Post                                                $post
 * @property int                                                 $discussion_id
 * @property Discussion                                          $discussion
 * @property int                                                 $actor_id
 * @property User                                                $actor
 * @property \Illuminate\Database\Eloquent\Collection|Download[] $downloads
 * @property Carbon                                              $created_at
 */
class File extends AbstractModel
{
    protected $table = 'fof_upload_files';

    protected $appends = ['humanSize'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    /**
     * @param string|UploadAdapter $value
     */
    public function setUploadMethodAttribute($value)
    {
        if (is_object($value) && in_array(UploadAdapter::class, class_implements($value))) {
            $value = Str::snake(last(explode('\\', get_class($value))));
        }

        $this->attributes['upload_method'] = $value;
    }

    /**
     * @param Template $template
     */
    public function setTagAttribute(Template $template)
    {
        $this->attributes['tag'] = $template->tag();
    }

    /**
     * @return string
     */
    public function getHumanSizeAttribute()
    {
        return $this->human_filesize($this->size);
    }

    /**
     * @param $bytes
     * @param int $decimals
     *
     * @return string
     */
    public function human_filesize($bytes, $decimals = 0)
    {
        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)).@$size[$factor];
    }
}
