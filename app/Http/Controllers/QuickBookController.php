<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Classroom;
use App\Http\Helpers\SKSHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class QuickBookController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Format SKS durations
        $sksDurations = collect(SKSHelper::getValidSKSDurations())->map(function($sks) {
            return [
                'value' => (string)$sks,
                'label' => SKSHelper::formatDuration($sks)
            ];
        });

        return Inertia::render('QuickBook', [
            'userInfo' => [
                'class_size' => $user->user_size,
                'major' => $user->major,
                'year' => $user->year,
                'is_penalized' => $user->is_penalized
            ],
            'sksDurations' => $sksDurations,
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'major' => $user->major
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) use ($request) {
                    $selectedDateTime = Carbon::parse($request->date . ' ' . $value);
                    if ($selectedDateTime->lt(now())) {
                        $fail('The selected time must be after the current time.');
                    }
                },
            ],
            'sks_duration' => 'required|integer|min:1|max:6'
        ]);

        try {
            $user = auth()->user();

            if ($user->is_penalized) {
                return back()->withErrors(['error' => 'Your account is currently penalized.']);
            }

            $startDateTime = Carbon::parse($validated['date'] . ' ' . $validated['start_time']);
            $endDateTime = SKSHelper::calculateEndTime($startDateTime, $validated['sks_duration']);

            // Get unavailable classroom IDs
            $unavailableClassroomIds = Booking::where(function($query) use ($startDateTime, $endDateTime) {
                $query->whereBetween('start_time', [$startDateTime, $endDateTime])
                    ->orWhereBetween('end_time', [$startDateTime, $endDateTime])
                    ->orWhere(function($q) use ($startDateTime, $endDateTime) {
                        $q->where('start_time', '<=', $startDateTime)
                            ->where('end_time', '>=', $endDateTime);
                    });
            })
                ->whereIn('status', ['pending', 'in_progress'])
                ->pluck('classroom_id');

            // Find suitable classroom
            $classroom = Classroom::whereNotIn('classroom_id', $unavailableClassroomIds)
                ->where('classroom_capacity', '>=', $user->user_size)
                ->orderBy('classroom_capacity')
                ->first();

            if (!$classroom) {
                return back()->withErrors([
                    'error' => 'No suitable classrooms available for the specified time and class size.'
                ]);
            }

            // Create booking
            $booking = Booking::create([
                'user_id' => $user->user_id,
                'classroom_id' => $classroom->classroom_id,
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'sks_duration' => $validated['sks_duration'],
                'status' => 'pending',
                'user_size' => $user->user_size
            ]);

            return response()->json([
                'booking_id' => $booking->booking_id,
                'message' => 'Booking created successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create booking: ' . $e->getMessage()
            ], 500);
        }
    }
}
