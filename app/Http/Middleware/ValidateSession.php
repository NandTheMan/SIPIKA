<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ValidateSession
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && !session()->has('validated')) {
            auth()->logout();
            return redirect('/login')->withErrors(['error' => 'Invalid session']);
        }

        return $next($request);
    }
}
