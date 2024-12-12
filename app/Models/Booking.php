<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $table = 'booking';

    public $timestamps = false;

    protected $primaryKey = 'booking_id';

    protected $fillable = [
        'user_id',
        'classroom_id',
        'start_time',
        'end_time',
        'sks_duration',
        'status',
        'url_image_start',
        'url_image_end',
        'user_size' // Add this back
    ];

    protected $dates = [
        'start_time',
        'end_time'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'sks_duration' => 'integer',
        'user_size' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'classroom_id', 'classroom_id');
    }
}
