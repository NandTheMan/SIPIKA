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
        Schema::create('report', function (Blueprint $table) {
            $table->unsignedInteger('report_id')->primary()->autoIncrement();
            $table->integer('reported_user_id')->unsigned();
            $table->foreign('reported_user_id')->references('user_id')->on('users');
            $table->integer('classroom_id')->unsigned();
            $table->foreign('classroom_id')->references('classroom_id')->on('classrooms');
            $table->integer('reporter_user_id')->unsigned();
            $table->foreign('reporter_user_id')->references('user_id')->on('users');
            $table->dateTime('report_time');
            $table->longText('report_description');
            $table->boolean('report_status');
            $table->dateTime('report_resolved_time');
            $table->string('url_image_report');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report');
    }
};
