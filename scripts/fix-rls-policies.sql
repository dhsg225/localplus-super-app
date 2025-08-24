-- [2024-12-19 22:30] - Fix infinite recursion in RLS policies

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;

-- Create simpler, non-recursive policies
CREATE POLICY "Users can view own admin profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own admin profile" ON admin_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own admin profile" ON admin_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For user_roles, allow users to view their own roles
CREATE POLICY "Users can insert own roles" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: For admin management of roles, we'll handle this in the application layer
-- rather than RLS to avoid recursion issues 