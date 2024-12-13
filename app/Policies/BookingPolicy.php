<?php

// 1. Add User Authorization Policy
namespace App\Policies;

use App\Models\User;
use App\Models\Booking;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookingPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Booking $booking)
    {
        // Users can only view their own bookings unless they're admin
        return $user->roles->contains('role_name', 'Admin') || $user->user_id === $booking->user_id;
    }

    public function update(User $user, Booking $booking)
    {
        // Users can only update their own bookings unless they're admin
        return $user->roles->contains('role_name', 'Admin') || $user->user_id === $booking->user_id;
    }

    public function endEarly(User $user, Booking $booking)
    {
        // Users can only end their own bookings early
        return $user->user_id === $booking->user_id;
    }
}
