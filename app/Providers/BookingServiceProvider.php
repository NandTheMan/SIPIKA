<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Carbon\Carbon;

class BookingServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('booking.helper', function ($app) {
            return new \App\Services\BookingHelper();
        });
    }

    public function boot()
    {
        // Set timezone for all Carbon instances
        Carbon::setLocale(config('app.locale'));

        // Share common data with all views
        View::composer(['*'], function ($view) {
            $view->with('currentTime', Carbon::now('Asia/Singapore'));
        });
    }
}
