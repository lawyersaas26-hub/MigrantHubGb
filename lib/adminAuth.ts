import { supabase } from './supabase';

export interface AdminUser {
    id: string;
    email: string;
}

// Check if current user is an admin
export async function isAdmin(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        return !error && !!data;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Sign in admin
export async function signInAdmin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    // Verify user is admin
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
        await supabase.auth.signOut();
        throw new Error('User is not an admin');
    }

    return data;
}

// Sign up admin - automatically adds user to admin_users table
export async function signUpAdmin(email: string, password: string) {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    // Automatically add user to admin_users table
    const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
            id: data.user.id,
            email: data.user.email || email,
        });

    if (adminError) {
        // If insert fails, try to clean up the auth user
        console.error('Error adding user to admin_users:', adminError);
        // Note: We can't delete the auth user from client side, but the insert might have succeeded
        // even if there was an error (duplicate check). Let's throw a helpful error.
        throw new Error('Failed to register as admin. User may already exist.');
    }

    return data;
}

// Sign out admin
export async function signOutAdmin() {
    return await supabase.auth.signOut();
}

// Get current admin user
export async function getCurrentAdmin(): Promise<AdminUser | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('admin_users')
            .select('id, email')
            .eq('id', user.id)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            email: data.email,
        };
    } catch (error) {
        console.error('Error getting current admin:', error);
        return null;
    }
}

// Check authentication status
export async function getAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
        isAuthenticated: !!session,
        user: session?.user || null,
    };
}

