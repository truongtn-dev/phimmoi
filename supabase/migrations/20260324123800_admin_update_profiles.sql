-- Policy to allow admins to update ANY profile
CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy to allow admins to delete ANY profile
CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));
