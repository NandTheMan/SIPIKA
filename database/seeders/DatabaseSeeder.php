<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Classroom;
use App\Models\Facility;
use App\Models\Booking;
use App\Models\Report;
use App\Models\PinnedClassroom;
use App\Http\Helpers\SKSHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // Import DB facade

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear existing data in the correct order (reverse of dependencies)
        Report::truncate();
        Booking::truncate();
        PinnedClassroom::truncate();

        // Clear pivot tables
        DB::table('classroom_facilities')->truncate();
        DB::table('user_roles')->truncate();

        Classroom::truncate();
        Facility::truncate();
        User::truncate();
        Role::truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create roles
        $adminRole = Role::create(['role_id' => 1, 'role_name' => 'Admin']);
        $studentRole = Role::create(['role_id' => 2, 'role_name' => 'Student']);
        $facultyRole = Role::create(['role_id' => 3, 'role_name' => 'Faculty']);

        // Create Admin User
        $adminUser = User::create([
            'username' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'major' => 'Computer Science',
            'user_size' => 1,
            'year' => 2024,
            'is_penalized' => false,
        ]);
        $adminUser->roles()->attach($adminRole->role_id);

        // Create facilities
        $facilities = [
            ['facility_name' => 'Projector'],
            ['facility_name' => 'Air Conditioner'],
            ['facility_name' => 'Whiteboard'],
            ['facility_name' => 'Computer'],
            ['facility_name' => 'Audio System'],
            ['facility_name' => 'Smart Board']
        ];

        foreach ($facilities as $facility) {
            Facility::create($facility);
        }

        // Create classrooms with varying capacities
        $capacities = [
            '1.1' => ['capacity' => 20, 'facilities' => [1, 2, 3]], // Small room
            '1.2' => ['capacity' => 30, 'facilities' => [1, 2, 3, 4]], // Medium room
            '1.3' => ['capacity' => 40, 'facilities' => [1, 2, 3, 4, 5]], // Large room
            '1.4' => ['capacity' => 25, 'facilities' => [1, 2, 3]], // Small-medium room
            '2.1' => ['capacity' => 35, 'facilities' => [1, 2, 3, 4]], // Medium-large room
            '2.2' => ['capacity' => 20, 'facilities' => [1, 2, 3]], // Small room
            '2.3' => ['capacity' => 45, 'facilities' => [1, 2, 3, 4, 5, 6]], // Extra large room
            '2.4' => ['capacity' => 30, 'facilities' => [1, 2, 3, 4]], // Medium room
            '3.1' => ['capacity' => 25, 'facilities' => [1, 2, 3]], // Small-medium room
            '3.2' => ['capacity' => 40, 'facilities' => [1, 2, 3, 4, 5]], // Large room
            '3.3' => ['capacity' => 30, 'facilities' => [1, 2, 3, 4]], // Medium room
            '3.4' => ['capacity' => 35, 'facilities' => [1, 2, 3, 4]] // Medium-large room
        ];

        foreach ($capacities as $roomNumber => $details) {
            list($floor, $room) = explode('.', $roomNumber);

            $classroom = Classroom::create([
                'classroom_name' => "Room $roomNumber",
                'classroom_capacity' => $details['capacity'],
                'floor' => $floor,
                'is_booked' => false
            ]);

            $classroom->facilities()->attach($details['facilities']);
        }

        // Create regular users
        $users = [
            [
                'username' => 'John Faculty',
                'email' => 'faculty@example.com',
                'password' => 'password',
                'major' => 'Computer Science',
                'user_size' => 30,
                'year' => 2024,
                'is_penalized' => false,
                'role' => $facultyRole->role_id
            ],
            [
                'username' => 'Alice Student',
                'email' => 'alice@example.com',
                'password' => 'password',
                'major' => 'Informatika',
                'user_size' => 1,
                'year' => 2024,
                'is_penalized' => false,
                'role' => $studentRole->role_id
            ],
            [
                'username' => 'Bob Student',
                'email' => 'bob@example.com',
                'password' => 'password',
                'major' => 'Matematika',
                'user_size' => 4,
                'year' => 2024,
                'is_penalized' => true,
                'role' => $studentRole->role_id
            ],
            [
                'username' => 'Carol Student',
                'email' => 'carol@example.com',
                'password' => 'password',
                'major' => 'Fisika',
                'user_size' => 3,
                'year' => 2024,
                'is_penalized' => false,
                'role' => $studentRole->role_id
            ]
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);

            $user = User::create([
                ...$userData,
                'password' => Hash::make($userData['password'])
            ]);

            $user->roles()->attach($role);

            // Create bookings for non-penalized users
            if (!$userData['is_penalized']) {
                $this->createBookings($user);
            }
        }

        // Create reports
        $this->createReports();

        // Create pinned classrooms
        $this->createPinnedClassrooms();
    }

    private function createBookings($user)
    {
        $now = Carbon::now('Asia/Singapore');

        // Find appropriate classroom
        $classroom = Classroom::where('classroom_capacity', '>=', $user->user_size)
            ->inRandomOrder()
            ->first();

        if (!$classroom) return;

        // Sample bookings with different statuses
        $bookingData = [
            [
                'start_time' => $now->copy()->addHour(),
                'sks_duration' => 2,
                'status' => 'pending'
            ],
            [
                'start_time' => $now->copy()->subMinutes(30),
                'sks_duration' => 3,
                'status' => 'in_progress',
                'url_image_start' => 'booking-images/sample-start.jpg'
            ],
            [
                'start_time' => $now->copy()->subDays(1),
                'sks_duration' => 3,
                'status' => 'finished',
                'url_image_start' => 'booking-images/sample-start.jpg',
                'url_image_end' => 'booking-images/sample-end.jpg'
            ],
            [
                'start_time' => $now->copy()->subDays(2),
                'sks_duration' => 1,
                'status' => 'cancelled'
            ]
        ];

        foreach ($bookingData as $data) {
            $startTime = $data['start_time'];
            $endTime = $startTime->copy()->addMinutes($data['sks_duration'] * SKSHelper::getDuration());

            Booking::create([
                'user_id' => $user->user_id,
                'classroom_id' => $classroom->classroom_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'sks_duration' => $data['sks_duration'],
                'status' => $data['status'],
                'user_size' => $user->user_size,
                'url_image_start' => $data['url_image_start'] ?? null,
                'url_image_end' => $data['url_image_end'] ?? null
            ]);
        }
    }

    private function createReports()
    {
        $users = User::all();
        $classrooms = Classroom::all();

        // Create some sample reports
        $reports = [
            [
                'description' => 'Classroom left in messy condition',
                'status' => false
            ],
            [
                'description' => 'Damaged projector screen',
                'status' => true,
                'resolved_time' => now()->subHours(2)
            ],
            [
                'description' => 'Unauthorized use of classroom',
                'status' => false
            ],
            [
                'description' => 'Air conditioner not working',
                'status' => true,
                'resolved_time' => now()->subDays(1)
            ]
        ];

        foreach ($reports as $reportData) {
            $reporter = $users->where('is_penalized', false)->random();
            $reported = $users->where('user_id', '!=', $reporter->user_id)->random();

            Report::create([
                'reported_user_id' => $reported->user_id,
                'reporter_user_id' => $reporter->user_id,
                'classroom_id' => $classrooms->random()->classroom_id,
                'report_time' => now()->subHours(rand(1, 48)),
                'report_description' => $reportData['description'],
                'report_status' => $reportData['status'],
                'report_resolved_time' => $reportData['resolved_time'] ?? null,
                'url_image_report' => 'report-images/sample-report.jpg'
            ]);
        }
    }

    private function createPinnedClassrooms()
    {
        $users = User::all();
        $classrooms = Classroom::all();

        foreach ($users as $user) {
            // Pin 2-3 random classrooms for each user
            $pinnedCount = rand(2, 3);
            $randomClassrooms = $classrooms->random($pinnedCount);

            foreach ($randomClassrooms as $classroom) {
                PinnedClassroom::create([
                    'user_id' => $user->user_id,
                    'classroom_id' => $classroom->classroom_id
                ]);
            }
        }
    }
}
