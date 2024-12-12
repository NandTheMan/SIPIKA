<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Classroom;
use App\Models\Facility;
use App\Models\Booking;
use App\Http\Helpers\SKSHelper;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles if they don't exist
        $roles = [
            ['role_id' => 1, 'role_name' => 'Admin'],
            ['role_id' => 2, 'role_name' => 'Student'],
            ['role_id' => 3, 'role_name' => 'Faculty']
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['role_id' => $role['role_id']],
                ['role_name' => $role['role_name']]
            );
        }

        // Create facilities if they don't exist
        $facilities = [
            ['facility_name' => 'Projector'],
            ['facility_name' => 'Air Conditioner'],
            ['facility_name' => 'Whiteboard'],
            ['facility_name' => 'Computer']
        ];

        foreach ($facilities as $facility) {
            Facility::firstOrCreate(['facility_name' => $facility['facility_name']]);
        }

        // Create classrooms with varying capacities if they don't exist
        $capacities = [
            '1.1' => 20, // Small room
            '1.2' => 30, // Medium room
            '1.3' => 40, // Large room
            '1.4' => 25, // Small-medium room
            '2.1' => 35, // Medium-large room
            '2.2' => 20, // Small room
            '2.3' => 45, // Extra large room
            '2.4' => 30, // Medium room
            '3.1' => 25, // Small-medium room
            '3.2' => 40, // Large room
            '3.3' => 30, // Medium room
            '3.4' => 35, // Medium-large room
        ];

        foreach ($capacities as $roomNumber => $capacity) {
            list($floor, $room) = explode('.', $roomNumber);

            $classroom = Classroom::firstOrCreate(
                ['classroom_name' => "Room $roomNumber"],
                [
                    'classroom_capacity' => $capacity,
                    'floor' => $floor,
                    'is_booked' => false
                ]
            );

            // Attach random facilities if not already attached
            $facilityIds = Facility::inRandomOrder()
                ->limit(rand(2, 4))
                ->pluck('facility_id');

            $classroom->facilities()->sync($facilityIds, false);
        }

        // Create test users if they don't exist
        $testUsers = [
            [
                'username' => 'Akira Rian',
                'email' => 'test@example.com',
                'major' => 'Informatika',
                'user_size' => 30,
                'year' => 2024
            ],
            [
                'username' => 'Occa Abduljana',
                'email' => 'small@example.com',
                'major' => 'Informatika',
                'user_size' => 15,
                'year' => 2024
            ],
            // ... other users ...
        ];

        foreach ($testUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'username' => $userData['username'],
                    'password' => bcrypt('password'),
                    'major' => $userData['major'],
                    'user_size' => $userData['user_size'],
                    'year' => $userData['year'],
                    'is_penalized' => false
                ]
            );

            // Attach student role if not already attached
            if (!$user->roles()->where('roles.role_id', 2)->exists()) {
                $user->roles()->attach(2);
            }

            // Create sample bookings for each user
            $now = Carbon::now('Asia/Singapore');

            // Find appropriate classroom for this user
            $classroom = Classroom::where('classroom_capacity', '>=', $user->user_size)
                ->orderBy('classroom_capacity')
                ->first();

            if ($classroom) {
                // Sample pending booking (with custom user_size)
                Booking::create([
                    'user_id' => $user->user_id,
                    'classroom_id' => $classroom->classroom_id,
                    'start_time' => $now->copy()->addHour(),
                    'end_time' => $now->copy()->addHour()->addMinutes(80), // 2 SKS
                    'sks_duration' => 2,
                    'status' => 'pending',
                    'user_size' => rand($user->user_size - 5, $user->user_size) // Slightly random size
                ]);

                // Sample in_progress booking
                Booking::create([
                    'user_id' => $user->user_id,
                    'classroom_id' => $classroom->classroom_id,
                    'start_time' => $now->copy()->subMinutes(30),
                    'end_time' => $now->copy()->addMinutes(90), // 3 SKS
                    'sks_duration' => 3,
                    'status' => 'in_progress',
                    'user_size' => $user->user_size, // Using default class size
                    'url_image_start' => 'booking-images/sample-start.jpg'
                ]);

                // Sample finished booking
                Booking::create([
                    'user_id' => $user->user_id,
                    'classroom_id' => $classroom->classroom_id,
                    'start_time' => $now->copy()->subDays(1),
                    'end_time' => $now->copy()->subDays(1)->addMinutes(120), // 3 SKS
                    'sks_duration' => 3,
                    'status' => 'finished',
                    'user_size' => $user->user_size + rand(0, 5), // Slightly larger group
                    'url_image_start' => 'booking-images/sample-start.jpg',
                    'url_image_end' => 'booking-images/sample-end.jpg'
                ]);

                // Sample cancelled booking
                Booking::create([
                    'user_id' => $user->user_id,
                    'classroom_id' => $classroom->classroom_id,
                    'start_time' => $now->copy()->subDays(2),
                    'end_time' => $now->copy()->subDays(2)->addMinutes(40), // 1 SKS
                    'sks_duration' => 1,
                    'status' => 'cancelled',
                    'user_size' => rand(5, $user->user_size) // Random smaller group
                ]);
            }
        }
    }
}
