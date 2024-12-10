<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'user_id' => '2308561073',
                'username' => 'admin',
                'password' => '123',
                'jabatan' => 'admin',
                'program_studi' => 'admin',
                'email' => 'admin@gmail.com',
                'no_telepon' => '081936052444',
                'is_penalized' => false
            ],
            [
                'user_id' => '2308561074',
                'username' => 'koordinator',
                'password' => Hash::make('4321'),
                'jabatan' => 'koordinator',
                'program_studi' => 'Informatika',
                'email' => 'koordinator@gmail.com',
                'no_telepon' => '081936052432',
                'is_penalized' => false
            ],
            [
                'user_id' => '2308561075',
                'username' => 'dosen',
                'password' => Hash::make('1234'),
                'jabatan' => 'dosen',
                'program_studi' => 'Informatika',
                'email' => 'dosen@gmail.com',
                'no_telepon' => '081936052456',
                'is_penalized' => false
            ]
        ]);
        DB::table('classrooms')->insert([
            [
                'classroom_name' => '1.1',
                'classroom_capacity' => 25,
                'classroom_floor' => 1,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '1.2',
                'classroom_capacity' => 25,
                'classroom_floor' => 1,
                'classroom_is_booked' => true,
            ],
            [
                'classroom_name' => '1.3',
                'classroom_capacity' => 25,
                'classroom_floor' => 1,
                'classroom_is_booked' => true,
            ],
            [
                'classroom_name' => '1.4',
                'classroom_capacity' => 25,
                'classroom_floor' => 1,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '1.2',
                'classroom_capacity' => 25,
                'classroom_floor' => 1,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '2.1',
                'classroom_capacity' => 25,
                'classroom_floor' => 2,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '2.2',
                'classroom_capacity' => 25,
                'classroom_floor' => 2,
                'classroom_is_booked' => true,
            ],
            [
                'classroom_name' => '2.3',
                'classroom_capacity' => 25,
                'classroom_floor' => 2,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '2.4',
                'classroom_capacity' => 40,
                'classroom_floor' => 2,
                'classroom_is_booked' => true,
            ],
            [
                'classroom_name' => '2.5',
                'classroom_capacity' => 40,
                'classroom_floor' => 2,
                'classroom_is_booked' => true,
            ],
            [
                'classroom_name' => '3.1',
                'classroom_capacity' => 25,
                'classroom_floor' => 3,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '3.2',
                'classroom_capacity' => 25,
                'classroom_floor' => 3,
                'classroom_is_booked' => false,
            ],
            [
                'classroom_name' => '3.3',
                'classroom_capacity' => 25,
                'classroom_floor' => 3,
                'classroom_is_booked' => true,
            ],
            [
                'classroom_name' => '3.4',
                'classroom_capacity' => 25,
                'classroom_floor' => 3,
                'classroom_is_booked' => false,
            ],
        ]);
    }
}
