export declare const supabaseAuthService: {
    signUp(email: string, password: string): Promise<import("@supabase/supabase-js").AuthUser>;
    signIn(email: string, password: string): Promise<import("@supabase/supabase-js").AuthUser>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<import("@supabase/supabase-js").AuthUser>;
};
