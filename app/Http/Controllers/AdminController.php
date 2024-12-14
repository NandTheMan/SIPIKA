<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index()
    {
        // Check if user is admin

        if (!auth()->check()) {
            dd("Not authenticated!");
        }

        if (!auth()->user()->roles->contains('role_name', 'Admin')) {
            dd("Not an admin user!", auth()->user()->roles);
        }

        if (!Auth::user()->roles->contains('role_name', 'Admin')) {
            return redirect()->route('home')->with('error', 'Unauthorized access');
        }

        // Get all users with their roles
        $users = User::with('roles')->get()->map(function($user) {
            return [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'email' => $user->email,
                'major' => $user->major,
                'is_penalized' => $user->is_penalized,
                'roles' => $user->roles->pluck('role_name')
            ];
        });

        // Get all reports with relationships
        $reports = Report::with(['reportedUser', 'reporterUser', 'classroom'])
            ->orderBy('report_time', 'desc')
            ->get()
            ->map(function($report) {
                return [
                    'report_id' => $report->report_id,
                    'reportedUser' => [
                        'username' => $report->reportedUser->username,
                        'major' => $report->reportedUser->major
                    ],
                    'reporterUser' => [
                        'username' => $report->reporterUser->username,
                        'major' => $report->reporterUser->major
                    ],
                    'classroom' => [
                        'classroom_name' => $report->classroom->classroom_name
                    ],
                    'description' => $report->report_description,
                    'status' => $report->report_status,
                    'report_time' => $report->report_time->format('Y-m-d H:i'),
                    'url_image_report' => $report->url_image_report
                ];
            });

        return Inertia::render('AdminDashboard', [
            'users' => $users,
            'reports' => $reports,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function penalizeUser(User $user)
    {
        // Toggle penalized status
        $user->update([
            'is_penalized' => !$user->is_penalized
        ]);

        return back()->with('success', 'User status updated successfully');
    }

    public function resolveReport(Report $report)
    {
        // Update report status and resolved time
        $report->update([
            'report_status' => true,
            'report_resolved_time' => now()
        ]);

        // Optionally penalize the reported user
        if ($report->reportedUser) {
            $report->reportedUser->update([
                'is_penalized' => true
            ]);
        }

        return back()->with('success', 'Report resolved successfully');
    }
}
