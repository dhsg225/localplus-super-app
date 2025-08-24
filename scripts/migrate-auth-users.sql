-- [2024-12-19 23:15] - Migrate existing auth.users to unified authentication system

-- Step 1: Migrate existing auth.users to users table
INSERT INTO users (id, email, first_name, last_name, phone, avatar_url, is_active, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'firstName', au.raw_user_meta_data->>'first_name', ''),
    COALESCE(au.raw_user_meta_data->>'lastName', au.raw_user_meta_data->>'last_name', ''),
    COALESCE(au.raw_user_meta_data->>'phone', au.phone, ''),
    COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
    true,
    au.created_at,
    NOW()
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM users)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

-- Step 2: Create user roles for existing users (default to consumer)
INSERT INTO user_roles (user_id, role)
SELECT 
    au.id,
    CASE 
        WHEN au.email LIKE '%admin%' OR au.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
        WHEN au.raw_user_meta_data->>'role' = 'partner' THEN 'partner'
        ELSE 'consumer'
    END as role
FROM auth.users au
WHERE au.id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Create admin profiles for admin users
INSERT INTO admin_profiles (user_id, permissions, department)
SELECT 
    ur.user_id,
    ARRAY['view_dashboard', 'manage_businesses'],
    'operations'
FROM user_roles ur
WHERE ur.role = 'admin'
AND ur.user_id NOT IN (SELECT user_id FROM admin_profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Step 4: Create consumer profiles for consumer users
INSERT INTO consumer_profiles (user_id, preferences)
SELECT 
    ur.user_id,
    '{
        "language": "en",
        "currency": "THB",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false,
            "deals": true,
            "events": true,
            "reminders": true
        },
        "dietary": {
            "vegetarian": false,
            "vegan": false,
            "halal": false,
            "glutenFree": false,
            "allergies": []
        },
        "cuisinePreferences": [],
        "priceRange": {"min": 100, "max": 1000},
        "favoriteDistricts": []
    }'::jsonb
FROM user_roles ur
WHERE ur.role = 'consumer'
AND ur.user_id NOT IN (SELECT user_id FROM consumer_profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Step 5: Verify migration
SELECT 
    'Migration Summary' as status,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM users) as total_unified_users,
    (SELECT COUNT(*) FROM user_roles) as total_user_roles,
    (SELECT COUNT(*) FROM admin_profiles) as total_admin_profiles,
    (SELECT COUNT(*) FROM consumer_profiles) as total_consumer_profiles;

-- Step 6: Show any users that might not have been migrated
SELECT 
    'Unmigrated Users' as status,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL; 