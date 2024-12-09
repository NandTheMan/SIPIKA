<?php

use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dummy');
});

Route::get('/signin', function () {
    return Inertia::render('SigninPage');
});

Route::get('/central', function () {
    return Inertia::render('dummy');
});

Route::get('/booking', function () {
    return Inertia::render('BookingPage');
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/classroom', [ClassroomController::class, 'index'])->name('classrooms.index');
Route::get('/classrooms/create', [ClassroomController::class, 'create'])->name('classrooms.create');
Route::get('/classrooms', [ClassroomController::class, 'add'])->name('classrooms.add');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
