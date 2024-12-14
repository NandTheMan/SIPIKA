<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ClassroomOverviewController extends Controller
{
    public function index()
    {
        // Get all classrooms grouped by floor with their facilities
        $classroomsByFloor = Classroom::with('facilities')
            ->orderBy('floor')
            ->orderBy('classroom_name')
            ->get()
            ->groupBy('floor')
            ->map(function ($classrooms) {
                return $classrooms->map(function ($classroom) {
                    return [
                        'id' => $classroom->classroom_id,
                        'name' => $classroom->classroom_name,
                        'capacity' => $classroom->classroom_capacity,
                        'floor' => $classroom->floor,
                        'facilities' => $classroom->facilities->pluck('facility_name'),
                    ];
                });
            });

        // Get current active bookings
        $currentBookings = Booking::with(['user', 'classroom'])
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->get()
            ->map(function ($booking) {
                return [
                    'booking_id' => $booking->booking_id,
                    'classroom_id' => $booking->classroom_id,
                    'user_name' => $booking->user->username,
                    'user_major' => $booking->user->major,
                    'start_time' => $booking->start_time->format('H:i'),
                    'end_time' => $booking->end_time->format('H:i'),
                    'duration' => $booking->sks_duration,
                    'user_size' => $booking->user_size,
                    'status' => $booking->status
                ];
            });

        return Inertia::render('ClassroomOverview', [
            'classroomsByFloor' => $classroomsByFloor,
            'currentBookings' => $currentBookings,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function getFacilities(Request $request)
    {
        $classroomId = $request->query('classroom_id');

        if ($classroomId) {
            $classroom = Classroom::with('facilities')->findOrFail($classroomId);
            $facilities = $classroom->facilities;
        } else {
            $facilities = \App\Models\Facility::all();
        }

        return response()->json($facilities);
    }

    public function getCurrentBooking($classroomId)
    {
        $booking = Booking::with(['user', 'classroom'])
            ->where('classroom_id', $classroomId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->first();

        if (!$booking) {
            return response()->json(null);
        }

        return response()->json([
            'booking_id' => $booking->booking_id,
            'user_name' => $booking->user->username,
            'user_major' => $booking->user->major,
            'start_time' => $booking->start_time->format('H:i'),
            'end_time' => $booking->end_time->format('H:i'),
            'duration' => $booking->sks_duration,
            'user_size' => $booking->user_size,
            'status' => $booking->status
        ]);
    }
}
