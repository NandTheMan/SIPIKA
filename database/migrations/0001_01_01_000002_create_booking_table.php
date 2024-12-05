<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking', function (Blueprint $table) {
            $table->unsignedInteger('booking_id')->primary()->autoIncrement();
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->integer('classroom_id')->unsigned();
            $table->foreign('classroom_id')->references('classroom_id')->on('classrooms');
            $table->dateTime('start_time');
            $table->integer('booking_time');
            $table->dateTime('end_time');
            $table->string('status');
            $table->string('url_image_start');
            $table->string('url_image_end');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};
