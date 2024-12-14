<?php

namespace App\Http\Controllers;

use App\Models\PinnedClassroom;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PinController extends Controller
{
    public function getPinnedClassrooms()
    {
        $user = auth()->user();
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

        return response()->json($pinnedClassrooms);
    }

    public function pinClassroom(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,classroom_id'
        ]);

        $user = auth()->user();

        // Check if already pinned
        $existing = PinnedClassroom::where('user_id', $user->user_id)
            ->where('classroom_id', $validated['classroom_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Classroom already pinned']);
        }

        // Create new pin
        PinnedClassroom::create([
            'user_id' => $user->user_id,
            'classroom_id' => $validated['classroom_id']
        ]);

        return response()->json(['message' => 'Classroom pinned successfully']);
    }

    public function unpinClassroom(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,classroom_id'
        ]);

        $user = auth()->user();

        PinnedClassroom::where('user_id', $user->user_id)
            ->where('classroom_id', $validated['classroom_id'])
            ->delete();

        return response()->json(['message' => 'Classroom unpinned successfully']);
    }
}
