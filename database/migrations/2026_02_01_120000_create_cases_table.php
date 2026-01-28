<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->boolean('featured')->default(false);
            $table->text('description')->nullable();
            $table->json('meta')->nullable(); // client, role, duration, stack, results, task, approach, solution, outcome, metrics, testimonial
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
