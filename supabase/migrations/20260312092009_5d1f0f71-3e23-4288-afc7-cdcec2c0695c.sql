
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL DEFAULT 'home_top',
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Everyone can view active banners
CREATE POLICY "Banners viewable by everyone" ON public.banners
  FOR SELECT TO public USING (true);

-- Only admins can manage banners
CREATE POLICY "Admins can insert banners" ON public.banners
  FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update banners" ON public.banners
  FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete banners" ON public.banners
  FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
