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
        Schema::create('classroom', function (Blueprint $table) {
            $table->integer('classroom_id')->primary()->autoIncrement();
            $table->string('classroom_name');
            $table->integer('classroom_capacity');
            $table->integer('floor');
            $table->boolean('is_booked');
        });

        Schema::create('classroom_facilities', function (Blueprint $table) {
            $table->integer('classroom_id')->primary()->autoIncrement();
            $table->foreign('classroom_id')->references('classroom_id')->on('classroom')->onDelete('cascade');
            $table->string('facility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom');
        Schema::dropIfExists('classroom_facilities');
    }
};
