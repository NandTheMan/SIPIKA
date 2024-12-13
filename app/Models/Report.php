<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $table = 'report';

    public $timestamps = false;

    protected $primaryKey = 'report_id';

    protected $fillable = [
        'reported_user_id',
        'classroom_id',
        'reporter_user_id',
        'report_time',
        'report_description',
        'report_status',
        'report_resolved_time',
        'url_image_report'
    ];

    protected $casts = [
        'report_time' => 'datetime',
        'report_resolved_time' => 'datetime',
        'report_status' => 'boolean'
    ];

    public function reportedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    public function reporterUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_user_id');
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }
}
