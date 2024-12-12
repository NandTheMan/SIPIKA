@extends('layouts.app')

@section('title', 'Facilities')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-6">Facilities</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($facilities as $facility)
            <div class="border rounded-lg p-4">
                <h3 class="text-xl font-semibold">{{ $facility->facility_name }}</h3>
                <p class="text-gray-600 mt-2">
                    Available in {{ $facility->classrooms->count() }} classrooms
                </p>
                <div class="mt-4">
                    <a href="{{ route('facilities.show', $facility) }}"
                       class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        View Classrooms
                    </a>
                </div>
            </div>
        @endforeach
    </div>
</div>