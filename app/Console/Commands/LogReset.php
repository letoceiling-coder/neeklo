<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class LogReset extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'log:reset 
                            {--force : Пропустить подтверждение}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Очистить все логи из директории storage/logs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $logsPath = storage_path('logs');
        
        if (!File::exists($logsPath)) {
            $this->warn('Директория storage/logs не существует.');
            return 1;
        }

        // Получаем все файлы логов (исключая .gitignore)
        $logFiles = File::files($logsPath);
        $logFiles = array_filter($logFiles, function ($file) {
            return $file->getFilename() !== '.gitignore';
        });

        if (empty($logFiles)) {
            $this->info('Логи не найдены. Директория уже пуста.');
            return 0;
        }

        $filesCount = count($logFiles);
        $totalSize = 0;
        
        foreach ($logFiles as $file) {
            $totalSize += $file->getSize();
        }
        
        $totalSizeMB = round($totalSize / 1024 / 1024, 2);

        $this->info("Найдено файлов логов: {$filesCount}");
        $this->line("Общий размер: {$totalSizeMB} MB");
        $this->newLine();

        // Показываем список файлов
        if ($filesCount <= 10) {
            $this->line('Файлы для удаления:');
            foreach ($logFiles as $file) {
                $sizeKB = round($file->getSize() / 1024, 2);
                $this->line("  - {$file->getFilename()} ({$sizeKB} KB)");
            }
            $this->newLine();
        } else {
            $this->line("Список файлов (показаны первые 10 из {$filesCount}):");
            $shown = 0;
            foreach ($logFiles as $file) {
                if ($shown >= 10) {
                    break;
                }
                $sizeKB = round($file->getSize() / 1024, 2);
                $this->line("  - {$file->getFilename()} ({$sizeKB} KB)");
                $shown++;
            }
            $this->line("  ... и еще " . ($filesCount - 10) . " файл(ов)");
            $this->newLine();
        }

        // Запрашиваем подтверждение, если не указан --force
        if (!$this->option('force')) {
            if (!$this->confirm('Вы уверены, что хотите удалить все логи?', false)) {
                $this->info('Операция отменена.');
                return 0;
            }
        }

        // Удаляем файлы
        $deletedCount = 0;
        $deletedSize = 0;

        foreach ($logFiles as $file) {
            try {
                $fileSize = $file->getSize();
                File::delete($file->getPathname());
                $deletedCount++;
                $deletedSize += $fileSize;
            } catch (\Exception $e) {
                $this->warn("Не удалось удалить файл {$file->getFilename()}: {$e->getMessage()}");
            }
        }

        $deletedSizeMB = round($deletedSize / 1024 / 1024, 2);

        $this->newLine();
        $this->info("✅ Успешно удалено файлов: {$deletedCount}");
        $this->info("✅ Освобождено места: {$deletedSizeMB} MB");

        return 0;
    }
}

