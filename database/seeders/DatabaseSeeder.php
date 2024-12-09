<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
