-- 02_admin_and_booking_updates.sql
-- This file contains updates for Admin Dashboards and Bookings Flow.

-- ==============================================================================
-- 1. SUPER ADMIN ROLE ENHANCEMENT
-- ==============================================================================
-- Ensure that users with the 'super_admin' role in the profiles table can access everything.

-- We assume a profiles table exists with a 'role' column (e.g. 'tenant', 'owner', 'super_admin').
-- Or 'role' is in auth.users user_metadata. Let's rely on the profiles table for RLS.

-- Example: Profiles table RLS
CREATE POLICY "Super admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

CREATE POLICY "Super admins can modify all profiles"
ON public.profiles FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- Example: Buildings table RLS
CREATE POLICY "Super admins can view all buildings"
ON public.buildings FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Super admins can modify all buildings"
ON public.buildings FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- Example: Rooms table RLS
CREATE POLICY "Super admins can view all rooms"
ON public.rooms FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Super admins can modify all rooms"
ON public.rooms FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- Example: Beds table RLS
CREATE POLICY "Super admins can view all beds"
ON public.beds FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Super admins can modify all beds"
ON public.beds FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- ==============================================================================
-- 2. BOOKINGS TABLE UPDATES & RLS
-- ==============================================================================

-- If bookings table doesn't exist, create it (id, tenant_id, bed_id, status, start_date, end_date, total_amount, created_at, updated_at).
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    bed_id UUID REFERENCES public.beds(id) ON DELETE CASCADE,
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    start_date DATE NOT NULL,
    end_date DATE,
    rent_amount NUMERIC(10, 2) NOT NULL,
    deposit_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Tenants can insert their own bookings
CREATE POLICY "Tenants can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK ( auth.uid() = tenant_id );

-- Tenants can view their own bookings
CREATE POLICY "Tenants can view their own bookings"
ON public.bookings FOR SELECT
USING ( auth.uid() = tenant_id );

-- Super admins can view and manage all bookings
CREATE POLICY "Super admins can view all bookings"
ON public.bookings FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Super admins can manage all bookings"
ON public.bookings FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- ==============================================================================
-- 3. ADMIN STATS RPC FUNCTION
-- ==============================================================================
-- Create an RPC to fetch aggregated stats for the admin dashboard.

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_users INT;
  total_buildings INT;
  total_bookings INT;
  active_tenants INT;
  monthly_revenue NUMERIC;
BEGIN
  -- Check if user is super admin
  IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT COUNT(*) INTO total_users FROM public.profiles;
  SELECT COUNT(*) INTO total_buildings FROM public.buildings;
  SELECT COUNT(*) INTO total_bookings FROM public.bookings;
  SELECT COUNT(*) INTO active_tenants FROM public.profiles WHERE role = 'tenant';
  
  -- Calculate approximate monthly revenue based on confirmed bookings for current month
  -- (Assuming payments or bookings table tracking this)
  SELECT COALESCE(SUM(rent_amount), 0) INTO monthly_revenue 
  FROM public.bookings 
  WHERE status = 'confirmed';

  RETURN json_build_object(
    'total_users', total_users,
    'total_buildings', total_buildings,
    'total_bookings', total_bookings,
    'active_tenants', active_tenants,
    'monthly_revenue', monthly_revenue
  );
END;
$$;
