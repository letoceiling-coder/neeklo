<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BriefSubmission extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'company',
        'role',
        'project_name',
        'description',
        'phone',
        'email',
        'files',
    ];

    protected $attributes = [
        'files' => '[]',
    ];

    protected $casts = [
        'files' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
