<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoomBookingController;
use App\Http\Controllers\BookingApiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Root route - Check auth status
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/home');
    }
    return redirect('/signin');
});

// Guest Routes (for unauthenticated users only)
Route::middleware('guest')->group(function () {
    Route::get('/signin', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Routes (for authenticated users only)
Route::middleware('auth')->group(function () {
    // Home
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    // Auth
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/api/bookings', [BookingApiController::class, 'getBookingsByDate']);

    // New React-based Booking System
    Route::prefix('book-room')->group(function () {
        Route::get('/', [RoomBookingController::class, 'index'])->name('booking.index');
        Route::get('/details', [RoomBookingController::class, 'showDetails'])
            ->middleware([\App\Http\Middleware\ValidateBookingTime::class])
            ->name('booking.details');
        Route::post('/create', [RoomBookingController::class, 'createBooking'])
            ->middleware([\App\Http\Middleware\ValidateBookingTime::class])
            ->name('booking.create');
        Route::get('/confirmation/{booking}', [RoomBookingController::class, 'showConfirmation'])->name('booking.confirmation');
        Route::get('/check-in/{booking}', [RoomBookingController::class, 'showCheckIn'])->name('booking.check-in');
        Route::post('/check-in/{booking}', [RoomBookingController::class, 'processCheckIn'])->name('booking.process-check-in');
        Route::get('/check-out/{booking}', [RoomBookingController::class, 'showCheckOut'])->name('booking.check-out');
        Route::post('/check-out/{booking}', [RoomBookingController::class, 'processCheckOut'])->name('booking.process-check-out');

        // API endpoints for React components
        Route::prefix('api')->group(function () {
            Route::get('/rooms/{id}', [RoomBookingController::class, 'getRoomDetails']);
            Route::post('/check-availability', [RoomBookingController::class, 'checkAvailability']);
            Route::get('/rooms/floor/{floor}', [RoomBookingController::class, 'getRoomsByFloor']);
        });
    });

    // Classrooms
    Route::get('/classrooms', [ClassroomController::class, 'index'])->name('classrooms.index');
    Route::get('/classrooms/{classroom}', [ClassroomController::class, 'show'])->name('classrooms.show');

    // Floor Details
    Route::get('/floor/{floor}', [HomeController::class, 'getFloorDetails']);

    // Facilities
    Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::get('/facilities/{facility}', [FacilityController::class, 'show'])->name('facilities.show');

    // Legacy Booking System
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('bookings.index');
        Route::get('/select-datetime', [BookingController::class, 'selectDateTime'])->name('bookings.select-datetime');
        Route::post('/select-datetime', [BookingController::class, 'storeDateTime'])->name('bookings.store-datetime');
        Route::get('/create', [BookingController::class, 'create'])->name('bookings.create');
        Route::post('/', [BookingController::class, 'store'])->name('bookings.store');
        Route::get('/quick-book', [BookingController::class, 'quickBook'])->name('bookings.quick-book');
        Route::post('/quick-book', [BookingController::class, 'storeQuickBook'])->name('bookings.quick-store');

        // Booking-specific routes
        Route::get('/{booking}/start-photo', [BookingController::class, 'showStartPhoto'])->name('bookings.start-photo');
        Route::post('/{booking}/start-photo', [BookingController::class, 'uploadStartPhoto'])->name('bookings.upload-start-photo');
        Route::post('/{booking}/end-photo', [BookingController::class, 'uploadEndPhoto'])->name('bookings.upload-end-photo');
        Route::get('/{booking}', [BookingController::class, 'show'])->name('bookings.show');
        Route::put('/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
        Route::put('/{booking}/end-early', [BookingController::class, 'endEarly'])->name('bookings.end-early');
    });

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/create', [ReportController::class, 'create'])->name('reports.create');
        Route::post('/', [ReportController::class, 'store'])->name('reports.store');
        Route::get('/{report}', [ReportController::class, 'show'])->name('reports.show');
        Route::put('/{report}', [ReportController::class, 'update'])->name('reports.update');
    });
});
