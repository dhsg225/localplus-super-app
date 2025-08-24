-- [2024-12-19 23:20] - List all users in unified authentication system

-- Check if unified auth tables exist
SELECT 
    'Table Existence Check' as check_type,
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('users', 'user_roles', 'admin_profiles', 'consumer_profiles')
ORDER BY tablename;

-- List all users in unified system
SELECT 
    'All Unified Users' as report_type,
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.is_active,
    u.created_at,
    ur.role,
    CASE 
        WHEN ap.user_id IS NOT NULL THEN 'Has Admin Profile'
        WHEN cp.user_id IS NOT NULL THEN 'Has Consumer Profile'
        ELSE 'No Profile'
    END as profile_status
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN admin_profiles ap ON u.id = ap.user_id
LEFT JOIN consumer_profiles cp ON u.id = cp.user_id
ORDER BY u.created_at DESC;

-- Count users by role
SELECT 
    'User Count by Role' as report_type,
    ur.role,
    COUNT(*) as user_count
FROM user_roles ur
GROUP BY ur.role
ORDER BY user_count DESC;

-- List users from auth.users (original Supabase auth)
SELECT 
    'Original Auth Users' as report_type,
    au.id,
    au.email,
    au.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at,
    CASE 
        WHEN u.id IS NOT NULL THEN 'Migrated to Unified'
        ELSE 'NOT MIGRATED'
    END as migration_status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- Show unmigrated users (security risk)
SELECT 
    'SECURITY ALERT - Unmigrated Users' as report_type,
    au.id,
    au.email,
    au.created_at,
    'CAN ACCESS OLD AUTH SYSTEM' as security_risk
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL;

-- Summary statistics
SELECT 
    'Migration Summary' as report_type,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM users) as total_unified_users,
    (SELECT COUNT(*) FROM user_roles) as total_user_roles,
    (SELECT COUNT(*) FROM admin_profiles) as total_admin_profiles,
    (SELECT COUNT(*) FROM consumer_profiles) as total_consumer_profiles,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM users) 
        THEN '✅ ALL USERS MIGRATED'
        ELSE '❌ MIGRATION INCOMPLETE - SECURITY RISK'
    END as migration_status; 