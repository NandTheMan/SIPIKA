<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Facility extends Model
{
    protected $table = 'facilities';
    
    public $timestamps = false;

    protected $primaryKey = 'facility_id';
    
    protected $fillable = ['facility_name'];

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'classroom_facilities', 'facility_id', 'classroom_id');
    }
}

