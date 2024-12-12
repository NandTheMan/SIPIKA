<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $table = 'roles';

    public $timestamps = false;

    protected $primaryKey = 'role_id';
    
    protected $fillable = ['role_name', 'role_id'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_roles', 'role_id', 'user_id')
                    ->withPivot(['role_id', 'user_id']);
    }
}