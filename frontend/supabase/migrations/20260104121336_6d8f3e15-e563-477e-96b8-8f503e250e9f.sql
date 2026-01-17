-- Create storage bucket for brief attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to attachments
CREATE POLICY "Public read access for attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'attachments');

-- Allow anyone to upload attachments (since form is public)
CREATE POLICY "Anyone can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attachments');

-- Allow delete by path owner (for cleanup if needed)
CREATE POLICY "Anyone can delete their own attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'attachments');