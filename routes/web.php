<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReactReportController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoomBookingController;
use App\Http\Controllers\BookingApiController;
use App\Http\Controllers\PinController;
use App\Http\Controllers\ReactProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReactBookingController;
use App\Http\Controllers\ClassroomOverviewController;
use App\Http\Controllers\QuickBookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Root route - Check auth status
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/home');
    }
    return redirect('/signin');
});

Route::get('/admin/test', function () {
    return 'This is a test admin route';
});

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/test-auth', function () {
        return 'This is an authenticated admin route';
    });
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::put('/users/{user}/penalize', [AdminController::class, 'penalizeUser'])->name('admin.users.penalize');
    Route::put('/reports/{report}/resolve', [AdminController::class, 'resolveReport'])->name('admin.reports.resolve');
});

// Guest Routes (for unauthenticated users only)
Route::middleware('guest')->group(function () {
    Route::get('/signin', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected Routes (for authenticated users only)
Route::middleware(['auth', 'verified'])->group(function () {
    // Home
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    Route::get('/debug/rooms/{id}', [RoomBookingController::class, 'getRoomDetails']);

    // Auth
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Profile
    Route::get('/api/bookings', [BookingApiController::class, 'getBookingsByDate']);

    Route::prefix('profile')->group(function () {
        Route::get('/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::get('/classrooms-overview', [ClassroomOverviewController::class, 'index'])
        ->name('classrooms.overview');
    Route::get('/api/facilities', [ClassroomOverviewController::class, 'getFacilities']);
    Route::get('/api/classrooms/{classroom}/current-booking', [ClassroomOverviewController::class, 'getCurrentBooking']);

    Route::prefix('quick-book')->group(function () {
        Route::get('/', [QuickBookController::class, 'index'])->name('quick-book.index');
        Route::post('/api/quick-book', [QuickBookController::class, 'store'])->name('quick-book.store');
        Route::post('store', [QuickBookController::class, 'store'])->name('quick-book.store'); // Add alternative route
    });

    Route::prefix('my-bookings')->group(function () {
        Route::get('/', [ReactBookingController::class, 'index'])->name('my-bookings.index');
        Route::get('/{booking}', [ReactBookingController::class, 'show'])->name('my-bookings.show');
        Route::post('/{booking}/cancel', [ReactBookingController::class, 'cancelBooking'])
            ->name('my-bookings.cancel');
        Route::post('/{booking}/end-early', [ReactBookingController::class, 'endEarly'])
            ->name('my-bookings.end-early');
    });

// In web.php, update the book-room routes section:
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

        // Update these routes - note the order is important
        Route::get('/rooms/floor/{floor}', [RoomBookingController::class, 'getRoomsByFloor']);
        Route::get('/rooms/{id}', [RoomBookingController::class, 'getRoomDetails']); // Put specific routes before generic ones
        Route::post('/check-availability', [RoomBookingController::class, 'checkAvailability'])
            ->name('booking.check-availability');
    });

    Route::get('/api/pinned-classrooms', [PinController::class, 'getPinnedClassrooms']);
    Route::post('/api/classrooms/pin', [PinController::class, 'pinClassroom']);
    Route::post('/api/classrooms/unpin', [PinController::class, 'unpinClassroom']);

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
        Route::put('/{booking}/end-early', [ReactBookingController::class, 'endEarly'])
            ->name('my-bookings.end-early');
    });

    // Legacy Reports (Admin Only)
    Route::middleware('admin')->prefix('admin/reports')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('admin.reports.index');
        Route::get('/create', [ReportController::class, 'create'])->name('admin.reports.create');
        Route::post('/', [ReportController::class, 'store'])->name('admin.reports.store');
        Route::get('/{report}', [ReportController::class, 'show'])->name('admin.reports.show');
        Route::put('/{report}', [ReportController::class, 'update'])->name('admin.reports.update');
    });

    // New React-based Reports (Regular Users)
    Route::prefix('reports')->group(function () {
        Route::get('/', [ReactReportController::class, 'index'])->name('reports.index');
        Route::get('/create', [ReactReportController::class, 'create'])->name('reports.create');
        Route::post('/', [ReactReportController::class, 'store'])->name('reports.store');
        Route::get('/{report}', [ReactReportController::class, 'show'])->name('reports.show');
        // New route for viewing report details
        Route::get('/view/{id}', [HomeController::class, 'viewReport'])->name('reports.view');

        // API endpoints for React components
        Route::prefix('api')->group(function () {
            Route::get('/classrooms', [ReactReportController::class, 'getClassrooms'])
                ->middleware('throttle:60,1');
        });
    });
});
