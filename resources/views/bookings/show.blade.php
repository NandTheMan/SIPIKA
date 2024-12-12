@extends('layouts.app')

@section('title', 'Booking Details')

@section('content')
    <div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Booking Details</h2>
            <div class="text-right">
                <p class="text-sm text-gray-500">Current Time</p>
                <p class="font-mono" id="currentTime"></p>
            </div>
        </div>

        <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="font-semibold text-lg">Classroom</h3>
                    <p>{{ $booking->classroom->classroom_name }}</p>
                </div>

                <div>
                    <h3 class="font-semibold text-lg">Status</h3>
                    <p class="
                    @if($booking->status === 'pending') text-yellow-600
                    @elseif($booking->status === 'in_progress') text-blue-600
                    @elseif($booking->status === 'finished') text-green-600
                    @else text-red-600
                    @endif font-medium
                ">
                        {{ ucfirst($booking->status) }}
                    </p>
                </div>

                <div>
                    <h3 class="font-semibold text-lg">Date</h3>
                    <p>{{ $booking->start_time->format('l, j F Y') }}</p>
                </div>

                <div>
                    <h3 class="font-semibold text-lg">Time</h3>
                    <p>{{ $booking->start_time->format('H:i') }} - {{ $booking->end_time->format('H:i') }}</p>
                </div>

                <div>
                    <h3 class="font-semibold text-lg">Duration</h3>
                    <p>{{ App\Http\Helpers\SKSHelper::formatDuration($booking->sks_duration) }}</p>
                </div>

                <div>
                    <h3 class="font-semibold text-lg">Number of People</h3>
                    <p>{{ $booking->user_size }}</p>
                </div>

                <div>
                    <h3 class="font-semibold text-lg">Check-in Window</h3>
                    <p>{{ $booking->start_time->copy()->subMinutes(15)->format('H:i') }} -
                        {{ $booking->start_time->copy()->addMinutes(15)->format('H:i') }}</p>
                </div>
            </div>

            {{-- Available Actions --}}
            <div class="flex space-x-4">
                @if($booking->status === 'pending')
                    <form action="{{ route('bookings.cancel', $booking) }}"
                          method="POST"
                          onsubmit="return confirm('Are you sure you want to cancel this booking?');">
                        @csrf
                        @method('PUT')
                        <button type="submit"
                                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Cancel Booking
                        </button>
                    </form>
                    <a href="{{ route('bookings.start-photo', $booking) }}"
                       class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Start Check-in
                    </a>
                @endif

                @if($booking->status === 'in_progress')
                    <form action="{{ route('bookings.end-early', $booking) }}"
                          method="POST"
                          enctype="multipart/form-data"
                          class="space-y-4 w-full">
                        @csrf
                        @method('PUT')
                        <div class="flex items-center space-x-2">
                            <input type="file"
                                   name="image_end"
                                   accept="image/*"
                                   class="flex-grow rounded border-gray-300"
                                   required>
                            <button type="submit"
                                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onclick="return confirm('Are you sure you want to end this booking early?');">
                                End Early
                            </button>
                        </div>
                    </form>
                @endif
            </div>

            {{-- Photos Section --}}
            <div class="space-y-4">
                <h3 class="font-semibold text-lg">Photos</h3>

                {{-- Start Photo --}}
                <div>
                    <p class="font-medium mb-2">Start Condition:</p>
                    @if($booking->url_image_start)
                        <img src="{{ Storage::url($booking->url_image_start) }}"
                             alt="Start condition"
                             class="max-w-md rounded-lg shadow">
                    @else
                        <p class="text-gray-500">No start photo uploaded yet</p>
                    @endif
                </div>

                {{-- End Photo --}}
                <div>
                    <p class="font-medium mb-2">End Condition:</p>
                    @if($booking->url_image_end)
                        <img src="{{ Storage::url($booking->url_image_end) }}"
                             alt="End condition"
                             class="max-w-md rounded-lg shadow">
                    @else
                        <p class="text-gray-500">No end photo uploaded yet</p>
                    @endif
                </div>
            </div>

            {{-- Status-based Instructions --}}
            @if($booking->status === 'pending')
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p class="text-yellow-700">
                        Your booking is pending. Please start check-in between
                        {{ $booking->start_time->copy()->subMinutes(15)->format('H:i') }} and
                        {{ $booking->start_time->copy()->addMinutes(15)->format('H:i') }}.
                    </p>
                </div>
            @elseif($booking->status === 'in_progress')
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p class="text-blue-700">
                        Your booking is in progress. You can end the booking early by uploading an end photo.
                    </p>
                </div>
            @elseif($booking->status === 'finished')
                <div class="bg-green-50 border-l-4 border-green-400 p-4">
                    <p class="text-green-700">
                        Booking completed successfully at {{ $booking->end_time->format('H:i') }}.
                    </p>
                </div>
            @else
                <div class="bg-red-50 border-l-4 border-red-400 p-4">
                    <p class="text-red-700">
                        This booking was cancelled.
                    </p>
                </div>
            @endif
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

        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    </script>
@endsection
