@extends('layouts.app')

@section('title', 'Select Classroom - Step 2')

@section('content')
    <div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div class="mb-6">
            <h2 class="text-2xl font-bold">Book a Classroom - Step 2</h2>
            <p class="text-gray-600">Select classroom and specify details</p>
        </div>

        <div class="mb-4 p-4 bg-blue-50 rounded">
            <h3 class="font-semibold">Selected Time:</h3>
            <p>Date: {{ session('booking_date') }}</p>
            <p>Time: {{ session('booking_start_time') }} - {{ session('booking_end_time') }}</p>
        </div>

        <form action="{{ route('bookings.store') }}" method="POST" class="space-y-4">
            @csrf

            <div>
                <label for="classroom_id" class="block text-sm font-medium mb-1">Select Classroom</label>
                <select name="classroom_id" id="classroom_id" class="w-full rounded border-gray-300" required>
                    <option value="">Choose a classroom...</option>
                    @foreach($classrooms as $classroom)
                        <option value="{{ $classroom->classroom_id }}">
                            {{ $classroom->classroom_name }}
                            (Capacity: {{ $classroom->classroom_capacity }})
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label for="user_size" class="block text-sm font-medium mb-1">Number of People</label>
                <input type="number" id="user_size" name="user_size"
                       value="{{ old('user_size', 1) }}"
                       min="1" class="w-full rounded border-gray-300" required>
                <p class="text-sm text-gray-500 mt-1">
                    Enter the number of people that will use the classroom
                </p>
            </div>

            <div class="pt-4 flex justify-between">
                <a href="{{ route('bookings.select-datetime') }}"
                   class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back
                </a>
                <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Next Step
                </button>
            </div>
        </form>
    </div>
@endsection
