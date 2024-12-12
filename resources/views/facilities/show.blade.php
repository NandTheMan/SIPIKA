@extends('layouts.app')

@section('title', $facility->facility_name)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Classrooms with {{ $facility->facility_name }}</h2>
        <a href="{{ route('facilities.index') }}"
           class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Facilities
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($classrooms as $classroom)
            <div class="border rounded-lg p-4 {{ $classroom->is_booked ? 'bg-red-50' : 'bg-green-50' }}">
                <h3 class="text-xl font-semibold">{{ $classroom->classroom_name }}</h3>
                <p>Floor: {{ $classroom->floor }}</p>
                <p>Capacity: {{ $classroom->classroom_capacity }}</p>
                <div class="mt-2">
                    <strong>Other Facilities:</strong>
                    <div class="flex flex-wrap gap-2 mt-1">
                        @foreach($classroom->facilities as $f)
                            @if($f->facility_id !== $facility->facility_id)
                                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {{ $f->facility_name }}
                                </span>
                            @endif
                        @endforeach
                    </div>
                </div>
                <div class="mt-4">
                    <a href="{{ route('bookings.create', ['classroom_id' => $classroom->classroom_id]) }}"
                       class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Book Now
                    </a>
                </div>
            </div>
        @endforeach
    </div>
</div>