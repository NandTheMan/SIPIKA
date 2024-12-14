<?php

namespace App\Http\Helpers;

use Carbon\Carbon;

class SKSHelper
{
    const MINUTES_PER_SKS = 40;

    public static function getDuration(): int
    {
        return self::MINUTES_PER_SKS;
    }

    public static function calculateEndTime(Carbon $startTime, int $sksUnits): Carbon
    {
        return $startTime->copy()->addMinutes($sksUnits * self::MINUTES_PER_SKS);
    }

    public static function calculateSKSDuration(Carbon $startTime, Carbon $endTime): int
    {
        $minutes = $endTime->diffInMinutes($startTime);
        return ceil($minutes / self::MINUTES_PER_SKS);
    }

    public static function getValidSKSDurations(): array
    {
        return range(1, 6);
    }

    public static function formatDuration(int $sksUnits): string
    {
        $minutes = $sksUnits * self::MINUTES_PER_SKS;
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($hours > 0 && $remainingMinutes > 0) {
            return "{$sksUnits} SKS ({$hours}j {$remainingMinutes}m)";
        } elseif ($hours > 0) {
            return "{$sksUnits} SKS ({$hours}j)";
        } else {
            return "{$sksUnits} SKS ({$minutes}m)";
        }
    }

    public static function getTimeSlots(): array
    {
        $slots = [];
        $start = Carbon::createFromTime(7, 0); // Start at 7 AM
        $end = Carbon::createFromTime(17, 0);  // End at 5 PM

        while ($start <= $end) {
            $slots[] = $start->format('H:i');
            $start->addMinutes(40); // Add one SKS duration
        }

        return $slots;
    }

    public static function getValidTimeSlots(): array
    {
        $slots = [];
        $now = Carbon::now('Asia/Singapore');
        $start = $now->copy()->startOfHour();
        $end = Carbon::createFromTime(17, 0);  // End at 5 PM

        if ($now->minute > 0) {
            // If we're partway through an hour, start from the next hour
            $start->addHour();
        }

        while ($start <= $end) {
            $slots[] = $start->format('H:i');
            $start->addMinutes(40); // Add one SKS duration
        }

        return $slots;
    }
}
