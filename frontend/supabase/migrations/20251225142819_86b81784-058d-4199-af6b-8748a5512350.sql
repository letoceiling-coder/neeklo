-- Исправление безопасности таблицы brief_submissions
-- Блокируем чтение данных для всех (только INSERT разрешён анонимным)

-- Удаляем старую политику если есть
DROP POLICY IF EXISTS "Allow anonymous submissions" ON public.brief_submissions;
DROP POLICY IF EXISTS "Users can view their own briefs" ON public.brief_submissions;
DROP POLICY IF EXISTS "Admin can read all briefs" ON public.brief_submissions;
DROP POLICY IF EXISTS "Prevent updates" ON public.brief_submissions;
DROP POLICY IF EXISTS "Prevent deletes" ON public.brief_submissions;

-- Создаём безопасные политики
-- Только INSERT разрешён для анонимных пользователей (отправка заявок)
CREATE POLICY "Allow anonymous insert only"
ON public.brief_submissions
FOR INSERT
WITH CHECK (true);

-- Полностью блокируем SELECT для публичных пользователей
-- Данные доступны только через backend/edge functions
CREATE POLICY "Block all reads"
ON public.brief_submissions
FOR SELECT
USING (false);

-- Блокируем UPDATE
CREATE POLICY "Block all updates"
ON public.brief_submissions
FOR UPDATE
USING (false);

-- Блокируем DELETE
CREATE POLICY "Block all deletes"
ON public.brief_submissions
FOR DELETE
USING (false);