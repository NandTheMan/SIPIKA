<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Report;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Report $report)
    {
        // Users can view their own reports and admins can view all reports
        return $user->roles->contains('role_name', 'Admin') || $user->user_id === $report->reporter_user_id;
    }

    public function create(User $user)
    {
        // All authenticated users can create reports
        return true;
    }

    public function update(User $user, Report $report)
    {
        // Only admins can update reports
        return $user->roles->contains('role_name', 'Admin');
    }

    public function resolve(User $user, Report $report)
    {
        // Only admins can resolve reports
        return $user->roles->contains('role_name', 'Admin');
    }
}
