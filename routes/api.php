<?php

use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Get pinned classrooms for the current user
Route::get('/pinned-classrooms', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json([]); // Return empty if not logged in
    }
    return $user->pinnedClassrooms()->select('classroom_id')->get();
});

// Pin a classroom
Route::post('/classrooms/pin', function (Request $request) {
    $user = Auth::user();
    $classroomId = $request->input('classroom_id');

    if (!$user || !Classroom::find($classroomId)) {
        return response()->json(['error' => 'Invalid request'], 400);
    }

    if (!$user->pinnedClassrooms()->where('classroom_id', $classroomId)->exists()) {
        $user->pinnedClassrooms()->attach($classroomId);
    }

    return response()->json(['message' => 'Classroom pinned successfully']);
});

// Unpin a classroom
Route::post('/classrooms/unpin', function (Request $request) {
    $user = Auth::user();
    $classroomId = $request->input('classroom_id');

    if (!$user) {
        return response()->json(['error' => 'Invalid request'], 400);
    }

    $user->pinnedClassrooms()->detach($classroomId);

    return response()->json(['message' => 'Classroom unpinned successfully']);
});
