<?php

namespace FoF\Upload;

use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $upload_id
 * @property string $file_id
 * @property int $image_width
 * @property int $image_height
 * @property File $file
 */
class ImageMetadata extends AbstractModel
{
    protected $table = 'fof_upload_image_metadata';

    // The primary key is 'upload_id', not 'id'
    protected $primaryKey = 'upload_id';
    public $incrementing = false; // because it's not auto-incrementing (as it's a foreign key)
    protected $keyType = 'int';

    protected $fillable = [
        'file_id',
        'image_width',
        'image_height',
    ];

    public static function byUuid(string $uuid): Builder
    {
        return static::query()
            ->where('uuid', $uuid);
    }

    public static function byFile($file): Builder|\Illuminate\Database\Eloquent\Model|null
    {
        if (!$file) {
            return null;
        }

        return static::query()->where('upload_id', $file->id)->first();
    }

    /**
     * Relation to the File model
     */
    public function file(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(File::class, 'upload_id', 'id');
    }

    /**
     * Static helper to find a metadata row by upload_id
     */
    public static function byUploadId(int $uploadId): \Illuminate\Database\Eloquent\Builder|null
    {
        return static::query()->where('upload_id', $uploadId)->first();
    }
}
