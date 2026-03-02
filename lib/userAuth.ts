import { supabase, Subscription } from './supabase';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    subscription_plan?: string;
    subscription_status?: string;
    created_at: string;
    updated_at: string;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Get user profile from user_profiles table
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            // If profile doesn't exist, create it
            if (error.code === 'PGRST116') {
                console.log('User profile not found, creating one...');
                const { data: newProfile, error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        email: user.email || '',
                        full_name: user.user_metadata?.full_name || null,
                        avatar_url: user.user_metadata?.avatar_url || null,
                        subscription_plan: null,
                        subscription_status: 'inactive',
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating user profile:', insertError);
                    // Return basic profile if insert fails
                    return {
                        id: user.id,
                        email: user.email || '',
                        full_name: user.user_metadata?.full_name || null,
                        avatar_url: user.user_metadata?.avatar_url || null,
                        created_at: user.created_at,
                        updated_at: user.updated_at || user.created_at,
                    };
                }
                return newProfile;
            }
            // Return basic profile if other error
            return {
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || null,
                avatar_url: user.user_metadata?.avatar_url || null,
                created_at: user.created_at,
                updated_at: user.updated_at || user.created_at,
            };
        }

        // Check user_subscriptions table to sync subscription data
        if (profile) {
            try {
                const { data: subscription } = await supabase
                    .from('user_subscriptions')
                    .select('plan_type, status, expires_at')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (subscription) {
                    // Check if subscription is not expired
                    const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
                    if (!isExpired) {
                        // If subscription in user_subscriptions is different or missing in profile, sync it
                        if (profile.subscription_plan !== subscription.plan_type || 
                            profile.subscription_status !== subscription.status) {
                            // Update user_profiles with subscription data
                            const { error: updateError } = await supabase
                                .from('user_profiles')
                                .update({
                                    subscription_plan: subscription.plan_type,
                                    subscription_status: subscription.status,
                                    updated_at: new Date().toISOString(),
                                })
                                .eq('id', user.id);

                            if (!updateError) {
                                // Return updated profile
                                return {
                                    ...profile,
                                    subscription_plan: subscription.plan_type,
                                    subscription_status: subscription.status,
                                };
                            }
                        } else {
                            // Already synced, return profile as is
                            return profile;
                        }
                    } else if (profile.subscription_status === 'active') {
                        // Subscription expired, update profile
                        await supabase
                            .from('user_profiles')
                            .update({
                                subscription_status: 'expired',
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', user.id);
                        
                        return {
                            ...profile,
                            subscription_status: 'expired',
                        };
                    }
                } else if (profile.subscription_plan && profile.subscription_status === 'active') {
                    // Profile has subscription but not in user_subscriptions - try to sync
                    // This shouldn't happen, but handle it gracefully
                    console.warn('Profile has subscription but not found in user_subscriptions');
                }
            } catch (subError) {
                console.error('Error checking user_subscriptions:', subError);
                // Continue with profile data if subscription check fails
            }
        }

        return profile;
    } catch (error) {
        console.error('Error getting current user profile:', error);
        return null;
    }
}

// Sign out user
export async function signOutUser(): Promise<void> {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Auth state change listener
export function onAuthStateChange(callback: (user: any) => void): Subscription {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });

    return data.subscription;
}

// Sign in user with email and password
export async function signInUser(email: string, password: string): Promise<void> {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<void> {
    try {
        // Check if we're in a native Capacitor app
        const { Capacitor } = await import('@capacitor/core');
        const isNative = Capacitor.isNativePlatform();

        let redirectUrl: string;

        if (isNative) {
            // Use app's custom URL scheme for native apps
            redirectUrl = 'com.migranthubGBv3.app://';
        } else {
            // Use environment variable if set, otherwise use current origin
            // Remove trailing slash for consistency
            const baseUrl = window.location.origin;
            redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL || `${baseUrl}/`;
            
            // Ensure it ends with / for proper redirect handling
            if (!redirectUrl.endsWith('/')) {
                redirectUrl = `${redirectUrl}/`;
            }
        }

        console.log('OAuth redirect URL:', redirectUrl, 'isNative:', isNative);

        if (isNative) {
            // For native apps, use Capacitor Browser plugin to open OAuth in-app
            const { Browser } = await import('@capacitor/browser');

            // Get the OAuth URL from Supabase
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true, // Don't open browser automatically - we'll use Capacitor Browser
                    queryParams: {
                        // Force the redirect URL to be our custom scheme
                        redirect_to: redirectUrl,
                    },
                },
            });

            if (error) throw error;

            if (data?.url) {
                // Replace any Vercel URLs in the OAuth URL with our custom scheme
                let oauthUrl = data.url;

                console.log('Original OAuth URL from Supabase:', oauthUrl);

                // Parse the URL to modify redirect_to parameter
                try {
                    const urlObj = new URL(oauthUrl);

                    // Force set redirect_to to our custom scheme
                    urlObj.searchParams.set('redirect_to', redirectUrl);

                    // Also check for redirect_to in the hash or other places
                    oauthUrl = urlObj.toString();

                    // Replace any Vercel URLs that might be in the URL string itself
                    oauthUrl = oauthUrl.replace(
                        /migranthubtest\.vercel\.app/gi,
                        'com.migranthubGBv3.app'
                    );

                    // Ensure redirect_to parameter uses our custom scheme
                    oauthUrl = oauthUrl.replace(
                        /redirect_to=([^&]*)/gi,
                        `redirect_to=${encodeURIComponent(redirectUrl)}`
                    );

                } catch (e) {
                    console.warn('Could not parse OAuth URL, using as-is:', e);
                }

                console.log('Modified OAuth URL:', oauthUrl);
                console.log('Redirect URL set to:', redirectUrl);

                // Open OAuth URL in Capacitor Browser (in-app browser)
                // The Browser will handle the redirect to our deep link, which will trigger the app
                console.log('Opening OAuth URL in Browser:', oauthUrl);
                
                try {
                    await Browser.open({
                        url: oauthUrl,
                        presentationStyle: 'popover',
                    });
                    console.log('Browser opened successfully');
                } catch (browserError) {
                    console.error('Error opening browser:', browserError);
                    throw browserError;
                }

                // Note: The deep link handler in App.tsx will handle the callback
                // when the browser redirects to com.migranthubGBv3.app://
            } else {
                throw new Error('No OAuth URL returned from Supabase');
            }
        } else {
            // For web, use standard OAuth flow
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                },
            });

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
}

// Sign up user
export async function signUpUser(email: string, password: string, fullName?: string): Promise<void> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || null,
                },
            },
        });

        if (error) throw error;
        
        // Ensure user profile is created (trigger might not fire immediately)
        if (data.user) {
            // Wait a moment for trigger to fire, then check
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Immediately try to create profile (don't wait for trigger)
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('id')
                    .eq('id', data.user.id)
                    .maybeSingle();
                
                if (!profile) {
                    // Profile doesn't exist, create it immediately
                    const { error: insertError } = await supabase
                        .from('user_profiles')
                        .insert({
                            id: data.user.id,
                            email: data.user.email || email,
                            full_name: fullName || null,
                            avatar_url: null,
                            subscription_plan: null,
                            subscription_status: 'inactive',
                        });
                    
                    if (insertError) {
                        console.error('Error creating user profile during signup:', insertError);
                        // Try again after a delay as fallback
                        setTimeout(async () => {
                            const { error: retryError } = await supabase
                                .from('user_profiles')
                                .insert({
                                    id: data.user.id,
                                    email: data.user.email || email,
                                    full_name: fullName || null,
                                    avatar_url: null,
                                    subscription_plan: null,
                                    subscription_status: 'inactive',
                                });
                            if (!retryError) {
                                console.log('User profile created successfully on retry');
                            }
                        }, 2000);
                    } else {
                        console.log('User profile created successfully during signup');
                    }
                } else {
                    console.log('User profile already exists (created by trigger)');
                }
            } catch (error) {
                console.error('Error ensuring user profile exists:', error);
            }
        }
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}