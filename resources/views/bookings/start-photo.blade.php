@extends('layouts.app')

@section('title', 'Upload Start Photo')

@section('content')
<div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Start Booking</h2>
        <div class="text-right">
            <p class="text-sm text-gray-500">Current Time</p>
            <p class="font-mono text-lg" id="currentTime"></p>
        </div>
    </div>

    <div class="mb-6">
        <h3 class="text-lg font-semibold">Booking Details</h3>
        <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
                <p class="font-medium">Classroom:</p>
                <p>{{ $booking->classroom->classroom_name }}</p>
            </div>

            <div>
                <p class="font-medium">Booking Duration:</p>
                <p>{{ $booking->start_time->format('H:i') }} - {{ $booking->end_time->format('H:i') }}</p>
            </div>

            <div>
                <p class="font-medium">Date:</p>
                <p>{{ $booking->start_time->format('l, j F Y') }}</p>
            </div>

            <div>
                <p class="font-medium">Check-in Window:</p>
                <p>{{ $earliestStartTime->format('H:i') }} - {{ $latestStartTime->format('H:i') }}</p>
            </div>
        </div>
        
        <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Booking Status</h3>
            @if($now->lt($earliestStartTime))
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p class="text-yellow-700">
                        Too early to start. You can start this booking at {{ $earliestStartTime->format('H:i') }}.
                        @if($minutesUntilStart > 0)
                            ({{ (int)$minutesUntilStart }} minutes remaining)
                        @endif
                    </p>
                </div>
            @elseif($now->gt($latestStartTime))
                <div class="bg-red-50 border-l-4 border-red-400 p-4">
                    <p class="text-red-700">
                        This booking has been automatically cancelled as it's past the latest start time of {{ $latestStartTime->format('H:i') }}.
                    </p>
                </div>
            @else
                <div class="bg-green-50 border-l-4 border-green-400 p-4">
                    <p class="text-green-700">
                        You can now start this booking. Please upload a photo of the classroom condition.
                        @if($now->lt($booking->start_time))
                            ({{ (int)$now->diffInMinutes($booking->start_time) }} minutes before scheduled start)
                        @else
                            ({{ (int)$now->diffInMinutes($booking->start_time) }} minutes after scheduled start)
                        @endif
                    </p>
                </div>
            @endif
        </div>
    </div>

    @if($canStart)
        <form action="{{ route('bookings.upload-start-photo', $booking) }}" 
              method="POST" 
              enctype="multipart/form-data" 
              class="space-y-4">
            @csrf
            
            <div>
                <label for="image_start" class="block text-sm font-medium mb-1">Classroom Photo</label>
                <input type="file" 
                       id="image_start" 
                       name="image_start" 
                       accept="image/*" 
                       class="w-full rounded border-gray-300" 
                       required>
            </div>

            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Start Booking
            </button>
        </form>
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
updateCurrentTime();
setInterval(updateCurrentTime, 1000);
</script>
@endsection