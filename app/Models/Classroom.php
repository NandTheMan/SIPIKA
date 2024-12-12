<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classroom extends Model
{   
    protected $table = 'classrooms';
    
    public $timestamps = false;

    protected $primaryKey = 'classroom_id';
    
    protected $fillable = [
        'classroom_name',
        'classroom_capacity',
        'floor',
        'is_booked'
    ];

    protected $casts = [
        'is_booked' => 'boolean',
        'classroom_capacity' => 'integer',
        'floor' => 'integer'
    ];

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(
            Facility::class, 
            'classroom_facilities', 
            'classroom_id', 
            'facility_id'
        );
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'classroom_id', 'classroom_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'classroom_id', 'classroom_id');
    }
}