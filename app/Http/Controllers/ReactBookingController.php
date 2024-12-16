<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use App\Models\PinnedClassroom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Helpers\SKSHelper;

class ReactBookingController extends Controller
{
    public function index()
    {
        $this->checkAndCancelOverdueBookings();

        $user = auth()->user();

        // Get active bookings
        $activeBookings = Booking::with(['classroom'])
            ->where('user_id', $user->user_id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->orderBy('start_time')
            ->get()
            ->map(function ($booking) {
                return $this->formatBookingData($booking);
            });

        // Get past and cancelled bookings
        $pastBookings = Booking::with(['classroom'])
            ->where('user_id', $user->user_id)
            ->whereIn('status', ['finished', 'cancelled'])
            ->orderBy('start_time', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return $this->formatBookingData($booking);
            });

        // Get pinned classrooms
        $pinnedClassrooms = PinnedClassroom::where('user_id', $user->user_id)
            ->with(['classroom.bookings' => function($query) {
                $query->whereIn('status', ['pending', 'in_progress'])
                    ->where('start_time', '<=', now())
                    ->where('end_time', '>=', now());
            }])
            ->get()
            ->map(function($pin) {
                $currentBooking = $pin->classroom->bookings->first();
                return [
                    'id' => $pin->id,
                    'classroom_id' => $pin->classroom->classroom_id,
                    'classroom_name' => $pin->classroom->classroom_name,
                    'is_available' => !$currentBooking,
                    'current_booking' => $currentBooking ? [
                        'end_time' => $currentBooking->end_time->format('H:i'),
                        'user_size' => $currentBooking->user_size
                    ] : null
                ];
            });

        return Inertia::render('BookingList', [
            'activeBookings' => $activeBookings,
            'pastBookings' => $pastBookings,
            'pinnedClassrooms' => $pinnedClassrooms,
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'major' => $user->major,
                    'is_penalized' => $user->is_penalized,
                ]
            ]
        ]);
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        $bookingData = $this->formatBookingDetailData($booking);

        return Inertia::render('BookingDetail', [
            'booking' => $bookingData,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function cancelBooking(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        if ($booking->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending bookings can be cancelled.']);
        }

        try {
            $booking->update([
                'status' => 'cancelled'
            ]);

            return redirect()->back()->with('success', 'Booking cancelled successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to cancel booking.']);
        }
    }

    private function formatBookingData($booking)
    {
        return [
            'id' => $booking->booking_id,
            'classroom_name' => $booking->classroom->classroom_name,
            'date' => $booking->start_time->format('l, j F Y'),
            'start_time' => $booking->start_time->format('H:i'),
            'end_time' => $booking->end_time->format('H:i'),
            'duration' => $this->formatDuration($booking->sks_duration),
            'status' => $booking->status,
            'user_size' => $booking->user_size,
            'can_cancel' => $booking->status === 'pending',
            'can_start' => $this->canStartBooking($booking),
            'can_end_early' => $booking->status === 'in_progress',
            'check_in_window' => [
                'earliest' => $booking->start_time->copy()->subMinutes(15)->format('H:i'),
                'latest' => $booking->start_time->copy()->addMinutes(15)->format('H:i'),
            ]
        ];
    }

    private function formatBookingDetailData($booking)
    {
        $data = $this->formatBookingData($booking);
        return array_merge($data, [
            'classroom' => [
                'id' => $booking->classroom->classroom_id,
                'name' => $booking->classroom->classroom_name,
                'capacity' => $booking->classroom->classroom_capacity,
                'floor' => $booking->classroom->floor,
                'facilities' => $booking->classroom->facilities->pluck('facility_name'),
            ],
            'start_photo' => $booking->url_image_start ? asset('storage/' . $booking->url_image_start) : null,
            'end_photo' => $booking->url_image_end ? asset('storage/' . $booking->url_image_end) : null,
        ]);
    }

    private function formatDuration($sks)
    {
        return SKSHelper::formatDuration($sks);
    }

    private function canStartBooking($booking)
    {
        if ($booking->status !== 'pending') {
            return false;
        }

        $now = Carbon::now('Asia/Singapore');
        $startTime = Carbon::parse($booking->start_time)->timezone('Asia/Singapore');
        $earliestStart = $startTime->copy()->subMinutes(15);
        $latestStart = $startTime->copy()->addMinutes(15);

        return $now->between($earliestStart, $latestStart);
    }

    private function checkAndCancelOverdueBookings()
    {
        $overdueBookings = Booking::where('status', 'pending')
            ->where('start_time', '<=', now()->subMinutes(15))
            ->get();

        foreach ($overdueBookings as $booking) {
            $booking->update(['status' => 'cancelled']);
        }
    }

    public function endEarly(Request $request, Booking $booking)
    {
        \Log::info('End Early Request received', [
            'booking_id' => $booking->id,
            'has_file' => $request->hasFile('image_end'),
            'files' => $request->allFiles(),
            'all_data' => $request->all(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
        ]);

        try {
            if (!$request->hasFile('image_end')) {
                throw new \Exception('No image file received');
            }

            $request->validate([
                'image_end' => 'required|image|max:5120'
            ]);

            $imagePath = $request->file('image_end')->store('booking-images', 'public');

            \Log::info('Image stored at: ' . $imagePath);

            $result = $booking->update([
                'url_image_end' => $imagePath,
                'status' => 'finished',
                'end_time' => now()
            ]);

            \Log::info('Update result', ['success' => $result, 'booking' => $booking->fresh()]);

            return response()->json([
                'success' => true,
                'message' => 'Booking ended successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in endEarly:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to end booking: ' . $e->getMessage()
            ], 422);
        }
    }
}
