<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Helpers\SKSHelper;

class RoomBookingController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        // Get all classrooms grouped by floor with proper format for React
        $classrooms = Classroom::with('facilities')
            ->orderBy('floor')
            ->orderBy('classroom_name')
            ->get();

        $classroomsByFloor = $classrooms->groupBy('floor')
            ->map(function ($floorClassrooms) {
                return $floorClassrooms->map(function ($classroom) {
                    $currentBooking = $this->getCurrentBooking($classroom);

                    return [
                        'id' => $classroom->classroom_id,
                        'name' => $classroom->classroom_name,
                        'capacity' => $classroom->classroom_capacity,
                        'facilities' => $classroom->facilities->pluck('facility_name'),
                        'isBooked' => (bool)$currentBooking,
                        'currentBooking' => $currentBooking ? [
                            'endTime' => $currentBooking->end_time->format('H:i'),
                            'userCount' => $currentBooking->user_size
                        ] : null
                    ];
                });
            });

        return Inertia::render('BookingPage', [
            'userName' => $currentUser->username,
            'userMajor' => $currentUser->major,
            'classroomsByFloor' => $classroomsByFloor
        ]);
    }

    public function getRoomDetails($id)
    {
        $classroom = Classroom::with('facilities')->findOrFail($id);
        $currentBooking = $this->getCurrentBooking($classroom);

        return response()->json([
            'id' => $classroom->classroom_id,
            'name' => $classroom->classroom_name,
            'capacity' => $classroom->classroom_capacity,
            'facilities' => $classroom->facilities->pluck('facility_name'),
            'isBooked' => (bool)$currentBooking,
            'currentBooking' => $currentBooking ? [
                'endTime' => $currentBooking->end_time->format('H:i'),
                'userCount' => $currentBooking->user_size
            ] : null
        ]);
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'roomId' => 'required|exists:classrooms,classroom_id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i'
        ]);

        $dateTime = Carbon::parse($request->date . ' ' . $request->time);

        // Check for existing bookings
        $existingBooking = Booking::where('classroom_id', $request->roomId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->where(function($query) use ($dateTime) {
                $query->where('start_time', '<=', $dateTime)
                    ->where('end_time', '>=', $dateTime);
            })
            ->exists();

        return response()->json([
            'isAvailable' => !$existingBooking
        ]);
    }

    public function createBooking(Request $request)
    {
        $request->validate([
            'roomId' => 'required|exists:classrooms,classroom_id',
            'date' => 'required|date',
            'startTime' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:1|max:6'
        ]);

        try {
            $startDateTime = Carbon::parse($request->date . ' ' . $request->startTime);
            $endDateTime = SKSHelper::calculateEndTime($startDateTime, $request->duration);

            $booking = Booking::create([
                'user_id' => auth()->id(),
                'classroom_id' => $request->roomId,
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'sks_duration' => $request->duration,
                'status' => 'pending',
                'user_size' => auth()->user()->user_size
            ]);

            return response()->json([
                'success' => true,
                'booking' => $booking,
                'redirect' => route('bookings.start-photo', $booking)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getCurrentBooking($classroom)
    {
        return $classroom->bookings()
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->first();
    }

    public function getRoomsByFloor($floor)
    {
        $classrooms = Classroom::where('floor', $floor)
            ->with('facilities')
            ->get()
            ->map(function ($classroom) {
                $currentBooking = $this->getCurrentBooking($classroom);

                return [
                    'id' => $classroom->classroom_id,
                    'name' => $classroom->classroom_name,
                    'capacity' => $classroom->classroom_capacity,
                    'facilities' => $classroom->facilities->pluck('facility_name'),
                    'isBooked' => (bool)$currentBooking,
                    'currentBooking' => $currentBooking ? [
                        'endTime' => $currentBooking->end_time->format('H:i'),
                        'userCount' => $currentBooking->user_size
                    ] : null
                ];
            });

        return response()->json($classrooms);
    }
}
