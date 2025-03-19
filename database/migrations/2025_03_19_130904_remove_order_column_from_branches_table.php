<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Remove the order column from branches table since we're now sorting
     * branches alphabetically by name instead.
     */
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }

    /**
     * Reverse the migrations.
     *
     * Add back the order column if the migration is rolled back.
     */
    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->unsignedInteger('order')->default(0)->after('description');
        });
    }
};
