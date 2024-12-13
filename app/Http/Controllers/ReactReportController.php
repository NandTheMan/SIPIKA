<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class ReactReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['reportedUser', 'reporterUser', 'classroom'])
            ->where('reporter_user_id', auth()->id())
            ->orderBy('report_time', 'desc')
            ->get()
            ->map(function ($report) {
                return [
                    'report_id' => $report->report_id,
                    'classroom' => [
                        'classroom_name' => $report->classroom->classroom_name
                    ],
                    'reporterUser' => [
                        'username' => $report->reporterUser->username
                    ],
                    'reportedUser' => [
                        'username' => $report->reportedUser->username
                    ],
                    'report_time' => $report->report_time->format('Y-m-d H:i'),
                    'report_description' => $report->report_description,
                    'report_status' => $report->report_status,
                    'url_image_report' => $report->url_image_report,
                    'report_resolved_time' => $report->report_resolved_time ?
                        $report->report_resolved_time->format('Y-m-d H:i') : null
                ];
            });

        return Inertia::render('ReportList', [
            'reports' => $reports
        ]);
    }

    public function create()
    {
        $classrooms = Classroom::with('facilities')
            ->orderBy('floor')
            ->orderBy('classroom_name')
            ->get()
            ->map(function ($classroom) {
                return [
                    'id' => $classroom->classroom_id,
                    'name' => $classroom->classroom_name,
                    'floor' => $classroom->floor,
                    'capacity' => $classroom->classroom_capacity,
                    'facilities' => $classroom->facilities->pluck('facility_name')
                ];
            });

        return Inertia::render('ReportPage', [
            'classrooms' => $classrooms,
            'auth' => [
                'user' => auth()->user() ? [
                    'username' => auth()->user()->username,
                    'major' => auth()->user()->major,
                ] : null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,classroom_id',
            'incident_date' => 'required|date|before_or_equal:today',
            'incident_time' => 'required|date_format:H:i',
            'report_description' => 'required|string|max:1000',
            'image' => 'required|image|max:2048'
        ]);

        try {
            $reportTime = Carbon::parse($validated['incident_date'] . ' ' . $validated['incident_time']);

            // Store the image in the public disk
            $imagePath = $request->file('image')->store('report-images', 'public');

            // Get reported user (optional - can be null if no booking found)
            $booking = \App\Models\Booking::where('classroom_id', $validated['classroom_id'])
                ->where('start_time', '<=', $reportTime)
                ->where('end_time', '>=', $reportTime)
                ->first();

            $reported_user_id = $booking ? $booking->user_id : auth()->id();

            Report::create([
                'reported_user_id' => $reported_user_id,
                'classroom_id' => $validated['classroom_id'],
                'reporter_user_id' => auth()->id(),
                'report_time' => $reportTime,
                'report_description' => $validated['report_description'],
                'report_status' => false,
                'url_image_report' => $imagePath
            ]);

            return redirect()->route('reports.index')->with('success', 'Report submitted successfully');

        } catch (\Exception $e) {
            if (isset($imagePath) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            return back()->withErrors(['error' => 'Failed to submit report: ' . $e->getMessage()]);
        }
    }


    public function show(Report $report)
    {
        $report->load(['reportedUser', 'reporterUser', 'classroom']);

        // Check if user is authorized to view this report
        if ($report->reporter_user_id !== auth()->id()) {
            abort(403);
        }

        $reportData = [
            'report_id' => $report->report_id,
            'classroom' => [
                'classroom_name' => $report->classroom->classroom_name
            ],
            'reporterUser' => [
                'username' => $report->reporterUser->username
            ],
            'reportedUser' => [
                'username' => $report->reportedUser->username
            ],
            'report_time' => $report->report_time->format('Y-m-d H:i'),
            'report_description' => $report->report_description,
            'report_status' => $report->report_status,
            'url_image_report' => $report->url_image_report,
            'report_resolved_time' => $report->report_resolved_time ?
                $report->report_resolved_time->format('Y-m-d H:i') : null
        ];

        return Inertia::render('ReportDetails', [
            'report' => $reportData
        ]);
    }
}
