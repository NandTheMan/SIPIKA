<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->primary()->autoIncrement();
            $table->string('username');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('major');
            $table->integer('user_size');
            $table->integer('year');
            $table->boolean('is_penalized')->default(false);
            $table->rememberToken();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->unsignedInteger('role_id')->primary()->autoIncrement();
            $table->string('role_name');
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->integer('role_id')->unsigned();
            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('cascade');
            $table->primary(['user_id', 'role_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('users');
    }
};
