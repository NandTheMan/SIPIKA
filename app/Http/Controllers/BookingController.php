<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Classroom;
use App\Models\User;
use App\Http\Helpers\SKSHelper;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingController extends Controller
{
    private function getCurrentUser()
    {
        return auth()->user();
    }
    public function selectDateTime()
    {
        return view('bookings.select-datetime', [
            'sksDurations' => SKSHelper::getValidSKSDurations()
        ]);
    }

    public function storeDateTime(Request $request)
    {
        $now = Carbon::now('Asia/Singapore');

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) use ($request, $now) {
                    $selectedDateTime = Carbon::parse($request->date . ' ' . $value);
                    if ($selectedDateTime->lt($now)) {
                        $fail('The selected time must be later than the current time.');
                    }
                },
            ],
            'sks_duration' => 'required|integer|min:1|max:6'
        ]);

        $startDateTime = Carbon::parse($validated['date'] . ' ' . $validated['start_time']);
        $endDateTime = SKSHelper::calculateEndTime($startDateTime, $validated['sks_duration']);

        session([
            'booking_date' => $validated['date'],
            'booking_start_time' => $validated['start_time'],
            'booking_end_time' => $endDateTime->format('H:i'),
            'booking_sks_duration' => $validated['sks_duration']
        ]);

        return redirect()->route('bookings.create');
    }

    public function create(Request $request)
    {
        if (!session('booking_date') || !session('booking_start_time') || !session('booking_end_time')) {
            return redirect()->route('bookings.select-datetime')
                ->withErrors(['time' => 'Please select date and time first']);
        }

        $startDateTime = Carbon::parse(session('booking_date') . ' ' . session('booking_start_time'));
        $endDateTime = Carbon::parse(session('booking_date') . ' ' . session('booking_end_time'));

        // Get unavailable classrooms using updated method
        $unavailableClassroomIds = $this->getUnavailableClassroomIds($startDateTime, $endDateTime);

        $classrooms = Classroom::with('facilities')
            ->whereNotIn('classroom_id', $unavailableClassroomIds)
            ->get();

        return view('bookings.create', [
            'classrooms' => $classrooms,
            'date' => session('booking_date'),
            'start_time' => session('booking_start_time'),
            'end_time' => session('booking_end_time')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,classroom_id',
            'user_size' => 'required|integer|min:1'
        ]);

        try {
            if (!session('booking_date') || !session('booking_start_time') ||
                !session('booking_end_time') || !session('booking_sks_duration')) {
                return redirect()->route('bookings.select-datetime')
                    ->withErrors(['time' => 'Please select date and time first']);
            }

            $startDateTime = Carbon::parse(session('booking_date') . ' ' . session('booking_start_time'));
            $endDateTime = Carbon::parse(session('booking_date') . ' ' . session('booking_end_time'));
            $sksDuration = session('booking_sks_duration');

            $currentUser = auth()->user();

            // Check if classroom capacity is sufficient
            $classroom = Classroom::findOrFail($validated['classroom_id']);
            if ($classroom->classroom_capacity < $validated['user_size']) {
                return back()->withErrors(['error' => 'Selected classroom capacity is not sufficient for the specified number of people.']);
            }

            $booking = Booking::create([
                'user_id' => $currentUser->user_id,
                'classroom_id' => $validated['classroom_id'],
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'sks_duration' => $sksDuration,
                'status' => 'pending',
                'user_size' => $validated['user_size']
            ]);

            session()->forget([
                'booking_date',
                'booking_start_time',
                'booking_end_time',
                'booking_sks_duration'
            ]);

            return redirect()->route('bookings.start-photo', $booking);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating booking: ' . $e->getMessage()]);
        }
    }

    public function showStartPhoto(Booking $booking)
    {
        $booking = Booking::with(['classroom', 'user'])->findOrFail($booking->booking_id);

        if ($booking->status !== 'pending') {
            return redirect()->route('bookings.show', $booking);
        }

        // Set timezone to Asia/Singapore
        $now = Carbon::now('Asia/Singapore');
        $startTime = Carbon::parse($booking->start_time)->timezone('Asia/Singapore');
        $earliestStartTime = $startTime->copy()->subMinutes(15);
        $latestStartTime = $startTime->copy()->addMinutes(30);

        // Calculate minutes until earliest start time
        $minutesUntilStart = $now->lt($earliestStartTime)
            ? $now->diffInMinutes($earliestStartTime)
            : 0;

        // Can start if current time is between earliest and latest start times
        $canStart = $now->between($earliestStartTime, $latestStartTime);

        return view('bookings.start-photo', [
            'booking' => $booking,
            'canStart' => $canStart,
            'minutesUntilStart' => $minutesUntilStart,
            'earliestStartTime' => $earliestStartTime,
            'latestStartTime' => $latestStartTime,
            'now' => $now
        ]);
    }

    public function uploadStartPhoto(Request $request, Booking $booking)
    {
        // Verify timing
        $now = Carbon::now('Asia/Singapore');
        $startTime = Carbon::parse($booking->start_time)->timezone('Asia/Singapore');
        $earliestStart = $startTime->copy()->subMinutes(15);
        $latestStart = $startTime->copy()->addMinutes(15);

        if ($now->lt($earliestStart)) {
            return back()->withErrors(['error' => 'Cannot start booking more than 15 minutes before scheduled time.']);
        }

        if ($now->gt($latestStart)) {
            $booking->update(['status' => 'cancelled']);
            return redirect()->route('bookings.show', $booking)
                ->withErrors(['error' => 'Booking automatically cancelled as it is more than 15 minutes past start time.']);
        }

        $request->validate([
            'image_start' => 'required|image|max:5120'
        ]);

        $imagePath = $request->file('image_start')->store('booking-images', 'public');

        $booking->update([
            'url_image_start' => $imagePath,
            'status' => 'in_progress'
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking started successfully');
    }

    public function endEarly(Request $request, Booking $booking)
    {
        if ($booking->status !== 'in_progress') {
            return back()->withErrors(['error' => 'Only in-progress bookings can be ended early.']);
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

            return redirect()->route('bookings.show', $booking)
                ->with('success', 'Booking ended early successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to end booking: ' . $e->getMessage()]);
        }
    }

    private function checkAndCancelOverdueBookings()
    {
        $now = Carbon::now('Asia/Singapore');

        // Find pending bookings that are more than 15 minutes past start time
        $overdueBookings = Booking::where('status', 'pending')
            ->where('start_time', '<=', $now->copy()->subMinutes(15))
            ->get();

        foreach ($overdueBookings as $booking) {
            $booking->update(['status' => 'cancelled']);
        }
    }

    public function show(Booking $booking)
    {
        // Check and cancel overdue bookings before showing details
        $this->checkAndCancelOverdueBookings();

        return view('bookings.show', [
            'booking' => $booking->load(['classroom.facilities', 'user'])
        ]);
    }

    public function index()
    {
        $this->checkAndCancelOverdueBookings();

        $currentUser = auth()->user();

        $bookings = Booking::with(['classroom', 'user'])
            ->where('user_id', $currentUser->user_id)
            ->orderBy('start_time')
            ->get();

        return view('bookings.index', compact('bookings'));
    }

    public function uploadEndPhoto(Request $request, Booking $booking)
    {
        $request->validate([
            'image_end' => 'required|image|max:5120'
        ]);

        $imagePath = $request->file('image_end')->store('booking-images', 'public');

        $booking->update([
            'url_image_end' => $imagePath,
            'status' => 'finished'
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking completed successfully');
    }

    public function cancel(Booking $booking)
    {
        // Check if booking can be cancelled
        if (in_array($booking->status, ['in_progress', 'finished'])) {
            return back()->withErrors(['error' => 'Cannot cancel a booking that is in progress or finished.']);
        }

        try {
            $booking->update([
                'status' => 'cancelled'
            ]);

            return redirect()->route('bookings.index')
                ->with('success', 'Booking cancelled successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to cancel booking. ' . $e->getMessage()]);
        }
    }

    public function quickBook()
    {
        $user = $this->getCurrentUser();

        return view('bookings.quick-book', [
            'user' => $user,
            'sksDurations' => SKSHelper::getValidSKSDurations()
        ]);
    }

    public function storeQuickBook(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'sks_duration' => 'required|integer|min:1|max:6'
        ]);

        $startDateTime = Carbon::parse($validated['date'] . ' ' . $validated['start_time']);
        $endDateTime = SKSHelper::calculateEndTime($startDateTime, $validated['sks_duration']);

        $user = $this->getCurrentUser();

        // Get unavailable classrooms
        $unavailableClassroomIds = $this->getUnavailableClassroomIds($startDateTime, $endDateTime);

        // Find suitable classroom based on class size
        $classroom = Classroom::whereNotIn('classroom_id', $unavailableClassroomIds)
            ->where('classroom_capacity', '>=', $user->user_size)
            ->orderBy('classroom_capacity')
            ->first();

        if (!$classroom) {
            return back()->withErrors([
                'error' => sprintf(
                    'No classrooms available that can accommodate your class size of %d students for the specified time.',
                    $user->user_size
                )
            ])->withInput();
        }

        try {
            // Create the booking - note we now include user_size
            $booking = Booking::create([
                'user_id' => $user->user_id,
                'classroom_id' => $classroom->classroom_id,
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'sks_duration' => $validated['sks_duration'],
                'status' => 'pending',
                'user_size' => $user->user_size  // Add this line
            ]);

            return redirect()->route('bookings.start-photo', $booking)
                ->with('success', sprintf(
                    'Classroom %s (capacity: %d) has been assigned for your class of %d students.',
                    $classroom->classroom_name,
                    $classroom->classroom_capacity,
                    $user->user_size
                ));

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error creating booking: ' . $e->getMessage()]);
        }
    }

    private function getUnavailableClassroomIds($startDateTime, $endDateTime)
    {
        return Booking::where(function($query) use ($startDateTime, $endDateTime) {
            $query->whereBetween('start_time', [$startDateTime, $endDateTime])
                ->orWhereBetween('end_time', [$startDateTime, $endDateTime])
                ->orWhere(function($q) use ($startDateTime, $endDateTime) {
                    $q->where('start_time', '<=', $startDateTime)
                        ->where('end_time', '>=', $endDateTime);
                });
        })
            ->whereIn('status', ['pending', 'in_progress'])
            ->pluck('classroom_id');
    }
}
