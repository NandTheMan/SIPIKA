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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->unsignedInteger('classroom_id')->primary()->autoIncrement();
            $table->string('classroom_name');
            $table->integer('classroom_capacity');
            $table->integer('floor');
            $table->boolean('is_booked');
        });

        Schema::create('facilities', function (Blueprint $table) {
            $table->integer('facility_id')->primary()->autoIncrement();
            $table->string('facility_name');
        });

        Schema::create('classroom_facilities', function (Blueprint $table) {
            $table->integer('classroom_id')->unsigned();
            $table->foreign('classroom_id')->references('classroom_id')->on('classrooms')->onDelete('cascade');
            $table->integer('facility_id');
            $table->foreign('facility_id')->references('facility_id')->on('facilities')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('classroom_facilities');
    }
};
