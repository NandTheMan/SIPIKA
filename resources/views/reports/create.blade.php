@extends('layouts.app')

@section('title', 'Submit Report')

@section('content')
<div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Submit Report</h2>

    <form action="{{ route('reports.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
        @csrf
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="classroom_id" class="block text-sm font-medium mb-1">Select Classroom</label>
                <select name="classroom_id" id="classroom_id" class="w-full rounded border-gray-300" required>
                    <option value="">Choose a classroom...</option>
                    @foreach(\App\Models\Classroom::all() as $classroom)
                        <option value="{{ $classroom->classroom_id }}" 
                                {{ old('classroom_id') == $classroom->classroom_id ? 'selected' : '' }}>
                            {{ $classroom->classroom_name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label for="incident_date" class="block text-sm font-medium mb-1">Incident Date</label>
                <input type="date" 
                       id="incident_date" 
                       name="incident_date" 
                       value="{{ old('incident_date', now()->format('Y-m-d')) }}"
                       max="{{ now()->format('Y-m-d') }}"
                       class="w-full rounded border-gray-300" 
                       required>
            </div>

            <div>
                <label for="incident_time" class="block text-sm font-medium mb-1">Incident Time</label>
                <input type="time" 
                       id="incident_time" 
                       name="incident_time" 
                       value="{{ old('incident_time', now()->format('H:i')) }}"
                       class="w-full rounded border-gray-300" 
                       required>
            </div>
        </div>

        <div>
            <label for="report_description" class="block text-sm font-medium mb-1">Description</label>
            <textarea id="report_description" 
                      name="report_description" 
                      rows="4" 
                      class="w-full rounded border-gray-300" 
                      required>{{ old('report_description') }}</textarea>
        </div>

        <div>
            <label for="image" class="block text-sm font-medium mb-1">Evidence Photo</label>
            <input type="file" 
                   id="image" 
                   name="image" 
                   accept="image/*" 
                   class="w-full rounded border-gray-300" 
                   required>
        </div>

        <div class="pt-4 flex justify-between">
            <a href="{{ route('reports.index') }}" 
               class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancel
            </a>
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Submit Report
            </button>
        </div>
    </form>
</div>
@endsection