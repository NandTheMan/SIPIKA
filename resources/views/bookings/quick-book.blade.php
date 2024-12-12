@extends('layouts.app')

@section('title', 'Quick Book')

@section('content')
    <div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold">Quick Book a Classroom</h2>
                <p class="text-gray-600 mt-1">Automatically find and book a suitable classroom for your class</p>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-500">Current Time</p>
                <p class="font-mono" id="currentTime"></p>
            </div>
        </div>

        {{-- Class Size Information Card --}}
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div class="flex items-start">
                <div class="flex-grow">
                    <h3 class="font-semibold text-blue-800">Your Class Information</h3>
                    <p class="text-blue-700">Class Size: {{ $user->user_size }} students</p>
                    <p class="text-blue-700">Major: {{ $user->major }}</p>
                    <p class="text-blue-700">Year: {{ $user->year }}</p>
                </div>
                @if($user->is_penalized)
                    <div class="bg-red-100 text-red-700 px-4 py-2 rounded">
                        <p class="font-semibold">Account Penalized</p>
                        <p class="text-sm">Some booking restrictions may apply</p>
                    </div>
                @endif
            </div>
        </div>

        <form action="{{ route('bookings.quick-store') }}" method="POST" class="space-y-6">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p class="text-sm text-gray-500 mt-1">24-hour format (e.g., 14:30)</p>
                </div>

                <div class="md:col-span-2">
                    <label for="sks_duration" class="block text-sm font-medium mb-1">Duration</label>
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
                </div>
            </div>

            {{-- Information Box --}}
            <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                <div class="border-b pb-4">
                    <h3 class="font-semibold text-gray-700">How Quick Book Works:</h3>
                    <ul class="mt-2 space-y-2 text-gray-600">
                        <li>• We'll automatically find a classroom that fits your class size ({{ $user->user_size }} students)</li>
                        <li>• Rooms are assigned based on best fit - you'll get the smallest suitable room available</li>
                        <li>• Only available rooms with sufficient capacity will be considered</li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-semibold text-gray-700">Booking Timeline:</h3>
                    <ul class="mt-2 space-y-2 text-gray-600">
                        <li>• You can check in 15 minutes before your booking time</li>
                        <li>• Late check-in (more than 15 minutes) will result in automatic cancellation</li>
                        <li>• 1 SKS = 40 minutes of booking time</li>
                    </ul>
                </div>
            </div>

            <div class="flex justify-between pt-4">
                <a href="{{ route('bookings.index') }}"
                   class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Bookings
                </a>
                <button type="submit"
                        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Find & Book Classroom
                </button>
            </div>
        </form>
    </div>

    <script>
        function updateCurrentTime() {
            const now = new Date();
            const singaporeTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

            document.getElementById('currentTime').textContent =
                singaporeTime.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Singapore'
                });
        }

        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    </script>
@endsection
