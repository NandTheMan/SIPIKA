@extends('layouts.app')

@section('title', 'Classrooms')

@section('content')
    <div class="bg-white rounded-lg shadow p-6">
        <!-- Time Period Selection Form -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold mb-6">Select Time Period</h2>
            <form action="{{ route('classrooms.index') }}" method="GET" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Date</label>
                        <input type="date" name="date"
                               value="{{ request('date', now()->format('Y-m-d')) }}"
                               min="{{ now()->format('Y-m-d') }}"
                               class="w-full rounded border-gray-300" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Start Time</label>
                        <input type="time"
                               name="start_time"
                               value="{{ request('start_time', now()->format('H:i')) }}"
                               class="w-full rounded border-gray-300"
                               required>
                        <span class="text-gray-500 text-xs">Format: 00:00 - 23:59</span>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Duration (SKS)</label>
                        <select name="sks_duration"
                                class="w-full rounded border-gray-300"
                                required>
                            @foreach(App\Http\Helpers\SKSHelper::getValidSKSDurations() as $sks)
                                <option value="{{ $sks }}" {{ request('sks_duration') == $sks ? 'selected' : '' }}>
                                    {{ App\Http\Helpers\SKSHelper::formatDuration($sks) }}
                                </option>
                            @endforeach
                        </select>
                        <span class="text-gray-500 text-xs">1 SKS = 40 minutes</span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Floor (Optional)</label>
                    <select name="floor" class="w-full rounded border-gray-300">
                        <option value="">All Floors</option>
                        @foreach($floors as $floor)
                            <option value="{{ $floor }}" {{ request('floor') == $floor ? 'selected' : '' }}>
                                Floor {{ $floor }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Check Availability
                    </button>
                </div>
            </form>
        </div>

        <!-- Available Classrooms -->
        @if(isset($classrooms))
            <div class="mt-8">
                <h2 class="text-2xl font-bold mb-6">
                    Available Classrooms
                    @if(request('date'))
                        <span class="text-lg font-normal text-gray-600">
                            for {{ \Carbon\Carbon::parse(request('date'))->format('l, j F Y') }}<br>
                            {{ \Carbon\Carbon::createFromFormat('H:i', request('start_time'))->format('H:i') }} -
                            {{ $endTime->format('H:i') }}
                            ({{ App\Http\Helpers\SKSHelper::formatDuration(request('sks_duration')) }})
                        </span>
                    @endif
                </h2>

                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p class="text-blue-700">
                        Your class size: {{ $currentUser->user_size }} students
                    </p>
                </div>

                @if($classrooms->isEmpty())
                    <p class="text-gray-500 text-center py-8">No available classrooms found for the selected time period.</p>
                @else
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        @foreach($classrooms as $classroom)
                            <div class="border rounded-lg p-4 {{ $classroom->classroom_capacity < $currentUser->user_size ? 'bg-gray-100 opacity-50' : '' }}">
                                <h3 class="text-xl font-semibold">{{ $classroom->classroom_name }}</h3>
                                <p>Floor: {{ $classroom->floor }}</p>
                                <p>Capacity: {{ $classroom->classroom_capacity }}</p>
                                <div class="mt-2">
                                    <strong>Facilities:</strong>
                                    <div class="flex flex-wrap gap-2 mt-1">
                                        @foreach($classroom->facilities as $facility)
                                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                {{ $facility->facility_name }}
                                            </span>
                                        @endforeach
                                    </div>
                                </div>
                                <div class="mt-4">
                                    @if($classroom->classroom_capacity >= $currentUser->user_size)
                                        <form action="{{ route('bookings.store') }}" method="POST">
                                            @csrf
                                            <input type="hidden" name="classroom_id" value="{{ $classroom->classroom_id }}">
                                            <input type="hidden" name="user_size" value="{{ $currentUser->user_size }}">
                                            <button type="submit"
                                                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                                                Book Now
                                            </button>
                                        </form>
                                    @else
                                        <p class="text-red-500 text-sm">Classroom capacity insufficient for your class size</p>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        @endif
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

        // Update time every second
        if (document.getElementById('currentTime')) {
            updateCurrentTime();
            setInterval(updateCurrentTime, 1000);
        }
    </script>
@endsection
