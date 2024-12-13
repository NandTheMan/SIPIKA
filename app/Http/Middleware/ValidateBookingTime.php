<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ValidateBookingTime
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = $request->input('startTime');
        $date = $request->input('date');

        if ($startTime && $date) {
            $selectedDateTime = Carbon::parse($date . ' ' . $startTime);
            $now = Carbon::now('Asia/Singapore');

            if ($selectedDateTime->lte($now)) {
                return redirect()->back()->withErrors([
                    'time' => 'Selected time must be after the current time.'
                ]);
            }
        }

        return $next($request);
    }
}
