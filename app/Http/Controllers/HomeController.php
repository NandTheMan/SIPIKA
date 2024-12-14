<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Report;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        // Get today's bookings
        $todayBookings = Booking::with(['user', 'classroom'])
            ->whereDate('start_time', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->orderBy('start_time')
            ->get()
            ->map(function ($booking) {
                return [
                    'ruang' => $booking->classroom->classroom_name,
                    'peminjam' => $booking->user->username . " (" . $booking->user->major . ")",
                    'waktu' => $booking->start_time->format('H:i') . ' - ' . $booking->end_time->format('H:i'),
                    'id' => $booking->booking_id
                ];
            });

        // Get recent reports
        $recentReports = Report::with(['reportedUser', 'reporterUser', 'classroom'])
            ->orderBy('report_time', 'desc')
            ->take(6)  // Get more reports for the carousel
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->report_id,
                    'reportedBy' => $report->reporterUser->username,
                    'reportedByMajor' => $report->reporterUser->major,
                    'reportedUser' => $report->reportedUser->username,
                    'reportedUserMajor' => $report->reportedUser->major,
                    'classroom' => $report->classroom->classroom_name,
                    'time' => $report->report_time->format('d M Y, H:i'),
                    'description' => $report->report_description,
                    'status' => $report->report_status,
                    'image' => $report->url_image_report
                ];
            });

        // Get classrooms by floor with current booking status
        $classroomsByFloor = [];
        for ($floor = 1; $floor <= 4; $floor++) {
            $classrooms = Classroom::where('floor', $floor)
                ->with(['facilities', 'bookings' => function($query) {
                    $query->whereIn('status', ['pending', 'in_progress'])
                        ->where('start_time', '<=', now())
                        ->where('end_time', '>=', now());
                }])
                ->get()
                ->map(function ($classroom) {
                    $currentBooking = $classroom->bookings->first();

                    return [
                        'id' => $classroom->classroom_id,
                        'name' => $classroom->classroom_name,
                        'capacity' => $classroom->classroom_capacity,
                        'isBooked' => (bool)$currentBooking,
                        'facilities' => $classroom->facilities->map(fn($f) => $f->facility_name),
                        'currentBooking' => $currentBooking ? [
                            'endTime' => $currentBooking->end_time->format('H:i'),
                            'userCount' => $currentBooking->user_size
                        ] : null
                    ];
                });

            $classroomsByFloor[$floor] = $classrooms;
        }

        return Inertia::render('Homepage', [
            'bookingData' => $todayBookings,
            'reportData' => $recentReports, // Pass the reports data
            'userName' => $currentUser->username,
            'userMajor' => $currentUser->major,
            'classroomsByFloor' => $classroomsByFloor,
            'canBookRoom' => !$currentUser->is_penalized,
        ]);
    }

    public function viewReport($id)
    {
        $report = Report::with(['reportedUser', 'reporterUser', 'classroom'])
            ->findOrFail($id);

        return Inertia::render('ReportView', [
            'report' => [
                'id' => $report->report_id,
                'classroom' => $report->classroom->classroom_name,
                'reportTime' => $report->report_time->format('M d, Y H:i'),
                'reportedUser' => $report->reportedUser->username,
                'reporter' => $report->reporterUser->username,
                'description' => $report->report_description,
                'status' => $report->report_status,
                'resolvedTime' => $report->report_resolved_time ?
                    $report->report_resolved_time->format('M d, Y H:i') : null,
                'imageUrl' => $report->url_image_report ?
                    Storage::url($report->url_image_report) : null
            ]
        ]);
    }

    public function getFloorDetails($floor)
    {
        $classrooms = Classroom::where('floor', $floor)
            ->with(['facilities', 'bookings' => function($query) {
                $query->whereIn('status', ['pending', 'in_progress'])
                    ->where('start_time', '<=', now())
                    ->where('end_time', '>=', now());
            }])
            ->get()
            ->map(function ($classroom) {
                $activeBooking = $classroom->bookings->first();

                return [
                    'id' => $classroom->classroom_id,
                    'name' => $classroom->classroom_name,
                    'capacity' => $classroom->classroom_capacity,
                    'isBooked' => (bool)$activeBooking,
                    'facilities' => $classroom->facilities->map(fn($f) => $f->facility_name),
                    'currentBooking' => $activeBooking ? [
                        'endTime' => $activeBooking->end_time->format('H:i'),
                        'userCount' => $activeBooking->user_size
                    ] : null
                ];
            });

        return response()->json($classrooms);
    }

    public function dashboard()
    {
        $user = auth()->user();

        // Get user's active bookings
        $activeBookings = Booking::with('classroom')
            ->where('user_id', $user->user_id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->orderBy('start_time')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->booking_id,
                    'room' => $booking->classroom->classroom_name,
                    'date' => $booking->start_time->format('Y-m-d'),
                    'startTime' => $booking->start_time->format('H:i'),
                    'endTime' => $booking->end_time->format('H:i'),
                    'status' => $booking->status
                ];
            });

        // Get user's booking history
        $bookingHistory = Booking::with('classroom')
            ->where('user_id', $user->user_id)
            ->whereIn('status', ['finished', 'cancelled'])
            ->orderBy('start_time', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->booking_id,
                    'room' => $booking->classroom->classroom_name,
                    'date' => $booking->start_time->format('Y-m-d'),
                    'startTime' => $booking->start_time->format('H:i'),
                    'endTime' => $booking->end_time->format('H:i'),
                    'status' => $booking->status
                ];
            });

        // Get user's reports
        $userReports = Report::with(['classroom', 'reportedUser'])
            ->where('reporter_user_id', $user->user_id)
            ->orderBy('report_time', 'desc')
            ->take(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->report_id,
                    'room' => $report->classroom->classroom_name,
                    'date' => $report->report_time->format('Y-m-d'),
                    'status' => $report->report_status,
                    'description' => $report->report_description
                ];
            });

        return Inertia::render('Dashboard', [
            'activeBookings' => $activeBookings,
            'bookingHistory' => $bookingHistory,
            'userReports' => $userReports,
            'userName' => $user->username,
            'userMajor' => $user->major,
            'isPenalized' => $user->is_penalized
        ]);
    }
}
