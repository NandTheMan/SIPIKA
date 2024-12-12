@extends('layouts.app')

@section('title', 'Reports')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Reports</h2>
        <a href="{{ route('reports.create') }}" 
           class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit New Report
        </a>
    </div>

    <div class="space-y-6">
        @forelse($reports as $report)
            <div class="border rounded-lg p-4 {{ $report->report_status ? 'bg-green-50' : 'bg-yellow-50' }}">
                <div class="flex justify-between items-start">
                    <div class="grid grid-cols-2 gap-4 flex-grow">
                        <div>
                            <h3 class="font-semibold">Classroom</h3>
                            <p>{{ $report->classroom->classroom_name }}</p>
                        </div>
                        <div>
                            <h3 class="font-semibold">Report Time</h3>
                            <p>{{ $report->report_time->format('M d, Y H:i') }}</p>
                        </div>
                        <div>
                            <h3 class="font-semibold">Status</h3>
                            <p class="{{ $report->report_status ? 'text-green-600' : 'text-yellow-600' }}">
                                {{ $report->report_status ? 'Resolved' : 'Under Review' }}
                            </p>
                        </div>
                        @if($report->report_status)
                            <div>
                                <h3 class="font-semibold">Resolved On</h3>
                                <p>{{ $report->report_resolved_time->format('M d, Y H:i') }}</p>
                            </div>
                        @endif
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <a href="{{ route('reports.show', $report) }}" 
                           class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            View Details
                        </a>
                    </div>
                </div>

                <div class="mt-4">
                    <h3 class="font-semibold">Description</h3>
                    <p class="mt-1">{{ Str::limit($report->report_description, 200) }}</p>
                </div>

                @if($report->url_image_report)
                    <div class="mt-4">
                        <img src="{{ Storage::url($report->url_image_report) }}" 
                             alt="Report Evidence" 
                             class="max-w-md rounded-lg">
                    </div>
                @endif
            </div>
        @empty
            <p class="text-gray-500 text-center py-8">No reports found.</p>
        @endforelse
    </div>
</div>
@endsection