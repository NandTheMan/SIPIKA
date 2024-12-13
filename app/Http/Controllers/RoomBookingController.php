<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Booking;
use App\Models\User;
use App\Http\Helpers\SKSHelper;
use App\Http\Middleware\ValidateBookingTime;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class RoomBookingController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

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
                        'facilities' => $classroom->facilities->pluck('facility_name'),
                        'floor' => $classroom->floor
                    ];
                });
            });

        return Inertia::render('BookingPage', [
            'userName' => $currentUser->username,
            'userMajor' => $currentUser->major,
            'classroomsByFloor' => $classroomsByFloor
        ]);
    }

    public function showDetails(Request $request)
    {
        $request->validate([
            'roomId' => 'required|exists:classrooms,classroom_id',
            'date' => 'required|date',
            'startTime' => 'required|date_format:H:i',
        ]);

        $classroom = Classroom::with('facilities')->findOrFail($request->roomId);
        $date = Carbon::parse($request->date);

        $bookingData = [
            'roomId' => $classroom->classroom_id,
            'roomName' => $classroom->classroom_name,
            'date' => $request->date,
            'formattedDate' => $date->isoFormat('dddd, D MMMM Y'),
            'startTime' => $request->startTime,
            'capacity' => $classroom->classroom_capacity,
            'facilities' => $classroom->facilities->pluck('facility_name'),
        ];

        return Inertia::render('BookingPageDetails', [
            'bookingData' => $bookingData,
            'auth' => [
                'user' => $request->user() ? [
                    'username' => $request->user()->username,
                    'major' => $request->user()->major,
                ] : null,
            ],
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
        try {
            $request->validate([
                'roomId' => 'required|exists:classrooms,classroom_id',
                'date' => 'required|date',
                'time' => [
                    'required',
                    'date_format:H:i',
                    function ($attribute, $value, $fail) use ($request) {
                        $selectedDateTime = Carbon::parse($request->date . ' ' . $value);
                        $now = Carbon::now('Asia/Singapore');

                        if ($selectedDateTime->lt($now)) {
                            $fail('The selected time must be after the current time.');
                        }
                    },
                ]
            ]);

            $startDateTime = Carbon::parse($request->date . ' ' . $request->time);
            $endDateTime = SKSHelper::calculateEndTime($startDateTime, 2);

            // Check for existing bookings
            $existingBooking = Booking::where('classroom_id', $request->roomId)
                ->whereIn('status', ['pending', 'in_progress'])
                ->where(function($query) use ($startDateTime, $endDateTime) {
                    $query->where(function($q) use ($startDateTime, $endDateTime) {
                        $q->whereBetween('start_time', [$startDateTime, $endDateTime])
                            ->orWhereBetween('end_time', [$startDateTime, $endDateTime])
                            ->orWhere(function($innerQ) use ($startDateTime, $endDateTime) {
                                $innerQ->where('start_time', '<=', $startDateTime)
                                    ->where('end_time', '>=', $endDateTime);
                            });
                    });
                })
                ->first();

            \Log::info('Availability check', [
                'roomId' => $request->roomId,
                'startDateTime' => $startDateTime,
                'endDateTime' => $endDateTime,
                'existingBooking' => $existingBooking ? true : false
            ]);

            return response()->json([
                'isAvailable' => !$existingBooking,
                'debug' => [
                    'startDateTime' => $startDateTime->format('Y-m-d H:i:s'),
                    'endDateTime' => $endDateTime->format('Y-m-d H:i:s'),
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in checkAvailability: ' . $e->getMessage());
            return response()->json([
                'isAvailable' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showCheckOut(Booking $booking)
    {
        // Check if user is authorized to view checkout page
        $this->authorize('update', $booking);

        if ($booking->status !== 'in_progress') {
            return redirect()->route('bookings.show', $booking)
                ->withErrors(['error' => 'This booking cannot be checked out.']);
        }

        $startPhoto = $booking->url_image_start
            ? Storage::url($booking->url_image_start)
            : null;

        return Inertia::render('BookingCheckOut', [
            'booking' => [
                'id' => $booking->booking_id,
                'classroom' => $booking->classroom->classroom_name,
                'date' => $booking->start_time->format('Y-m-d'),
                'startTime' => $booking->start_time->format('H:i'),
                'endTime' => $booking->end_time->format('H:i'),
                'duration' => $booking->sks_duration,
                'status' => $booking->status,
                'startPhoto' => $startPhoto,
                'isEndTimeReached' => Carbon::now('Asia/Singapore')->gte($booking->end_time)
            ]
        ]);
    }

    public function processCheckOut(Request $request, Booking $booking)
    {
        // Check if user is authorized to check out this booking
        $this->authorize('update', $booking);

        if ($booking->status !== 'in_progress') {
            return back()->withErrors(['error' => 'This booking cannot be checked out.']);
        }

        $request->validate([
            'image_end' => 'required|image|max:5120'
        ]);

        try {
            $imagePath = $request->file('image_end')->store('booking-images', 'public');

            $booking->update([
                'url_image_end' => $imagePath,
                'status' => 'finished',
                'end_time' => Carbon::now('Asia/Singapore')
            ]);

            return redirect()->route('home')
                ->with('success', 'Booking completed successfully');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to process check-out: ' . $e->getMessage()]);
        }
    }

    public function showCheckIn(Booking $booking)
    {
        $now = Carbon::now('Asia/Singapore');
        $startTime = Carbon::parse($booking->start_time)->timezone('Asia/Singapore');
        $earliestCheckIn = $startTime->copy()->subMinutes(15);
        $latestCheckIn = $startTime->copy()->addMinutes(15);

        // Calculate minutes until earliest check-in time
        $minutesUntilStart = $now->lt($earliestCheckIn)
            ? $now->diffInMinutes($earliestCheckIn)
            : 0;

        // Check if we can start check-in
        $canStart = $now->between($earliestCheckIn, $latestCheckIn);

        return Inertia::render('BookingCheckIn', [
            'booking' => [
                'id' => $booking->booking_id,
                'classroom' => $booking->classroom->classroom_name,
                'date' => $booking->start_time->format('Y-m-d'),
                'startTime' => $booking->start_time->format('H:i'),
                'endTime' => $booking->end_time->format('H:i'),
                'duration' => $booking->sks_duration,
                'checkInWindow' => [
                    'earliest' => $earliestCheckIn->format('H:i'),
                    'latest' => $latestCheckIn->format('H:i'),
                ],
                'currentTime' => $now->format('H:i'),
                'canStart' => $canStart,
                'minutesUntilStart' => $minutesUntilStart,
                'status' => $booking->status
            ]
        ]);
    }

    public function processCheckIn(Request $request, Booking $booking)
    {
        $request->validate([
            'image_start' => 'required|image|max:5120'
        ]);

        try {
            $imagePath = $request->file('image_start')->store('booking-images', 'public');

            $booking->update([
                'url_image_start' => $imagePath,
                'status' => 'in_progress'
            ]);

            return redirect()->route('booking.check-out', $booking)
                ->with('success', 'Check-in successful. You can now start using the classroom.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to process check-in: ' . $e->getMessage()]);
        }
    }
    public function createBooking(Request $request)
    {
        $request->validate([
            'roomId' => 'required|exists:classrooms,classroom_id',
            'date' => 'required|date',
            'startTime' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:1|max:6',
            'description' => 'required|string'
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

            return redirect()->route('booking.confirmation', ['booking' => $booking->booking_id]);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create booking: ' . $e->getMessage()]);
        }
    }

    public function showConfirmation(Booking $booking)
    {
        $earliestCheckIn = Carbon::parse($booking->start_time)->subMinutes(15);
        $latestCheckIn = Carbon::parse($booking->start_time)->addMinutes(15);

        return Inertia::render('BookingConfirmation', [
            'booking' => [
                'id' => $booking->booking_id,
                'classroom' => $booking->classroom->classroom_name,
                'date' => $booking->start_time->format('Y-m-d'),
                'startTime' => $booking->start_time->format('H:i'),
                'endTime' => $booking->end_time->format('H:i'),
                'duration' => $booking->sks_duration,
                'status' => $booking->status,
                'checkInWindow' => [
                    'earliest' => $earliestCheckIn->format('H:i'),
                    'latest' => $latestCheckIn->format('H:i')
                ]
            ]
        ]);
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
