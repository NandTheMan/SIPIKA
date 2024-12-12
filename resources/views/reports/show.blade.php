@extends('layouts.app')

@section('title', 'Report Details')

@section('content')
<div class="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Report Details</h2>
        <a href="{{ route('reports.index') }}" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Reports
        </a>
    </div>

    <div class="space-y-6">
        <!-- Status Banner -->
        <div class="p-4 rounded-lg {{ $report->report_status ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500' }} border">
            <p class="font-medium {{ $report->report_status ? 'text-green-700' : 'text-yellow-700' }}">
                Status: {{ $report->report_status ? 'Resolved' : 'Under Review' }}
                @if($report->report_status)
                    (Resolved on {{ $report->report_resolved_time->format('M d, Y H:i') }})
                @endif
            </p>
        </div>

        <!-- Report Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 class="font-semibold text-lg mb-2">Classroom</h3>
                <p class="p-3 bg-gray-50 rounded">{{ $report->classroom->classroom_name }}</p>
            </div>

            <div>
                <h3 class="font-semibold text-lg mb-2">Report Time</h3>
                <p class="p-3 bg-gray-50 rounded">{{ $report->report_time->format('M d, Y H:i') }}</p>
            </div>
        </div>

        <!-- Description -->
        <div>
            <h3 class="font-semibold text-lg mb-2">Description</h3>
            <div class="p-4 bg-gray-50 rounded">
                {{ $report->report_description }}
            </div>
        </div>

        <!-- Evidence Image -->
        <div>
            <h3 class="font-semibold text-lg mb-2">Evidence Photo</h3>
            <div class="mt-2">
                <img src="{{ Storage::url($report->url_image_report) }}" 
                     alt="Report Evidence" 
                     class="max-w-2xl rounded-lg shadow">
            </div>
        </div>
    </div>
</div>
@endsection