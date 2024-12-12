@extends('layouts.app')

@section('title', 'My Bookings')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
            <h2 class="text-2xl font-bold">My Bookings</h2>
            <div class="space-x-2">
                <a href="{{ route('bookings.quick-book') }}" 
                   class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Quick Book
                </a>
                <a href="{{ route('bookings.select-datetime') }}" 
                   class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    New Booking
                </a>
            </div>
        </div>
        <div class="text-right">
            <p class="text-sm text-gray-500">Current Time</p>
            <p class="font-mono" id="currentTime"></p>
        </div>
    </div>

    <div class="space-y-6">
        {{-- Active Bookings --}}
        <div>
            <h3 class="text-xl font-semibold mb-4">Active Bookings</h3>
            <div class="space-y-4">
                @php
                    $activeBookings = $bookings->filter(function($booking) {
                        return in_array($booking->status, ['pending', 'in_progress']);
                    });
                @endphp

                @forelse($activeBookings as $booking)
                    <div class="border rounded-lg p-4 @if($booking->status === 'pending') bg-yellow-50 @else bg-blue-50 @endif">
                        <div class="flex justify-between items-start">
                            <div class="space-y-2">
                                <h4 class="text-lg font-semibold">{{ $booking->classroom->classroom_name }}</h4>
                                <div class="text-gray-600">
                                    <p>{{ $booking->start_time->format('l, j F Y') }}</p>
                                    <p>{{ $booking->start_time->format('H:i') }} - {{ $booking->end_time->format('H:i') }}</p>
                                    <p>Duration: {{ App\Http\Helpers\SKSHelper::formatDuration($booking->sks_duration) }}</p>
                                    <p class="mt-2">
                                        Status: 
                                        <span class="font-medium 
                                            @if($booking->status === 'pending') text-yellow-600
                                            @else text-blue-600 @endif">
                                            {{ ucfirst($booking->status) }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="space-x-2">
                                @if($booking->status === 'pending')
                                    <form action="{{ route('bookings.cancel', $booking) }}" 
                                          method="POST" 
                                          class="inline-block"
                                          onsubmit="return confirm('Are you sure you want to cancel this booking?');">
                                        @csrf
                                        @method('PUT')
                                        <button type="submit" 
                                                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                            Cancel
                                        </button>
                                    </form>
                                    <a href="{{ route('bookings.start-photo', $booking) }}"
                                       class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                                        Start Check-in
                                    </a>
                                @endif
                                <a href="{{ route('bookings.show', $booking) }}"
                                   class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                @empty
                    <p class="text-gray-500 text-center py-4">No active bookings.</p>
                @endforelse
            </div>
        </div>

        {{-- Past and Cancelled Bookings --}}
        <div>
            <h3 class="text-xl font-semibold mb-4">Past & Cancelled Bookings</h3>
            <div class="space-y-4">
                @php
                    $pastBookings = $bookings->filter(function($booking) {
                        return in_array($booking->status, ['finished', 'cancelled']);
                    });
                @endphp

                @forelse($pastBookings as $booking)
                    <div class="border rounded-lg p-4 {{ $booking->status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50' }}">
                        <div class="flex justify-between items-start">
                            <div class="space-y-2">
                                <h4 class="text-lg font-semibold">{{ $booking->classroom->classroom_name }}</h4>
                                <div class="text-gray-600">
                                    <p>{{ $booking->start_time->format('l, j F Y') }}</p>
                                    <p>{{ $booking->start_time->format('H:i') }} - {{ $booking->end_time->format('H:i') }}</p>
                                    <p>Duration: {{ App\Http\Helpers\SKSHelper::formatDuration($booking->sks_duration) }}</p>
                                    <p class="mt-2">
                                        Status: 
                                        <span class="font-medium {{ $booking->status === 'cancelled' ? 'text-red-600' : 'text-green-600' }}">
                                            {{ ucfirst($booking->status) }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <a href="{{ route('bookings.show', $booking) }}"
                                   class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                @empty
                    <p class="text-gray-500 text-center py-4">No past or cancelled bookings.</p>
                @endforelse
            </div>
        </div>
    </div>
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