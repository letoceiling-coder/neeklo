import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input sanitization utility
const sanitizeInput = (input: unknown, maxLength = 5000): string => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).replace(/[<>]/g, '').trim();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize input
    const userInput = sanitizeInput(body.userInput, 5000);
    
    if (!userInput || userInput.length < 20) {
      return new Response(
        JSON.stringify({ error: 'Пожалуйста, опишите ваш проект подробнее (минимум 20 символов)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (userInput.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Описание слишком длинное (максимум 5000 символов)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    const systemPrompt = `Ты профессиональный product manager и tech consultant в digital-студии Neeklo Studio. 
На основе краткого описания проекта от клиента, сгенерируй профессиональный бриф.

Ответ ОБЯЗАТЕЛЬНО в JSON формате (только JSON, без markdown):
{
  "project_summary": "Краткое описание проекта и его цели (2-3 предложения)",
  "technical_requirements": "Технические требования и стек (bullet points через \\n)",
  "timeline_budget": "Примерные сроки и бюджетная вилка",
  "deliverables": "Ожидаемые результаты и артефакты (bullet points через \\n)"
}

Будь конкретен, практичен, отвечай на русском языке. Не добавляй лишний текст вне JSON.`;

    console.log('Calling Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Слишком много запросов. Пожалуйста, подождите немного.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Сервис временно недоступен. Попробуйте позже.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI service error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty AI response');
    }

    console.log('AI Response received:', content.substring(0, 200));

    // Parse JSON from response (handle potential markdown code blocks)
    let briefData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        briefData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback structure
      briefData = {
        project_summary: content,
        technical_requirements: 'Требуется уточнение',
        timeline_budget: 'Обсуждается индивидуально',
        deliverables: 'Определяется после консультации'
      };
    }

    return new Response(
      JSON.stringify({
        briefId: crypto.randomUUID(),
        ...briefData,
        generatedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-brief:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при генерации брифа. Попробуйте ещё раз.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
