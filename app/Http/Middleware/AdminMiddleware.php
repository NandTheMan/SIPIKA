<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->roles->contains('role_name', 'Admin')) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }
            return redirect()->route('home')->with('error', 'Unauthorized access');
        }

        return $next($request);
    }
}
