<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingApiController extends Controller
{
    public function getBookingsByDate(Request $request)
    {
        try {
            $date = $request->query('date');
            if (!$date) {
                // If no date is provided, use today's date
                $dateCarbon = Carbon::today('Asia/Singapore');
            } else {
                // Parse the date in Asia/Singapore timezone
                $dateCarbon = Carbon::parse($date, 'Asia/Singapore')->startOfDay();
            }

            // Get bookings for the selected date
            $bookings = Booking::with(['user', 'classroom'])
                ->whereDate('start_time', $dateCarbon)
                ->where('status', '!=', 'cancelled')
                ->orderBy('start_time')
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => $booking->booking_id,
                        'ruang' => $booking->classroom->classroom_name,
                        'peminjam' => $booking->user->username . " (" . $booking->user->major . ")",
                        'waktu' => $booking->start_time->format('H:i') . ' - ' . $booking->end_time->format('H:i')
                    ];
                });

            return response()->json($bookings);
        } catch (\Exception $e) {
            \Log::error('Error fetching bookings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch bookings'], 500);
        }
    }
}
