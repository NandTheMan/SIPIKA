<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('SigninPage');
    }

    public function showRegister()
    {
        return Inertia::render('Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('/home')
                ->with('success', 'Login successful');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput($request->except('password'));
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nim' => 'required|string|max:255|unique:users,username',
            'phone' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'jabatan' => 'required|string',
            'programStudi' => 'required|string'
        ]);

        try {
            $user = User::create([
                'username' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'major' => $request->programStudi,
                'user_size' => 1, // Default value
                'year' => date('Y'),
                'is_penalized' => false
            ]);

            // Attach role based on jabatan
            $roleId = match ($request->jabatan) {
                'Admin' => 1,
                'Dosen' => 3,
                'Koordinator Mata Kuliah' => 3,
                default => 2
            };

            $user->roles()->attach($roleId);

            Auth::login($user);

            return redirect('/home')->with('success', 'Registration successful');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/signin');
    }
}
