@extends('layouts.app')

@section('title', 'Select Time - Step 1')

@section('content')
<div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
    <div class="mb-6">
        <h2 class="text-2xl font-bold">Book a Classroom - Step 1</h2>
        <p class="text-gray-600">Select date and time for your booking</p>
    </div>

    <form action="{{ route('bookings.store-datetime') }}" method="POST" class="space-y-4">
        @csrf
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="date" class="block text-sm font-medium mb-1">Date</label>
                <input type="date" 
                       id="date" 
                       name="date" 
                       value="{{ old('date', now()->format('Y-m-d')) }}"
                       min="{{ now()->format('Y-m-d') }}"
                       class="w-full rounded border-gray-300" 
                       required>
            </div>

            <div>
                <label for="start_time" class="block text-sm font-medium mb-1">Start Time</label>
                <input type="time" 
                       id="start_time" 
                       name="start_time" 
                       value="{{ old('start_time', now()->format('H:i')) }}"
                       class="w-full rounded border-gray-300" 
                       required>
                <p class="text-sm text-gray-500">Format: 00:00 - 23:59</p>
            </div>

            <div>
                <label for="sks_duration" class="block text-sm font-medium mb-1">Duration (SKS)</label>
                <select id="sks_duration" 
                        name="sks_duration" 
                        class="w-full rounded border-gray-300" 
                        required>
                        @foreach($sksDurations as $sks)
                            <option value="{{ $sks }}" {{ old('sks_duration') == $sks ? 'selected' : '' }}>
                                {{ App\Http\Helpers\SKSHelper::formatDuration($sks) }}
                            </option>
                        @endforeach
                </select>
                <p class="text-sm text-gray-500">1 SKS = 40 minutes</p>
            </div>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
            <p class="text-blue-700">
                <strong>Duration Guide:</strong>
            </p>
            <ul class="list-disc list-inside text-blue-700 mt-2">
                <li>1 SKS = 40 minutes</li>
                <li>Maximum duration: 6 SKS (4 hours)</li>
                <li>The end time will be automatically calculated</li>
            </ul>
        </div>

        <div class="pt-4">
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Next Step
            </button>
        </div>
    </form>
</div>
@endsection