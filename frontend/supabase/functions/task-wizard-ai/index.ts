import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input sanitization utility
const sanitizeInput = (input: unknown, maxLength = 2000): string => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).replace(/[<>]/g, '').trim();
};

// Allowed values for validation
const ALLOWED_TASK_TYPES = ['website', 'ecommerce', 'telegram-bot', 'ai-automation', 'other', 'Сайт', 'Интернет-магазин', 'Telegram-бот', 'AI / Автоматизация', 'Другое'];
const ALLOWED_GOALS = ['leads', 'automation', 'service', 'product', 'Больше заявок', 'Меньше рутины', 'Улучшить сервис', 'Запустить продукт'];
const ALLOWED_SCALES = ['small', 'medium', 'startup', 'Малый', 'Средний', 'Стартап'];
const ALLOWED_TIMELINES = ['urgent', 'normal', 'flexible', 'Срочно (1-2 недели)', 'Стандартно (1-2 месяца)', 'Гибко'];

interface WizardInput {
  rawTask: string;
  taskType: string;
  goal: string;
  scale: string;
  timelineCategory: string;
}

interface WizardOutput {
  title: string;
  shortSummary: string;
  steps: string[];
  budgetCategory: string;
  recommendedProduct: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize all inputs
    const rawTask = sanitizeInput(body.rawTask, 2000);
    const taskType = sanitizeInput(body.taskType, 100);
    const goal = sanitizeInput(body.goal, 100);
    const scale = sanitizeInput(body.scale, 50);
    const timelineCategory = sanitizeInput(body.timelineCategory, 100);

    // Validate required field
    if (!rawTask || rawTask.length < 10) {
      return new Response(
        JSON.stringify({ error: "Пожалуйста, опишите задачу подробнее (минимум 10 символов)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (rawTask.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Описание слишком длинное (максимум 2000 символов)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate enum fields (allow empty for optional fields)
    if (taskType && !ALLOWED_TASK_TYPES.some(t => taskType.toLowerCase().includes(t.toLowerCase()))) {
      console.warn('Unknown task type received:', taskType);
    }

    if (goal && !ALLOWED_GOALS.some(g => goal.toLowerCase().includes(g.toLowerCase()))) {
      console.warn('Unknown goal received:', goal);
    }

    const input: WizardInput = {
      rawTask,
      taskType: taskType || 'other',
      goal: goal || 'Не указано',
      scale: scale || 'medium',
      timelineCategory: timelineCategory || 'normal',
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const systemPrompt = `Ты — AI-консультант студии Neeklo. Твоя задача — на основе запроса клиента сформировать структурированное предложение.

ПРАВИЛА:
- Пиши коротко и по делу, деловым стилем
- Ориентируйся на российских предпринимателей без технического образования
- Избегай английских терминов, используй понятные русские слова
- Будь конкретным и практичным

ФОРМАТ ОТВЕТА (строго JSON):
{
  "title": "Краткое название решения до 80 символов",
  "shortSummary": "1-2 предложения простым языком до 160 символов, объясняющие суть решения",
  "steps": ["Этап 1", "Этап 2", "Этап 3", "Этап 4"],
  "budgetCategory": "Базовый бюджет" | "Средний бюджет" | "Расширенный проект",
  "recommendedProduct": "AI-агент под ключ" | "Сайт за 5 дней" | "Интернет-магазин" | "Telegram-бот" | "Автоматизация процессов" | "Комплексная digital-экосистема"
}

ПРОДУКТЫ СТУДИИ:
- AI-агент под ключ — для автоматизации поддержки, заявок, HR
- Сайт за 5 дней — лендинг или корпоративный сайт
- Интернет-магазин — e-commerce с каталогом и оплатой
- Telegram-бот — автоматизация в мессенджере
- Автоматизация процессов — CRM, интеграции, рассылки
- Комплексная digital-экосистема — когда нужно несколько продуктов

БЮДЖЕТНЫЕ КАТЕГОРИИ:
- Базовый бюджет: простые решения, MVP, один канал
- Средний бюджет: стандартные проекты с интеграциями
- Расширенный проект: комплексные решения, много интеграций`;

    const userPrompt = `Клиент описал задачу:
"${input.rawTask}"

Уточнения:
- Тип задачи: ${input.taskType}
- Главная цель: ${input.goal}
- Масштаб бизнеса: ${input.scale}
- Сроки: ${input.timelineCategory}

Сформируй предложение в JSON формате.`;

    console.log('Calling AI Gateway for task-wizard...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуйте через минуту." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Сервис временно недоступен. Попробуйте позже." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from AI");
    }

    console.log('AI Response received for task-wizard');

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    let result: WizardOutput;
    try {
      result = JSON.parse(jsonStr.trim());
    } catch {
      // Fallback if parsing fails
      console.error("Failed to parse AI response:", content);
      result = {
        title: "Индивидуальное решение для вашего бизнеса",
        shortSummary: "На основе вашего запроса мы подберем оптимальное решение. Свяжитесь с нами для детального обсуждения.",
        steps: [
          "Диагностика и сбор требований",
          "Проработка концепции",
          "Разработка и тестирование",
          "Запуск и поддержка",
        ],
        budgetCategory: "Средний бюджет",
        recommendedProduct: input.taskType.includes("агент") || input.taskType.includes("автоматиз")
          ? "AI-агент под ключ"
          : input.taskType.includes("бот") || input.taskType.includes("Telegram")
          ? "Telegram-бот"
          : input.taskType.includes("магазин")
          ? "Интернет-магазин"
          : "Сайт за 5 дней",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("task-wizard-ai error:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка обработки. Попробуйте ещё раз." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
