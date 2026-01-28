<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Case extends Model
{
    protected $table = 'cases';

    protected $fillable = [
        'slug',
        'title',
        'category',
        'year',
        'featured',
        'description',
        'meta',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'year' => 'integer',
        'meta' => 'array',
    ];

    public function media(): HasMany
    {
        return $this->hasMany(CaseMedia::class, 'case_id')->orderBy('order');
    }

    /** Первое изображение — обложка */
    public function getCoverAttribute(): ?string
    {
        $m = $this->media()->where('type', 'image')->orderBy('order')->first();
        return $m ? $m->url : null;
    }

    /** Все изображения для галереи (1–5) */
    public function getGalleryImagesAttribute(): array
    {
        return $this->media()
            ->where('type', 'image')
            ->orderBy('order')
            ->get()
            ->map(fn ($m) => ['type' => 'image', 'src' => $m->url, 'alt' => $m->alt ?? ''])
            ->values()
            ->all();
    }

    /** Одно видео (опционально) */
    public function getVideoAttribute(): ?string
    {
        $m = $this->media()->where('type', 'video')->orderBy('order')->first();
        return $m ? $m->url : null;
    }
}
