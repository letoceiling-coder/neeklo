import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input sanitization and validation utilities
const sanitizeInput = (input: unknown, maxLength = 2000): string => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).replace(/[<>]/g, '').trim();
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validateContact = (contact: string): boolean => {
  // Allow phone: digits, spaces, dashes, parentheses, plus sign
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  const isPhone = phoneRegex.test(contact) && contact.length >= 5 && contact.length <= 30;
  
  // Allow Telegram username: @username or username
  const telegramRegex = /^@?[a-zA-Z0-9_]{3,32}$/;
  const isTelegram = telegramRegex.test(contact);
  
  return isPhone || isTelegram;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials not configured');
      throw new Error('Telegram service not configured');
    }

    let message: string;

    // Check if it's a simplified contact form submission
    if (body.name && body.phone && body.description && !body.briefData) {
      // Validate and sanitize inputs
      const name = sanitizeInput(body.name, 100);
      const phone = sanitizeInput(body.phone, 30);
      const description = sanitizeInput(body.description, 2000);
      const email = body.email ? sanitizeInput(body.email, 255) : '';
      const role = body.role ? sanitizeInput(body.role, 50) : '';

      // Validate required fields
      if (!name || name.length < 2) {
        return new Response(
          JSON.stringify({ error: 'Имя должно содержать минимум 2 символа' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!validateContact(phone)) {
        return new Response(
          JSON.stringify({ error: 'Некорректный формат контакта' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!description || description.length < 5) {
        return new Response(
          JSON.stringify({ error: 'Описание должно содержать минимум 10 символов' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (email && !validateEmail(email)) {
        return new Response(
          JSON.stringify({ error: 'Некорректный формат email' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // New simplified contact form format
      message = `🆕 *Новая заявка с сайта*

👤 *Имя:* ${name}
📱 *Контакт:* ${phone}
${email ? `📧 *Email:* ${email}` : ''}
${role ? `💼 *Тип:* ${role}` : ''}

📝 *Описание задачи:*
${description}

━━━━━━━━━━━━━━━━━━━━
🕐 _${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}_`;
    } else if (body.briefData) {
      // Old brief format with AI-generated content
      const userInput = sanitizeInput(body.userInput, 2000);
      const briefData = body.briefData;
      
      // Sanitize all brief data fields
      const projectSummary = sanitizeInput(briefData.project_summary, 1000);
      const technicalRequirements = sanitizeInput(briefData.technical_requirements, 1000);
      const timelineBudget = sanitizeInput(briefData.timeline_budget, 500);
      const deliverables = sanitizeInput(briefData.deliverables, 1000);

      message = `🆕 *Новая заявка на проект*

📝 *Исходное описание:*
${userInput || 'Не указано'}

━━━━━━━━━━━━━━━━━━━━

📋 *Описание проекта:*
${projectSummary || 'Не указано'}

⚙️ *Технические требования:*
${technicalRequirements || 'Не указано'}

📅 *Таймлайн и бюджет:*
${timelineBudget || 'Не указано'}

🎯 *Ожидаемые результаты:*
${deliverables || 'Не указано'}

━━━━━━━━━━━━━━━━━━━━
🕐 _${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}_`;
    } else {
      // Reject unknown request formats instead of exposing raw data
      console.warn('Unknown request format received');
      return new Response(
        JSON.stringify({ error: 'Неверный формат данных' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending message to Telegram...');

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      throw new Error(result.description || 'Telegram send failed');
    }

    console.log('Message sent successfully to Telegram');

    return new Response(
      JSON.stringify({ success: true, message: 'Заявка успешно отправлена!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-telegram:', error);
    return new Response(
      JSON.stringify({ error: 'Не удалось отправить в Telegram. Попробуйте позже.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
