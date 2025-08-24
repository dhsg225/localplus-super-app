export declare const adminSupabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export { supabase, businessAPI, calculateDistance, type Business, type DiscountOffer, type UserRedemption } from '@shared/services/supabase';
export declare const adminAuth: {
    signUp(email: string, password: string, firstName?: string, lastName?: string): Promise<{
        user: import("@supabase/auth-js").User | null;
        session: import("@supabase/auth-js").Session | null;
    } | {
        user: null;
        session: null;
    }>;
    signIn(email: string, password: string): Promise<{
        user: import("@supabase/auth-js").User;
        session: import("@supabase/auth-js").Session;
        weakPassword?: import("@supabase/auth-js").WeakPassword;
    } | {
        user: null;
        session: null;
        weakPassword?: null;
    }>;
    getCurrentUser(): Promise<import("@supabase/auth-js").User>;
    signOut(): Promise<void>;
    checkAdminRole(userId: string): Promise<boolean>;
};
