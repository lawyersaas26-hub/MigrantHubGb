import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Settings, Info, LogOut, LogIn, UserPlus, Check, Crown, Briefcase, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getCurrentUserProfile, signOutUser, isAuthenticated } from '../lib/userAuth';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/userAuth';

interface UserSubscription {
    id: string;
    user_id: string;
    plan_type: string;
    status: string;
    expires_at: string;
    purchase_date: string;
}

const Account: React.FC = () => {
    const { translations, language } = useTranslations();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'light' | 'gold' | 'business'>('light');
    const isRTL = language === 'ku' || language === 'ar';

    useEffect(() => {
        checkAuth();

        // Handle OAuth callback - check for session in URL hash
        const handleOAuthCallback = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Ensure profile exists for OAuth users
                try {
                    await getCurrentUserProfile();
                } catch (error) {
                    console.error('Error ensuring user profile exists:', error);
                }
                await loadUserProfile();
            }
        };

        handleOAuthCallback();

        // Check for subscription success
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('subscription') === 'success') {
            // Refresh profile to show new subscription status
            loadUserProfile();
            // Clear query param
            window.history.replaceState({}, '', window.location.pathname);
        }

        // Listen to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Ensure profile exists when user signs in (especially for OAuth)
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    try {
                        await getCurrentUserProfile();
                    } catch (error) {
                        console.error('Error ensuring user profile exists on auth change:', error);
                    }
                }
                await loadUserProfile();
            } else {
                setUser(null);
            }
        });

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const checkAuth = async () => {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            setLoading(false);
            return;
        }
        await loadUserProfile();
    };

    const loadUserProfile = async () => {
        try {
            const profile = await getCurrentUserProfile();
            setUser(profile);

            // Load subscription details if user is authenticated
            if (profile?.id) {
                // First try to load from user_subscriptions table (most recent first)
                const { data: subData, error: subError } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .eq('user_id', profile.id)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                console.log('Subscription query result:', { subData, subError, userId: profile.id, profileSubscription: profile.subscription_plan, profileStatus: profile.subscription_status });

                // Check both tables and use the most reliable source
                let finalSubscription: UserSubscription | null = null;

                if (!subError && subData) {
                    // Check if subscription is active (not expired)
                    const isExpired = subData.expires_at && new Date(subData.expires_at) < new Date();
                    const isActive = subData.status === 'active' && !isExpired;

                    if (isActive) {
                        console.log('Active subscription loaded from user_subscriptions:', subData);
                        finalSubscription = subData;
                    } else {
                        console.log('Subscription found but not active:', { status: subData.status, isExpired, expires_at: subData.expires_at });
                    }
                }

                // If no active subscription from user_subscriptions, check user_profiles
                if (!finalSubscription && profile.subscription_plan && profile.subscription_status === 'active') {
                    console.log('Using subscription from user_profiles:', profile.subscription_plan);
                    finalSubscription = {
                        id: subData?.id || profile.id,
                        user_id: profile.id,
                        plan_type: profile.subscription_plan,
                        status: profile.subscription_status,
                        expires_at: subData?.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        purchase_date: subData?.purchase_date || profile.updated_at || profile.created_at,
                    };

                    // Try to sync to user_subscriptions if it exists there but wasn't active
                    if (subData && subData.status !== 'active') {
                        await supabase
                            .from('user_subscriptions')
                            .update({
                                status: 'active',
                                plan_type: profile.subscription_plan,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('user_id', profile.id);
                    }
                }

                if (finalSubscription) {
                    setSubscription(finalSubscription);
                    // Set active tab based on subscription plan
                    if (finalSubscription.plan_type === 'light_monthly') {
                        setActiveTab('light');
                    } else if (finalSubscription.plan_type === 'gold_monthly') {
                        setActiveTab('gold');
                    } else if (finalSubscription.plan_type === 'business_monthly') {
                        setActiveTab('business');
                    }
                } else {
                    console.log('No active subscription found in either table');
                    setSubscription(null);
                }

                // Check Admin Status
                const { data: adminData } = await supabase
                    .from('admin_users')
                    .select('id')
                    .eq('id', profile.id)
                    .maybeSingle();

                setIsAdmin(!!adminData);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser();
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleRestorePurchases = async () => {
        setLoading(true);
        try {
            if (!user?.id) {
                alert(language === 'ku' ? 'تکایە چوونەژوورەوە بکە' : language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please sign in first');
                setLoading(false);
                return;
            }

            const { restorePurchases } = await import('../utils/purchases');
            const ownedProducts = await restorePurchases();

            if (ownedProducts.length > 0) {
                // Ensure user profile exists first
                const { data: existingProfile } = await supabase
                    .from('user_profiles')
                    .select('id')
                    .eq('id', user.id)
                    .maybeSingle();

                if (!existingProfile) {
                    console.log('User profile not found, creating one...');
                    await supabase
                        .from('user_profiles')
                        .insert({
                            id: user.id,
                            email: user.email || '',
                            full_name: user.full_name || null,
                            avatar_url: user.avatar_url || null,
                            subscription_plan: null,
                            subscription_status: 'inactive',
                        });
                }

                // Save each owned product to database
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + 1);

                for (const productId of ownedProducts) {
                    // Save to user_subscriptions table
                    await supabase
                        .from('user_subscriptions')
                        .upsert({
                            user_id: user.id,
                            plan_type: productId,
                            status: 'active',
                            purchase_date: new Date().toISOString(),
                            expires_at: expiresAt.toISOString(),
                            updated_at: new Date().toISOString(),
                        }, {
                            onConflict: 'user_id'
                        });

                    // Update user profile
                    await supabase
                        .from('user_profiles')
                        .update({
                            subscription_plan: productId,
                            subscription_status: 'active',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', user.id);
                }

                // Refresh profile to update UI
                await loadUserProfile();
                alert(language === 'ku' ? 'بەشداریکردنەکان گەڕێندرانەوە' : language === 'ar' ? 'تم استعادة المشتريات' : 'Purchases restored successfully');
            } else {
                alert(language === 'ku' ? 'هیچ بەشداریکردنێک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على مشتريات' : 'No purchases found to restore');
            }
        } catch (error) {
            console.error('Error restoring purchases:', error);
            alert(language === 'ku' ? 'هەڵەیەک ڕوویدا' : language === 'ar' ? 'حدث خطأ' : 'Error restoring purchases');
        } finally {
            setLoading(false);
        }
    };

    const accountTranslations = {
        ku: {
            user: 'بەکارهێنەر',
            guest: 'میوان',
            settings: 'ڕێکخستنەکان',
            about: 'دەربارە',
            signOut: 'دەرچوون',
            signIn: 'چوونەژوورەوە',
            signUp: 'دروستکردنی هەژمار',
            welcomeGuest: 'بەخێربێیت بۆ هەژمارەکەت',
            signInPrompt: 'چوونەژوورەوە بکە بۆ بینینی هەژمارەکەت',
        },
        ar: {
            user: 'المستخدم',
            guest: 'ضيف',
            settings: 'الإعدادات',
            about: 'حول',
            signOut: 'تسجيل الخروج',
            signIn: 'تسجيل الدخول',
            signUp: 'إنشاء حساب',
            welcomeGuest: 'مرحبًا بك في حسابك',
            signInPrompt: 'قم بتسجيل الدخول لعرض حسابك',
        },
        en: {
            user: 'User',
            guest: 'Guest',
            settings: 'Settings',
            about: 'About',
            signOut: 'Sign Out',
            signIn: 'Sign In',
            signUp: 'Create Account',
            welcomeGuest: 'Welcome to Your Account',
            signInPrompt: 'Sign in to view your account',
        },
    };

    const t = accountTranslations[language] || accountTranslations.en;

    if (loading) {
        return (
            <div className="px-5 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">
                        {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="px-5 py-8">
                {/* Guest Profile Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-black/8 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 mb-6 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-4 ring-indigo-50 dark:ring-slate-700">
                            <UserCircle size={44} color="white" strokeWidth={2.5} fill="white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {t.welcomeGuest}
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                {t.guest}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sign In/Sign Up Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} strokeWidth={2.5} />
                        <span>{t.signIn}</span>
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <UserPlus size={20} strokeWidth={2.5} />
                        <span>{t.signUp}</span>
                    </button>
                </div>

                {/* Settings Section */}
                <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-300">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                                <Info size={22} className="text-slate-600 dark:text-slate-400" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                {t.about}
                            </span>
                        </div>
                        <div className={isRTL ? 'pr-14' : 'pl-14'}>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                {language === 'ku'
                                    ? 'Migrant Hub GB'
                                    : language === 'ar'
                                        ? 'Migrant Hub GB'
                                        : 'Migrant Hub GB'
                                }
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                v1.0.0
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-5 py-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 mb-6 transition-all duration-300">
                <div className="flex items-center gap-4">
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-indigo-50/80 dark:ring-slate-700"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 ring-4 ring-indigo-50/80 dark:ring-slate-700">
                            <UserCircle size={44} color="white" strokeWidth={2.5} fill="white" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {user.full_name || user.email || translations.welcomeUser}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            {user.email || t.user}
                        </p>
                    </div>
                </div>
            </div>

            {/* Subscription Plans Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 mb-6 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {subscription?.status === 'active'
                        ? (language === 'ku' ? 'پلانی بەشداریکردن' : language === 'ar' ? 'خطة الاشتراك' : 'Your Subscription Plan')
                        : (language === 'ku' ? 'پلانەکانی بەشداریکردن' : language === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans')
                    }
                </h3>
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                        <p>Subscription: {subscription ? JSON.stringify({ plan: subscription.plan_type, status: subscription.status }) : 'null'}</p>
                        <p>Active Tab: {activeTab}</p>
                    </div>
                )}

                {/* Tabs - Only show if user doesn't have active subscription */}
                {!subscription || subscription.status !== 'active' ? (
                    <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab('light')}
                            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'light'
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {language === 'ku' ? 'Light' : language === 'ar' ? 'لايت' : 'Light'}
                        </button>
                        <button
                            onClick={() => setActiveTab('gold')}
                            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'gold'
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {language === 'ku' ? 'Gold' : language === 'ar' ? 'جولد' : 'Gold'}
                        </button>
                        <button
                            onClick={() => setActiveTab('business')}
                            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'business'
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {language === 'ku' ? 'Business' : language === 'ar' ? 'بيزنس' : 'Business'}
                        </button>
                    </div>
                ) : null}

                {/* Tab Content */}
                <div className="space-y-4">
                    {/* Light Plan - Show ONLY if user has light subscription OR (no active subscription and light tab is active) */}
                    {(() => {
                        // If user has an active subscription, only show their plan
                        if (subscription?.status === 'active') {
                            const showLight = subscription.plan_type === 'light_monthly';
                            console.log('Has active subscription - Show Light?', showLight, subscription);
                            return showLight;
                        }
                        // If no subscription, show based on active tab
                        const showLight = activeTab === 'light';
                        console.log('No subscription - Show Light?', showLight, { activeTab });
                        return showLight;
                    })() ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                        <Sparkles size={24} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                {language === 'ku' ? 'Light' : language === 'ar' ? 'لايت' : 'Light'}
                                            </h4>
                                            {subscription?.plan_type === 'light_monthly' && subscription?.status === 'active' && (
                                                <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                                                    {language === 'ku' ? 'چالاک' : language === 'ar' ? 'نشط' : 'Active'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">£6.99</p>
                                        {subscription?.plan_type === 'light_monthly' && subscription?.expires_at && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {language === 'ku'
                                                    ? `دەبێتەوە لە ${new Date(subscription.expires_at).toLocaleDateString('ku')}`
                                                    : language === 'ar'
                                                        ? `ينتهي في ${new Date(subscription.expires_at).toLocaleDateString('ar')}`
                                                        : `Expires on ${new Date(subscription.expires_at).toLocaleDateString('en-GB')}`
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دەستگەیشتن بە هەموو سەرچاوەکان' : language === 'ar' ? 'الوصول إلى جميع الموارد' : 'Access to all resources'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'گەڕان بە دوای سەرچاوەکان' : language === 'ar' ? 'البحث عن الموارد' : 'Search functionality'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دڵخوازەکان' : language === 'ar' ? 'المفضلة' : 'Favorites'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'زانیاری کۆچکردن' : language === 'ar' ? 'معلومات الهجرة' : 'Immigration information'}
                                    </span>
                                </div>
                            </div>
                            {subscription?.plan_type === 'light_monthly' && subscription?.status === 'active' ? (
                                <div className="w-full mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 text-center">
                                        {language === 'ku'
                                            ? 'ئێستا لە پلانی Light دایت'
                                            : language === 'ar'
                                                ? 'أنت الآن في خطة Light'
                                                : 'You are currently on the Light plan'
                                        }
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-500 text-center mt-1">
                                        {language === 'ku'
                                            ? 'دەتوانیت بەشداری بکەیت لە هەموو سەرچاوەکان، گەڕان، دڵخوازەکان و زانیاری کۆچکردن'
                                            : language === 'ar'
                                                ? 'يمكنك الوصول إلى جميع الموارد والبحث والمفضلة ومعلومات الهجرة'
                                                : 'You can access all resources, search, favorites, and immigration information'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/payment/light')}
                                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md shadow-indigo-500/20"
                                >
                                    {language === 'ku' ? 'بەشداریکردن' : language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                                </button>
                            )}
                        </div>
                    ) : null}

                    {/* Gold Plan - Show ONLY if user has gold subscription OR (no active subscription and gold tab is active) */}
                    {(() => {
                        // If user has an active subscription, only show their plan
                        if (subscription?.status === 'active') {
                            const showGold = subscription.plan_type === 'gold_monthly';
                            console.log('Has active subscription - Show Gold?', showGold, subscription);
                            return showGold;
                        }
                        // If no subscription, show based on active tab
                        const showGold = activeTab === 'gold';
                        console.log('No subscription - Show Gold?', showGold, { activeTab });
                        return showGold;
                    })() ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                                        <Crown size={24} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                {language === 'ku' ? 'Gold' : language === 'ar' ? 'جولد' : 'Gold'}
                                            </h4>
                                            {subscription?.plan_type === 'gold_monthly' && subscription?.status === 'active' && (
                                                <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                                                    {language === 'ku' ? 'چالاک' : language === 'ar' ? 'نشط' : 'Active'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">£19.99</p>
                                        {subscription?.plan_type === 'gold_monthly' && subscription?.expires_at && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {language === 'ku'
                                                    ? `دەبێتەوە لە ${new Date(subscription.expires_at).toLocaleDateString('ku')}`
                                                    : language === 'ar'
                                                        ? `ينتهي في ${new Date(subscription.expires_at).toLocaleDateString('ar')}`
                                                        : `Expires on ${new Date(subscription.expires_at).toLocaleDateString('en-GB')}`
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'هەموو تایبەتمەندیەکانی Light' : language === 'ar' ? 'جميع ميزات Light' : 'All Light features'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دەستگەیشتن بە لیستی کارەکان' : language === 'ar' ? 'الوصول إلى قائمة الوظائف' : 'Access to job listings'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دەستگەیشتن بە لیستی پارێزه‌رکان' : language === 'ar' ? 'الوصول إلى قائمة المحامين' : 'Access to lawyers list'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دەستگەیشتن بە لیستی ژمێریارەکان' : language === 'ar' ? 'الوصول إلى قائمة المحاسبين' : 'Access to accountants list'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دەستگەیشتن بە لیستی مامۆستاکانی شۆفێری' : language === 'ar' ? 'الوصول إلى قائمة مدرسي القيادة' : 'Access to driving instructors'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'دەستگەیشتن بە لیستی ئۆتۆمبێلەکان' : language === 'ar' ? 'الوصول إلى قائمة السيارات' : 'Access to car listings'}
                                    </span>
                                </div>
                            </div>
                            {subscription?.plan_type === 'gold_monthly' && subscription?.status === 'active' ? (
                                <div className="w-full mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 text-center">
                                        {language === 'ku'
                                            ? 'ئێستا لە پلانی Gold دایت'
                                            : language === 'ar'
                                                ? 'أنت الآن في خطة Gold'
                                                : 'You are currently on the Gold plan'
                                        }
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-500 text-center mt-1">
                                        {language === 'ku'
                                            ? 'دەتوانیت بەشداری بکەیت لە هەموو تایبەتمەندیەکانی Light + لیستی کارەکان، پارێزه‌رکان، ژمێریارەکان، مامۆستاکانی شۆفێری و ئۆتۆمبێلەکان'
                                            : language === 'ar'
                                                ? 'يمكنك الوصول إلى جميع ميزات Light + قوائم الوظائف والمحامين والمحاسبين ومدرسي القيادة والسيارات'
                                                : 'You can access all Light features + job listings, lawyers, accountants, driving instructors, and car listings'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/payment/gold')}
                                    className="w-full mt-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md shadow-amber-500/20"
                                >
                                    {language === 'ku' ? 'بەشداریکردن' : language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                                </button>
                            )}
                        </div>
                    ) : null}

                    {/* Business Plan - Show ONLY if user has business subscription OR (no active subscription and business tab is active) */}
                    {(() => {
                        // If user has an active subscription, only show their plan
                        if (subscription?.status === 'active') {
                            const showBusiness = subscription.plan_type === 'business_monthly';
                            console.log('Has active subscription - Show Business?', showBusiness, subscription);
                            return showBusiness;
                        }
                        // If no subscription, show based on active tab
                        const showBusiness = activeTab === 'business';
                        console.log('No subscription - Show Business?', showBusiness, { activeTab });
                        return showBusiness;
                    })() ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                        <Briefcase size={24} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                {language === 'ku' ? 'Business' : language === 'ar' ? 'بيزنس' : 'Business'}
                                            </h4>
                                            {subscription?.plan_type === 'business_monthly' && subscription?.status === 'active' && (
                                                <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                                                    {language === 'ku' ? 'چالاک' : language === 'ar' ? 'نشط' : 'Active'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">£39.99</p>
                                        {subscription?.plan_type === 'business_monthly' && subscription?.expires_at && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {language === 'ku'
                                                    ? `دەبێتەوە لە ${new Date(subscription.expires_at).toLocaleDateString('ku')}`
                                                    : language === 'ar'
                                                        ? `ينتهي في ${new Date(subscription.expires_at).toLocaleDateString('ar')}`
                                                        : `Expires on ${new Date(subscription.expires_at).toLocaleDateString('en-GB')}`
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'هەموو تایبەتمەندیەکانی Gold' : language === 'ar' ? 'جميع ميزات Gold' : 'All Gold features'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'زیادکردنی کار' : language === 'ar' ? 'إضافة وظيفة' : 'Post job listings'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'زیادکردنی ئۆتۆمبێل' : language === 'ar' ? 'إضافة سيارة' : 'Post car listings'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'زیادکردنی پارێزه‌ر' : language === 'ar' ? 'إضافة محامي' : 'Add lawyer listing'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'زیادکردنی ژمێریار' : language === 'ar' ? 'إضافة محاسب' : 'Add accountant listing'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'زیادکردنی دەستەی گەشت' : language === 'ar' ? 'إضافة وكيل سفر' : 'Add travel agent listing'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'یارمەتی تایبەت' : language === 'ar' ? 'دعم مخصص' : 'Priority support'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {language === 'ku' ? 'بێ سنوور زیادکردن' : language === 'ar' ? 'إضافات غير محدودة' : 'Unlimited listings'}
                                    </span>
                                </div>
                            </div>
                            {subscription?.plan_type === 'business_monthly' && subscription?.status === 'active' ? (
                                <div className="w-full mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 text-center">
                                        {language === 'ku'
                                            ? 'ئێستا لە پلانی Business دایت'
                                            : language === 'ar'
                                                ? 'أنت الآن في خطة Business'
                                                : 'You are currently on the Business plan'
                                        }
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-500 text-center mt-1">
                                        {language === 'ku'
                                            ? 'دەتوانیت بەشداری بکەیت لە هەموو تایبەتمەندیەکانی Gold + زیادکردنی کار، ئۆتۆمبێل، پارێزه‌ر، ژمێریار، دەستەی گەشت، یارمەتی تایبەت و زیادکردنی بێ سنوور'
                                            : language === 'ar'
                                                ? 'يمكنك الوصول إلى جميع ميزات Gold + إضافة الوظائف والسيارات والمحامين والمحاسبين ووكلاء السفر والدعم المخصص والإضافات غير المحدودة'
                                                : 'You can access all Gold features + post jobs, cars, lawyers, accountants, travel agents, priority support, and unlimited listings'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/payment/business')}
                                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md shadow-indigo-500/20"
                                >
                                    {language === 'ku' ? 'بەشداریکردن' : language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                                </button>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-3">
                <button
                    onClick={() => navigate('/settings')}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Settings size={22} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {t.settings}
                    </span>
                </button>

                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full bg-slate-900 dark:bg-indigo-600 rounded-2xl p-5 shadow-lg shadow-black/20 border border-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center gap-4"
                    >
                        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                            <Sparkles size={22} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="font-bold text-white text-base block">
                                {language === 'ku' ? 'پۆرتال ی کارگێڕی' : language === 'ar' ? 'بوابة المسؤول' : 'Admin Portal'}
                            </span>
                            <span className="text-xs text-indigo-100 opacity-80">
                                {language === 'ku' ? 'بەڕێوەبردنی سەرچاوەکان و بابەتەکان' : language === 'ar' ? 'إدارة الموارد والمواضيع' : 'Manage resources and topics'}
                            </span>
                        </div>
                    </button>
                )}

                <button
                    onClick={() => navigate('/help')}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <HelpCircle size={22} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {language === 'ku' ? 'یارمەتی' : language === 'ar' ? 'المساعدة' : 'Help'}
                    </span>
                </button>

                <button
                    onClick={handleRestorePurchases}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                        <RefreshCw size={22} className="text-green-600 dark:text-green-400" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {language === 'ku' ? 'گەڕاندنەوەی بەشداریکردن' : language === 'ar' ? 'استعادة المشتريات' : 'Restore Purchases'}
                    </span>
                </button>

                <button
                    onClick={handleSignOut}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-red-100 dark:border-red-900/30 transition-all duration-200 active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                        <LogOut size={22} className="text-red-600 dark:text-red-400" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-red-600 dark:text-red-400 text-base">
                        {t.signOut}
                    </span>
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                            <Info size={22} className="text-slate-600 dark:text-slate-400" strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            {t.about}
                        </span>
                    </div>
                    <div className={isRTL ? 'pr-14' : 'pl-14'}>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {language === 'ku'
                                ? 'Migrant Hub GB'
                                : language === 'ar'
                                    ? 'Migrant Hub GB'
                                    : 'Migrant Hub GB'
                            }
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            v1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
