-- Fix user_roles bootstrap vulnerability: Add secure INSERT policy
-- Only existing admins can insert new roles (bootstrap via Supabase dashboard)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));