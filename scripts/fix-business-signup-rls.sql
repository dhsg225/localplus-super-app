-- [2024-12-19] - Fix business RLS policy for signup form
-- The current policy only allows viewing active businesses, but signup form needs to see all businesses

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON businesses;

-- Create a new policy that allows viewing all businesses for signup purposes
CREATE POLICY "Businesses are viewable for signup" ON businesses
    FOR SELECT USING (true);

-- Also create a policy for authenticated users to see their own businesses
CREATE POLICY "Partners can view their businesses" ON businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM partners 
            WHERE partners.business_id = businesses.id 
            AND partners.user_id = auth.uid()
        )
    );

-- Create a policy for admins to see all businesses
CREATE POLICY "Admins can view all businesses" ON businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    ); 