<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Facility;
use App\Http\Helpers\SKSHelper;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $floors = Classroom::distinct()->pluck('floor')->sort();
        $currentUser = auth()->user(); // Get the authenticated user

        if (!$request->filled(['date', 'start_time', 'sks_duration'])) {
            return view('classrooms.index', [
                'floors' => $floors,
                'classrooms' => null,
                'currentUser' => $currentUser // Pass the current user to the view
            ]);
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => [
                'required',
                'date_format:H:i',
            ],
            'sks_duration' => 'required|integer|min:1|max:6',
            'floor' => 'nullable|integer'
        ]);

        $startDateTime = Carbon::parse($validated['date'] . ' ' . $validated['start_time']);
        $endDateTime = SKSHelper::calculateEndTime($startDateTime, $validated['sks_duration']);

        // Store the booking information in session
        session([
            'booking_date' => $validated['date'],
            'booking_start_time' => $validated['start_time'],
            'booking_end_time' => $endDateTime->format('H:i'),
            'booking_sks_duration' => $validated['sks_duration']
        ]);

        // Get unavailable classroom IDs for the selected time period
        $unavailableClassroomIds = \App\Models\Booking::where(function($query) use ($startDateTime, $endDateTime) {
            $query->whereBetween('start_time', [$startDateTime, $endDateTime])
                ->orWhereBetween('end_time', [$startDateTime, $endDateTime])
                ->orWhere(function($q) use ($startDateTime, $endDateTime) {
                    $q->where('start_time', '<=', $startDateTime)
                        ->where('end_time', '>=', $endDateTime);
                });
        })
            ->whereIn('status', ['pending', 'in_progress'])
            ->pluck('classroom_id');

        $query = Classroom::with('facilities');

        if ($request->filled('floor')) {
            $query->where('floor', $request->floor);
        }

        $classrooms = $query->whereNotIn('classroom_id', $unavailableClassroomIds)->get();

        return view('classrooms.index', [
            'classrooms' => $classrooms,
            'floors' => $floors,
            'selectedDate' => $validated['date'],
            'selectedStartTime' => $validated['start_time'],
            'endTime' => $endDateTime,
            'selectedFloor' => $request->floor,
            'currentUser' => $currentUser // Pass the current user to the view
        ]);
    }
}
