<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['reportedUser', 'reporterUser', 'classroom'])
            ->orderBy('report_time', 'desc')
            ->get();
            
        return view('reports.index', [
            'reports' => $reports
        ]);
    }

    public function create(Request $request)
    {
        $booking = null;
        if ($request->has('booking_id')) {
            $booking = Booking::with(['user', 'classroom'])->findOrFail($request->booking_id);
        }

        return view('reports.create', [
            'booking' => $booking
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
            // Combine incident date and time
            $reportTime = Carbon::parse($validated['incident_date'] . ' ' . $validated['incident_time']);
            
            // Store the image
            $imagePath = $request->file('image')->store('report-images', 'public');

            // For demo purposes, we'll get the first user
            // In a real application, this would be the user from the booking
            $reported_user = User::first();
            
            // Create the report
            Report::create([
                'reported_user_id' => $reported_user->user_id,
                'classroom_id' => $validated['classroom_id'],
                'reporter_user_id' => auth()->id() ?? 1, // Using test user if no auth
                'report_time' => $reportTime,
                'report_description' => $validated['report_description'],
                'report_status' => false,
                'url_image_report' => $imagePath
            ]);
    
            return redirect()->route('reports.index')
                ->with('success', 'Report submitted successfully');
        } catch (\Exception $e) {
            // If image was uploaded but report creation failed, remove the image
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            return back()->withErrors(['error' => 'Failed to submit report. ' . $e->getMessage()]);
        }
    }

    public function update(Report $report)
    {
        try {
            $report->update([
                'report_status' => true,
                'report_resolved_time' => now()
            ]);

            // Penalize the reported user
            $reportedUser = $report->reportedUser;
            $reportedUser->update([
                'is_penalized' => true
            ]);

            return redirect()->route('reports.index')
                ->with('success', 'Report marked as resolved successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to resolve report. ' . $e->getMessage()]);
        }
    }

    public function show(Report $report)
    {
        $report->load(['reportedUser', 'reporterUser', 'classroom']);
        return view('reports.show', compact('report'));
    }
}