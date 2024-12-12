<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Carbon\Carbon;

class UpdateBookingStatuses extends Command
{
    protected $signature = 'bookings:update-status';
    protected $description = 'Check and update booking statuses based on time';

    public function handle()
    {
        $now = Carbon::now();
        
        // Get pending bookings that are past their start time + 30 minutes
        $overdueBookings = Booking::where('status', 'pending')
            ->where('start_time', '<=', $now->copy()->subMinutes(30))
            ->get();

        foreach ($overdueBookings as $booking) {
            $booking->update([
                'status' => 'cancelled'
            ]);
            $this->info("Booking {$booking->booking_id} auto-cancelled due to no start photo");
        }

        $this->info('Booking statuses updated successfully');
    }
}