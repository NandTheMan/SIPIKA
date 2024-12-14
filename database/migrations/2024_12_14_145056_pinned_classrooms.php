<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pinned_classrooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id'); // Change to unsignedInteger
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->unsignedInteger('classroom_id');
            $table->foreign('classroom_id')->references('classroom_id')->on('classrooms')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'classroom_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pinned_classrooms');
    }
};
