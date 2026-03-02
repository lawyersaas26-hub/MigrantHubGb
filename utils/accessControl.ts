import { getCurrentUserProfile } from '../lib/userAuth';
import { supabase } from '../lib/supabase';

export type SubscriptionPlan = 'light_monthly' | 'gold_monthly' | 'business_monthly' | null;

export interface AccessCheckResult {
    hasAccess: boolean;
    requiredPlan: SubscriptionPlan | 'free';
    reason?: string;
}

/**
 * Free categories that don't require subscription (but only specific topics are free)
 */
export const FREE_CATEGORIES = [
    'education', // Education category (only "Applying to University" topic is free)
    'housing', // Housing category (only "Travel Document" topic is free)
];

/**
 * Free topics/slugs that don't require subscription
 * These are specific topics within free categories
 */
export const FREE_TOPICS = [
    // Housing category - only Travel Document
    'housing-travel-document',
    'travel-document',
    'travel-documents',
    
    // Education category - only Applying to University
    'applying-to-university',
    'university-application',
    'apply-university',
    'applying-university',
    
    // Driving related (can be in any category)
    'driving-licence',
    'driving-licence-uk',
    'uk-driving-licence',
    'driving-theory-test',
    'theory-test',
];

/**
 * Map of category to allowed free topics
 * Only these specific topics are free in these categories
 */
export const CATEGORY_FREE_TOPICS: Record<string, string[]> = {
    'housing': [
        'housing-travel-document',
        'travel-document',
        'travel-documents',
    ],
    'education': [
        'applying-to-university',
        'university-application',
        'apply-university',
        'applying-university',
    ],
};

/**
 * Free routes that don't require subscription
 */
export const FREE_ROUTES = [
    '/driving-instructors', // Driving Instructors list
    '/driving-instructors/', // Any driving instructor detail
];

/**
 * Check if a category is free (doesn't require subscription)
 */
export function isFreeCategory(categoryId: string): boolean {
    return FREE_CATEGORIES.includes(categoryId.toLowerCase());
}

/**
 * Check if a topic slug is free (doesn't require subscription)
 */
export function isFreeTopic(topicSlug: string, categoryId?: string): boolean {
    const slugLower = topicSlug.toLowerCase();
    
    // If category is specified, check category-specific free topics first
    if (categoryId) {
        const categoryLower = categoryId.toLowerCase();
        const categoryFreeTopics = CATEGORY_FREE_TOPICS[categoryLower];
        
        if (categoryFreeTopics) {
            // In housing/education, only specific topics are free
            return categoryFreeTopics.some(freeSlug => 
                slugLower.includes(freeSlug.toLowerCase())
            );
        }
    }
    
    // Check general free topics (like driving-related)
    return FREE_TOPICS.some(freeSlug => 
        slugLower.includes(freeSlug.toLowerCase())
    );
}

/**
 * Check if a route is free (doesn't require subscription)
 */
export function isFreeRoute(route: string): boolean {
    return FREE_ROUTES.some(freeRoute => 
        route.startsWith(freeRoute)
    );
}

/**
 * Helper function to add timeout to async operations
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
        ),
    ]);
}

/**
 * Check if user has access to a category
 */
export async function checkCategoryAccess(categoryId: string): Promise<AccessCheckResult> {
    // Free categories are accessible to everyone
    if (isFreeCategory(categoryId)) {
        return {
            hasAccess: true,
            requiredPlan: 'free',
        };
    }

    // Check user subscription
    try {
        const profile = await withTimeout(getCurrentUserProfile(), 5000);
        
        if (!profile) {
            return {
                hasAccess: false,
                requiredPlan: 'light_monthly',
                reason: 'Please sign in to access this content',
            };
        }

        // First check user_profiles table
        let plan = profile.subscription_plan as SubscriptionPlan;
        let status = profile.subscription_status;

        // If not found in profile, check user_subscriptions table
        if (!status || status !== 'active' || !plan) {
            const { data: { user } } = await withTimeout(supabase.auth.getUser(), 3000);
            if (user) {
                const { data: subscription } = await withTimeout(
                    supabase
                        .from('user_subscriptions')
                        .select('plan_type, status, expires_at')
                        .eq('user_id', user.id)
                        .eq('status', 'active')
                        .order('updated_at', { ascending: false })
                        .limit(1)
                        .maybeSingle(),
                    3000
                );

                if (subscription) {
                    // Check if subscription is not expired
                    const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
                    if (!isExpired) {
                        plan = subscription.plan_type as SubscriptionPlan;
                        status = subscription.status;
                        
                        // Sync to user_profiles table
                        await supabase
                            .from('user_profiles')
                            .update({
                                subscription_plan: plan,
                                subscription_status: status,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', user.id);
                    }
                }
            }
        }

        // Any active subscription grants access
        if (status === 'active' && plan) {
            return {
                hasAccess: true,
                requiredPlan: plan,
            };
        }

        return {
            hasAccess: false,
            requiredPlan: 'light_monthly',
            reason: 'This content requires a subscription',
        };
    } catch (error) {
        console.error('Error checking category access:', error);
        return {
            hasAccess: false,
            requiredPlan: 'light_monthly',
            reason: 'Unable to verify access',
        };
    }
}

/**
 * Check if user has access to a topic
 */
export async function checkTopicAccess(topicSlug: string, categoryId?: string): Promise<AccessCheckResult> {
    // Check if this is a free topic (category-specific check)
    if (isFreeTopic(topicSlug, categoryId)) {
        return {
            hasAccess: true,
            requiredPlan: 'free',
        };
    }

    // Even if category is "free", if topic is not in the free list, require subscription
    // Check user subscription
    try {
        const profile = await withTimeout(getCurrentUserProfile(), 5000);
        
        if (!profile) {
            return {
                hasAccess: false,
                requiredPlan: 'light_monthly',
                reason: 'Please sign in to access this content',
            };
        }

        // First check user_profiles table
        let plan = profile.subscription_plan as SubscriptionPlan;
        let status = profile.subscription_status;

        // If not found in profile, check user_subscriptions table
        if (!status || status !== 'active' || !plan) {
            const { data: { user } } = await withTimeout(supabase.auth.getUser(), 3000);
            if (user) {
                const { data: subscription } = await withTimeout(
                    supabase
                        .from('user_subscriptions')
                        .select('plan_type, status, expires_at')
                        .eq('user_id', user.id)
                        .eq('status', 'active')
                        .order('updated_at', { ascending: false })
                        .limit(1)
                        .maybeSingle(),
                    3000
                );

                if (subscription) {
                    // Check if subscription is not expired
                    const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
                    if (!isExpired) {
                        plan = subscription.plan_type as SubscriptionPlan;
                        status = subscription.status;
                        
                        // Sync to user_profiles table
                        await supabase
                            .from('user_profiles')
                            .update({
                                subscription_plan: plan,
                                subscription_status: status,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', user.id);
                    }
                }
            }
        }

        // Any active subscription grants access
        if (status === 'active' && plan) {
            return {
                hasAccess: true,
                requiredPlan: plan,
            };
        }

        return {
            hasAccess: false,
            requiredPlan: 'light_monthly',
            reason: 'This content requires a subscription',
        };
    } catch (error) {
        console.error('Error checking topic access:', error);
        return {
            hasAccess: false,
            requiredPlan: 'light_monthly',
            reason: 'Unable to verify access',
        };
    }
}

/**
 * Check if a topic can be viewed (but not necessarily accessed)
 * This allows showing topics in lists even if they require subscription
 */
export async function canViewTopic(topicSlug: string, categoryId?: string): Promise<boolean> {
    // All topics can be viewed, but access is controlled separately
    return true;
}

/**
 * Check if user has access to a route (for featured services)
 */
export async function checkRouteAccess(route: string): Promise<AccessCheckResult> {
    // Free routes are accessible to everyone
    if (isFreeRoute(route)) {
        return {
            hasAccess: true,
            requiredPlan: 'free',
        };
    }

    // Check user subscription
    try {
        const profile = await withTimeout(getCurrentUserProfile(), 5000);
        
        if (!profile) {
            return {
                hasAccess: false,
                requiredPlan: 'gold_monthly',
                reason: 'This feature requires a Gold or Business subscription',
            };
        }

        // First check user_profiles table
        let plan = profile.subscription_plan as SubscriptionPlan;
        let status = profile.subscription_status;

        // If not found in profile, check user_subscriptions table
        if (!status || status !== 'active' || !plan) {
            const { data: { user } } = await withTimeout(supabase.auth.getUser(), 3000);
            if (user) {
                const { data: subscription } = await withTimeout(
                    supabase
                        .from('user_subscriptions')
                        .select('plan_type, status, expires_at')
                        .eq('user_id', user.id)
                        .eq('status', 'active')
                        .order('updated_at', { ascending: false })
                        .limit(1)
                        .maybeSingle(),
                    3000
                );

                if (subscription) {
                    // Check if subscription is not expired
                    const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
                    if (!isExpired) {
                        plan = subscription.plan_type as SubscriptionPlan;
                        status = subscription.status;
                        
                        // Sync to user_profiles table
                        await supabase
                            .from('user_profiles')
                            .update({
                                subscription_plan: plan,
                                subscription_status: status,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', user.id);
                    }
                }
            }
        }

        // Gold or Business plan required for featured services
        if (status === 'active' && (plan === 'gold_monthly' || plan === 'business_monthly')) {
            return {
                hasAccess: true,
                requiredPlan: plan,
            };
        }

        return {
            hasAccess: false,
            requiredPlan: 'gold_monthly',
            reason: 'This feature requires a Gold or Business subscription',
        };
    } catch (error) {
        console.error('Error checking route access:', error);
        return {
            hasAccess: false,
            requiredPlan: 'gold_monthly',
            reason: 'Unable to verify access',
        };
    }
}

/**
 * Check if user has any active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
    try {
        const profile = await withTimeout(getCurrentUserProfile(), 5000);
        if (!profile) return false;
        
        // First check user_profiles table
        let status = profile.subscription_status;
        let plan = profile.subscription_plan;

        // If not found in profile, check user_subscriptions table
        if (!status || status !== 'active' || !plan) {
            const { data: { user } } = await withTimeout(supabase.auth.getUser(), 3000);
            if (user) {
                const { data: subscription } = await withTimeout(
                    supabase
                        .from('user_subscriptions')
                        .select('plan_type, status, expires_at')
                        .eq('user_id', user.id)
                        .eq('status', 'active')
                        .order('updated_at', { ascending: false })
                        .limit(1)
                        .maybeSingle(),
                    3000
                );

                if (subscription) {
                    // Check if subscription is not expired
                    const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
                    if (!isExpired) {
                        plan = subscription.plan_type;
                        status = subscription.status;
                        
                        // Sync to user_profiles table
                        await supabase
                            .from('user_profiles')
                            .update({
                                subscription_plan: plan,
                                subscription_status: status,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', user.id);
                    }
                }
            }
        }
        
        return status === 'active' && plan !== null;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
}

