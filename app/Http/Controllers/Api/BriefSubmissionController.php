<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BriefSubmission;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BriefSubmissionController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Store a newly created brief submission.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'role' => 'required|string|max:255',
            'project_name' => 'nullable|string|max:255',
            'description' => 'required|string|min:10',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'files' => 'nullable|array',
            'files.*' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $submission = BriefSubmission::create([
                'name' => $request->name,
                'company' => $request->company,
                'role' => $request->role,
                'project_name' => $request->project_name,
                'description' => $request->description,
                'phone' => $request->phone,
                'email' => $request->email,
                'files' => $request->files ?? [],
            ]);

            // Отправка в Telegram
            $this->sendToTelegram($submission);

            return response()->json([
                'success' => true,
                'message' => 'Заявка успешно отправлена!',
                'data' => $submission,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Brief submission error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при сохранении заявки',
            ], 500);
        }
    }

    /**
     * Upload files for brief submission.
     */
    public function uploadFiles(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array|max:5',
            'files.*' => 'file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx',
            'submission_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $submissionId = $request->submission_id ?? Str::uuid()->toString();
            $uploadedFiles = [];

            foreach ($request->file('files') as $file) {
                $fileExt = $file->getClientOriginalExtension();
                $fileName = Str::random(40) . '.' . $fileExt;
                $filePath = "brief_submissions/{$submissionId}/{$fileName}";

                // Сохраняем файл в storage
                $path = $file->storeAs("brief_submissions/{$submissionId}", $fileName, 'public');

                // Получаем публичный URL
                $url = Storage::url($path);

                $uploadedFiles[] = [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType(),
                    'url' => url($url),
                ];
            }

            return response()->json([
                'success' => true,
                'files' => $uploadedFiles,
            ], 200);
        } catch (\Exception $e) {
            Log::error('File upload error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при загрузке файлов',
            ], 500);
        }
    }

    /**
     * Send simple message to Telegram (without saving to DB).
     */
    public function sendTelegramMessage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'role' => 'required|string|max:255',
            'description' => 'required|string|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $botToken = config('telegram.bot_token');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$botToken || !$chatId) {
            Log::warning('Telegram credentials not configured');
            return response()->json([
                'success' => false,
                'message' => 'Telegram не настроен',
            ], 500);
        }

        $message = $this->formatSimpleTelegramMessage($request->all());

        $result = $this->telegramService->sendMessage($botToken, $chatId, $message, [
            'parse_mode' => 'Markdown',
        ]);

        if (!$result['success']) {
            Log::error('Failed to send message to Telegram', [
                'error' => $result['message'] ?? 'Unknown error',
            ]);
            return response()->json([
                'success' => false,
                'message' => $result['message'] ?? 'Ошибка отправки в Telegram',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Сообщение отправлено',
        ], 200);
    }

    /**
     * Send brief submission to Telegram.
     */
    protected function sendToTelegram(BriefSubmission $submission): void
    {
        $botToken = config('telegram.bot_token');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$botToken || !$chatId) {
            Log::warning('Telegram credentials not configured');
            return;
        }

        $message = $this->formatTelegramMessage($submission);

        $result = $this->telegramService->sendMessage($botToken, $chatId, $message, [
            'parse_mode' => 'Markdown',
        ]);

        if (!$result['success']) {
            Log::error('Failed to send brief submission to Telegram', [
                'submission_id' => $submission->id,
                'error' => $result['message'] ?? 'Unknown error',
            ]);
        }
    }

    /**
     * Format message for Telegram.
     */
    protected function formatTelegramMessage(BriefSubmission $submission): string
    {
        $date = $submission->created_at->format('d.m.Y H:i');
        $filesCount = count($submission->files ?? []);

        $message = "📋 *Новая заявка с сайта*\n\n";
        $message .= "👤 *Имя:* {$submission->name}\n";
        
        if ($submission->company) {
            $message .= "🏢 *Компания:* {$submission->company}\n";
        }
        
        $message .= "💼 *Роль:* {$submission->role}\n";
        
        if ($submission->project_name) {
            $message .= "📁 *Проект:* {$submission->project_name}\n";
        }
        
        $message .= "📞 *Телефон:* {$submission->phone}\n";
        $message .= "📧 *Email:* {$submission->email}\n";
        $message .= "📝 *Описание:*\n{$submission->description}\n";
        
        if ($filesCount > 0) {
            $message .= "\n📎 *Файлов прикреплено:* {$filesCount}";
        }
        
        $message .= "\n\n🕐 *Дата:* {$date}";

        return $message;
    }

    /**
     * Format simple message for Telegram (without submission).
     */
    protected function formatSimpleTelegramMessage(array $data): string
    {
        $date = now()->format('d.m.Y H:i');
        
        $message = "📋 *{$data['role']}*\n\n";
        $message .= "👤 *Имя:* {$data['name']}\n";
        $message .= "📞 *Телефон:* {$data['phone']}\n";
        
        if (!empty($data['email'])) {
            $message .= "📧 *Email:* {$data['email']}\n";
        }
        
        $message .= "📝 *Сообщение:*\n{$data['description']}\n";
        $message .= "\n🕐 *Дата:* {$date}";

        return $message;
    }
}
