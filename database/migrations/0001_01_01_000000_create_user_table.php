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
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->primary();
            $table->string('username');
            $table->string('password');
            $table->string('jabatan');
            $table->string('program_studi');
            $table->string('email');
            $table->string('no_telepon');
            $table->boolean('is_penalized');
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->unsignedInteger('role_id')->primary()->autoIncrement();
            $table->string('role_name');
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->integer('role_id')->unsigned();
            $table->foreign('role_id')->references('role_id')->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('users');
    }
};
