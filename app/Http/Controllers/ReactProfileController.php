<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ReactProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->user_id.',user_id'],
            'major' => ['required', 'string', 'max:255'],
            'current_password' => ['nullable', 'required_with:new_password'],
            'new_password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        // Check if current password is correct if trying to change password
        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors([
                    'current_password' => 'The provided password is incorrect.'
                ]);
            }
        }

        // Update user information
        $updateData = [
            'username' => $validated['username'],
            'email' => $validated['email'],
            'major' => $validated['major'],
        ];

        // Update password if provided
        if ($request->filled('new_password')) {
            $updateData['password'] = Hash::make($validated['new_password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
