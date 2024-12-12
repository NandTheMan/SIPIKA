<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking', function (Blueprint $table) {
            $table->unsignedInteger('booking_id')->primary()->autoIncrement();
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->integer('classroom_id')->unsigned();
            $table->foreign('classroom_id')->references('classroom_id')->on('classrooms');
            $table->dateTime('start_time');
            $table->integer('sks_duration'); // Number of SKS units (1 SKS = 40 minutes)
            $table->dateTime('end_time');
            $table->enum('status', ['pending', 'in_progress', 'finished', 'cancelled'])->default('pending');
            $table->integer('user_size'); // Keep this for manual bookings
            $table->string('url_image_start')->nullable();
            $table->string('url_image_end')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};
