-- Create food_listings table for donation management
CREATE TABLE public.food_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  available_until TIMESTAMP WITH TIME ZONE NOT NULL,
  contact_info TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_analysis table for AI scan results
CREATE TABLE public.food_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  food_name TEXT NOT NULL,
  category TEXT NOT NULL,
  freshness TEXT NOT NULL CHECK (freshness IN ('excellent', 'good', 'fair', 'poor')),
  estimated_expiry TEXT,
  nutritional_value TEXT,
  donation_suitability TEXT NOT NULL CHECK (donation_suitability IN ('excellent', 'good', 'not_recommended')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create impact_metrics table for real-time statistics
CREATE TABLE public.impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('meals_saved', 'waste_reduced', 'donations_completed', 'users_helped')),
  value INTEGER NOT NULL DEFAULT 0,
  unit TEXT, -- e.g., 'meals', 'tons', 'lbs', 'people'
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_activities table for activity tracking
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('donation_created', 'donation_reserved', 'food_scanned', 'donation_completed')),
  description TEXT NOT NULL,
  related_id UUID, -- Reference to food_listing or food_analysis
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for food_listings
CREATE POLICY "Users can view all food listings" ON public.food_listings
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own food listings" ON public.food_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food listings" ON public.food_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food listings" ON public.food_listings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for food_analysis
CREATE POLICY "Users can view their own food analysis" ON public.food_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food analysis" ON public.food_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for impact_metrics (read-only for users)
CREATE POLICY "Users can view impact metrics" ON public.impact_metrics
  FOR SELECT USING (true);

-- Admin policy for impact_metrics updates (service role)
CREATE POLICY "Service role can manage impact metrics" ON public.impact_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for user_activities
CREATE POLICY "Users can view their own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_food_listings_status ON public.food_listings(status);
CREATE INDEX idx_food_listings_user_id ON public.food_listings(user_id);
CREATE INDEX idx_food_listings_available_until ON public.food_listings(available_until);
CREATE INDEX idx_food_analysis_user_id ON public.food_analysis(user_id);
CREATE INDEX idx_impact_metrics_date ON public.impact_metrics(date);
CREATE INDEX idx_impact_metrics_type ON public.impact_metrics(metric_type);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_type ON public.user_activities(activity_type);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_food_listings_updated_at
  BEFORE UPDATE ON public.food_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_metrics_updated_at
  BEFORE UPDATE ON public.impact_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial impact metrics data
INSERT INTO public.impact_metrics (metric_type, value, unit, date) VALUES
  ('meals_saved', 12847, 'meals', CURRENT_DATE),
  ('waste_reduced', 5200, 'lbs', CURRENT_DATE),
  ('donations_completed', 284, 'donations', CURRENT_DATE),
  ('users_helped', 1247, 'people', CURRENT_DATE);