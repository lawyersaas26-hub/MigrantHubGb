import { useState, useEffect } from 'react';
import { getCurrentUserProfile, type UserProfile, onAuthStateChange } from '../lib/userAuth';
import { supabase } from '../lib/supabase';

export type SubscriptionPlan = 'light_monthly' | 'gold_monthly' | 'business_monthly' | null;

export interface SubscriptionInfo {
    plan: SubscriptionPlan;
    status: string | null;
    hasActiveSubscription: boolean;
    hasGoldOrHigher: boolean;
    hasBusiness: boolean;
}

export function useSubscription() {
    const [subscription, setSubscription] = useState<SubscriptionInfo>({
        plan: null,
        status: null,
        hasActiveSubscription: false,
        hasGoldOrHigher: false,
        hasBusiness: false,
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);

    const loadSubscription = async () => {
        try {
            const profile = await getCurrentUserProfile();
            setUser(profile);
            
            if (profile) {
                const plan = (profile.subscription_plan as SubscriptionPlan) || null;
                const status = profile.subscription_status || null;
                const hasActiveSubscription = status === 'active' && plan !== null;
                const hasGoldOrHigher = hasActiveSubscription && (plan === 'gold_monthly' || plan === 'business_monthly');
                const hasBusiness = hasActiveSubscription && plan === 'business_monthly';

                setSubscription({
                    plan,
                    status,
                    hasActiveSubscription,
                    hasGoldOrHigher,
                    hasBusiness,
                });
            } else {
                setSubscription({
                    plan: null,
                    status: null,
                    hasActiveSubscription: false,
                    hasGoldOrHigher: false,
                    hasBusiness: false,
                });
            }
        } catch (error) {
            console.error('Error loading subscription:', error);
            setSubscription({
                plan: null,
                status: null,
                hasActiveSubscription: false,
                hasGoldOrHigher: false,
                hasBusiness: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscription();

        // Listen for auth state changes
        const authSubscription = onAuthStateChange(() => {
            loadSubscription();
        });

        // Listen for profile updates (in case subscription changes)
        let profileSubscription: any = null;
        
        const setupProfileListener = async () => {
            const profile = await getCurrentUserProfile();
            if (profile?.id) {
                profileSubscription = supabase
                    .channel(`user_profile_changes_${profile.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'user_profiles',
                            filter: `id=eq.${profile.id}`,
                        },
                        () => {
                            loadSubscription();
                        }
                    )
                    .subscribe();
            }
        };

        setupProfileListener();

        return () => {
            authSubscription.unsubscribe();
            if (profileSubscription) {
                profileSubscription.unsubscribe();
            }
        };
    }, []);

    return {
        ...subscription,
        user,
        loading,
        refresh: loadSubscription,
    };
}

