<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Booking;

class BookingHelper
{
    public function checkOverlap($startTime, $endTime, $classroomId, $excludeBookingId = null)
    {
        $query = Booking::where('classroom_id', $classroomId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->where(function($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function($innerQ) use ($startTime, $endTime) {
                        $innerQ->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            });

        if ($excludeBookingId) {
            $query->where('booking_id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }

    public function isWithinCheckInWindow(Booking $booking)
    {
        $now = Carbon::now('Asia/Singapore');
        $startTime = Carbon::parse($booking->start_time)->timezone('Asia/Singapore');
        $earliestStart = $startTime->copy()->subMinutes(15);
        $latestStart = $startTime->copy()->addMinutes(15);

        return $now->between($earliestStart, $latestStart);
    }

    public function getCheckInWindow(Booking $booking)
    {
        $startTime = Carbon::parse($booking->start_time)->timezone('Asia/Singapore');

        return [
            'earliest' => $startTime->copy()->subMinutes(15)->format('H:i'),
            'latest' => $startTime->copy()->addMinutes(15)->format('H:i')
        ];
    }

    public function canCancel(Booking $booking)
    {
        return $booking->status === 'pending';
    }

    public function canStart(Booking $booking)
    {
        return $booking->status === 'pending' && $this->isWithinCheckInWindow($booking);
    }

    public function canEndEarly(Booking $booking)
    {
        return $booking->status === 'in_progress';
    }

    public function checkAndCancelOverdueBookings()
    {
        $overdueBookings = Booking::where('status', 'pending')
            ->where('start_time', '<=', now()->subMinutes(15))
            ->get();

        foreach ($overdueBookings as $booking) {
            $booking->update(['status' => 'cancelled']);
        }
    }
}
