<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ShareInertiaAuthData
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->inertia()) {
            return $next($request);
        }

        // Share auth data with all Inertia responses
        \Inertia\Inertia::share([
            'auth' => [
                'user' => $request->user() ? [
                    'id' => Auth::user()->id,
                    'username' => Auth::user()->username,
                    'email' => Auth::user()->email,
                    'roles' => Auth::user()->roles->pluck('role_name'),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);

        return $next($request);
    }
}
