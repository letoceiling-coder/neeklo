<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();
        $isSqlite = $driver === 'sqlite';

        // Переименовываем message в body (если колонка message существует и body еще нет)
        if (Schema::hasColumn('support_messages', 'message') && !Schema::hasColumn('support_messages', 'body')) {
            if ($isSqlite) {
                // SQLite не поддерживает переименование колонок напрямую
                // Используем Schema для добавления новой колонки и копирования данных
                Schema::table('support_messages', function (Blueprint $table) {
                    $table->text('body')->nullable();
                });
                
                // Копируем данные
                DB::statement('UPDATE support_messages SET body = message WHERE body IS NULL');
                
                // Для SQLite оставляем обе колонки (переименование требует пересоздание таблицы)
            } else {
                DB::statement('ALTER TABLE support_messages CHANGE message body TEXT NOT NULL');
            }
        }
    }

    public function down(): void
    {
        $driver = DB::connection()->getDriverName();
        $isSqlite = $driver === 'sqlite';

        // Переименовываем обратно body в message
        if (Schema::hasColumn('support_messages', 'body') && !Schema::hasColumn('support_messages', 'message')) {
            if (!$isSqlite) {
                DB::statement('ALTER TABLE support_messages CHANGE body message TEXT NOT NULL');
            }
            // Для SQLite откат не выполняется (обе колонки остаются)
        }
    }
};

