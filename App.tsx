import React, { useState, useMemo, useCallback, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { AppState } from '@capacitor/app';
import { LanguageProvider } from './context/LanguageContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { translations } from './constants/translations';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import PasswordProtection from './components/PasswordProtection';
import type { Language, NavItem } from './types';

// Lazy load all page components for code splitting and faster initial load
const Home = lazy(() => import('./pages/Home'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Account = lazy(() => import('./pages/Account'));
const Settings = lazy(() => import('./pages/Settings'));
const WebViewContent = lazy(() => import('./pages/WebViewContent'));
const DrivingInstructorsList = lazy(() => import('./pages/DrivingInstructorsList'));
const InstructorDetail = lazy(() => import('./pages/InstructorDetail'));
const JobsList = lazy(() => import('./pages/JobsList'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const CarsList = lazy(() => import('./pages/CarsList'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const LawyersList = lazy(() => import('./pages/LawyersList'));
const LawyerDetail = lazy(() => import('./pages/LawyerDetail'));
const AccountantsList = lazy(() => import('./pages/AccountantsList'));
const AccountantDetail = lazy(() => import('./pages/AccountantDetail'));
const TravelAgentsList = lazy(() => import('./pages/TravelAgentsList'));
const TravelAgentDetail = lazy(() => import('./pages/TravelAgentDetail'));
const BusinessesList = lazy(() => import('./pages/BusinessesList'));
const BusinessDetail = lazy(() => import('./pages/BusinessDetail'));
const HomesList = lazy(() => import('./pages/HomesList'));
const HomeDetail = lazy(() => import('./pages/HomeDetail'));
const TopicDetail = lazy(() => import('./pages/TopicDetail'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Help = lazy(() => import('./pages/Help'));
const Payment = lazy(() => import('./pages/Payment'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminSignup = lazy(() => import('./pages/admin/AdminSignup'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminResourceForm = lazy(() => import('./pages/admin/AdminResourceForm'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminCategoryForm = lazy(() => import('./pages/admin/AdminCategoryForm'));
const AdminDrivingInstructors = lazy(() => import('./pages/admin/AdminDrivingInstructors'));
const AdminDrivingInstructorForm = lazy(() => import('./pages/admin/AdminDrivingInstructorForm'));
const AdminInstructorReviews = lazy(() => import('./pages/admin/AdminInstructorReviews'));
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'));
const AdminJobForm = lazy(() => import('./pages/admin/AdminJobForm'));
const AdminCars = lazy(() => import('./pages/admin/AdminCars'));
const AdminCarForm = lazy(() => import('./pages/admin/AdminCarForm'));
const AdminLawyers = lazy(() => import('./pages/admin/AdminLawyers'));
const AdminLawyerForm = lazy(() => import('./pages/admin/AdminLawyerForm'));
const AdminAccountants = lazy(() => import('./pages/admin/AdminAccountants'));
const AdminAccountantForm = lazy(() => import('./pages/admin/AdminAccountantForm'));
const AdminTravelAgents = lazy(() => import('./pages/admin/AdminTravelAgents'));
const AdminTravelAgentForm = lazy(() => import('./pages/admin/AdminTravelAgentForm'));
const AdminHomes = lazy(() => import('./pages/admin/AdminHomes'));
const AdminTopics = lazy(() => import('./pages/admin/AdminTopics'));
const AdminTopicForm = lazy(() => import('./pages/admin/AdminTopicForm'));
const AdminTopicResources = lazy(() => import('./pages/admin/AdminTopicResources'));

// Loading component for Suspense fallback
const PageLoader: React.FC = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading...</p>
        </div>
    </div>
);

// Page transition wrapper for smooth navigation
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 300);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div
            key={location.pathname}
            className={`transition-all duration-300 ease-in-out ${isTransitioning
                ? 'opacity-0 translate-y-2'
                : 'opacity-100 translate-y-0'
                }`}
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </div>
    );
};

const AppContent: React.FC = () => {
    // Load language from localStorage or default to 'ku'
    const [language, setLanguage] = useState<Language>(() => {
        const savedLang = localStorage.getItem('app_language') as Language;
        return savedLang || 'ku';
    });
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user has visited before (has seen welcome screen)
    // Check authentication and control access
    useEffect(() => {
        const checkAuth = async () => {
            const currentPath = location.pathname;
            const isWelcome = currentPath === '/welcome';
            const isAuthRoute = currentPath === '/login' || currentPath === '/register';
            const isAdmin = currentPath.startsWith('/admin');

            try {
                const { supabase } = await import('./lib/supabase');
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    // User is logged in - ensure profile exists
                    const { getCurrentUserProfile } = await import('./lib/userAuth');
                    try {
                        // This will create profile if it doesn't exist
                        await getCurrentUserProfile();
                    } catch (error) {
                        console.error('Error ensuring user profile exists:', error);
                    }
                    
                    // Only redirect if they are on a guest-only page (welcome, login, register)
                    if (isWelcome || isAuthRoute) {
                        navigate('/', { replace: true });
                    }
                } else {
                    // User is NOT logged in:
                    // If not on a public page (welcome, login, register, admin), redirect to welcome
                    if (!isWelcome && !isAuthRoute && !isAdmin) {
                        navigate('/welcome', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                // If Supabase connection fails, still allow access to welcome/auth pages
                // If user is not on a public page, redirect to welcome
                if (!isWelcome && !isAuthRoute && !isAdmin) {
                    navigate('/welcome', { replace: true });
                }
            } finally {
                // Ensure we stop loading after check, giving a small buffer for potential redirect to start
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [location.pathname, navigate]);

    // Handle OAuth callback for web - process URL hash/query params
    useEffect(() => {
        const handleOAuthCallback = async () => {
            // Only handle OAuth callback on web (not native - that's handled separately)
            if (Capacitor.isNativePlatform()) {
                return;
            }

            const { supabase } = await import('./lib/supabase');
            
            // Check if this is an OAuth callback (has tokens in URL hash or query params)
            const hash = window.location.hash;
            const searchParams = new URLSearchParams(window.location.search);
            
            const hasHashToken = hash && (hash.includes('access_token') || hash.includes('error'));
            const hasQueryToken = searchParams.has('access_token') || searchParams.has('error');

            if (hasHashToken || hasQueryToken) {
                console.log('OAuth callback detected, processing...', { hash: hash?.substring(0, 50), hasQueryToken });
                
                try {
                    // For hash-based OAuth (Supabase default), the tokens are in the hash
                    // Supabase will automatically parse them when we call getSession()
                    // But we should also try to extract and set them explicitly if needed
                    
                    if (hash && hash.includes('access_token')) {
                        // Extract tokens from hash
                        const hashParams = new URLSearchParams(hash.substring(1));
                        const accessToken = hashParams.get('access_token');
                        const refreshToken = hashParams.get('refresh_token');
                        
                        if (accessToken && refreshToken) {
                            console.log('Setting session from hash tokens...');
                            const { error: sessionError } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                            });
                            
                            if (sessionError) {
                                console.error('Error setting session from hash:', sessionError);
                            }
                        }
                    }
                    
                    // Get the session (Supabase should have parsed it by now)
                    const { data: { session }, error } = await supabase.auth.getSession();
                    
                    if (error) {
                        console.error('Error getting session after OAuth:', error);
                        // Check if there's an error in the hash/query
                        if (hash?.includes('error') || searchParams.has('error')) {
                            const errorParam = hash
                                ? new URLSearchParams(hash.substring(1)).get('error')
                                : searchParams.get('error');
                            console.error('OAuth error in URL:', errorParam);
                            navigate('/login?error=oauth_failed', { replace: true });
                        }
                        return;
                    }

                    if (session) {
                        console.log('OAuth callback successful, user logged in');
                        localStorage.setItem('app_has_visited', 'true');
                        
                        // Ensure profile exists for OAuth users
                        try {
                            const { getCurrentUserProfile } = await import('./lib/userAuth');
                            await getCurrentUserProfile();
                        } catch (profileError) {
                            console.error('Error ensuring user profile exists after OAuth:', profileError);
                        }
                        
                        // Clear the hash/query params from URL
                        window.history.replaceState({}, '', window.location.pathname);
                        
                        // Navigate to home page
                        navigate('/', { replace: true });
                    } else if (hash?.includes('error') || searchParams.has('error')) {
                        // Handle OAuth error
                        const errorParam = hash
                            ? new URLSearchParams(hash.substring(1)).get('error')
                            : searchParams.get('error');
                        console.error('OAuth error:', errorParam);
                        // Navigate to login with error
                        navigate('/login?error=oauth_failed', { replace: true });
                    } else {
                        console.warn('OAuth callback detected but no session found');
                    }
                } catch (error) {
                    console.error('Error handling OAuth callback:', error);
                }
            } else {
                // Not an OAuth callback, just check if user is logged in
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    localStorage.setItem('app_has_visited', 'true');
                }
            }
        };

        handleOAuthCallback();
    }, [location.pathname, navigate]);

    // Initialize purchases when app starts (native platforms only)
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            // Initialize purchases asynchronously
            import('./utils/purchases').then(({ initializePurchases }) => {
                // Wait a bit for Cordova plugins to be ready
                setTimeout(() => {
                    initializePurchases();
                }, 1000);
            }).catch((error) => {
                console.error('Failed to load purchases module:', error);
            });
        }
    }, []);

    // Handle OAuth deep link callbacks (native platforms only)
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            // Handle app URL open events (OAuth callbacks and Payments)
            const handleAppUrlOpen = async (event: { url: string }) => {
                console.log('App opened with URL:', event.url);

                try {
                    // Check if this is a payment callback (if you use deep links for payments)
                    if (event.url.includes('payment/success')) {
                        navigate('/account?subscription=success');
                        return;
                    }

                    const { supabase } = await import('./lib/supabase');

                    // Parse the URL - handle both hash fragments and query parameters
                    let url: URL;
                    try {
                        url = new URL(event.url);
                    } catch (e) {
                        // If URL parsing fails, try adding a protocol
                        url = new URL(event.url.replace(/^([^:]+):/, '$1://'));
                    }

                    const hash = url.hash;
                    const searchParams = url.searchParams;

                    // Check if this is an OAuth callback
                    const hasHashToken = hash && (hash.includes('access_token') || hash.includes('error'));
                    const hasQueryToken = searchParams.has('access_token') || searchParams.has('error');

                    if (hasHashToken || hasQueryToken) {
                        console.log('OAuth callback detected in deep link:', { 
                            hasHash: !!hash, 
                            hasQuery: hasQueryToken,
                            hashPreview: hash?.substring(0, 50) 
                        });
                        
                        let accessToken: string | null = null;
                        let refreshToken: string | null = null;

                        // Try to get tokens from hash fragment first (Supabase default)
                        if (hash) {
                            const hashParams = new URLSearchParams(hash.substring(1));
                            accessToken = hashParams.get('access_token');
                            refreshToken = hashParams.get('refresh_token');
                            console.log('Tokens from hash:', { 
                                hasAccessToken: !!accessToken, 
                                hasRefreshToken: !!refreshToken 
                            });
                        }

                        // Fallback to query parameters if hash didn't have tokens
                        if (!accessToken && searchParams.has('access_token')) {
                            accessToken = searchParams.get('access_token');
                            refreshToken = searchParams.get('refresh_token');
                            console.log('Tokens from query params:', { 
                                hasAccessToken: !!accessToken, 
                                hasRefreshToken: !!refreshToken 
                            });
                        }

                        if (accessToken && refreshToken) {
                            console.log('Setting session with tokens...');
                            // Set the session
                            const { getCurrentUserProfile } = await import('./lib/userAuth');
                            const { error } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                            });

                            if (error) {
                                console.error('Error setting session:', error);
                                // Try to close browser if still open
                                try {
                                    const { Browser } = await import('@capacitor/browser');
                                    await Browser.close();
                                } catch (e) {
                                    // Browser might already be closed
                                }
                            } else {
                                console.log('OAuth callback successful, user logged in');
                                
                                // Close the browser
                                try {
                                    const { Browser } = await import('@capacitor/browser');
                                    await Browser.close();
                                } catch (e) {
                                    console.warn('Could not close browser:', e);
                                }
                                
                                // Ensure profile exists for OAuth users
                                try {
                                    await getCurrentUserProfile();
                                } catch (profileError) {
                                    console.error('Error ensuring user profile exists after OAuth:', profileError);
                                }
                                
                                // Small delay to ensure browser is closed before navigation
                                setTimeout(() => {
                                    navigate('/', { replace: true });
                                }, 300);
                            }
                        } else if (hash?.includes('error') || searchParams.has('error')) {
                            // Handle OAuth error
                            const errorParam = hash
                                ? new URLSearchParams(hash.substring(1)).get('error')
                                : searchParams.get('error');
                            console.error('OAuth error in deep link:', errorParam);
                            
                            // Close browser and navigate to login with error
                            try {
                                const { Browser } = await import('@capacitor/browser');
                                await Browser.close();
                            } catch (e) {
                                // Browser might already be closed
                            }
                            setTimeout(() => {
                                navigate('/login?error=oauth_failed', { replace: true });
                            }, 300);
                        } else {
                            console.warn('OAuth callback detected but no tokens found');
                        }
                    } else {
                        console.log('Deep link received but not an OAuth callback:', event.url);
                    }
                } catch (error) {
                    console.error('Error handling OAuth callback:', error);
                }
            };

            // Listen for app URL open events
            const listener = CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen);

            // Also check if app was opened with a URL (cold start)
            CapacitorApp.getLaunchUrl().then((result) => {
                if (result?.url) {
                    handleAppUrlOpen({ url: result.url });
                }
            }).catch(() => {
                // No launch URL, that's fine
            });

            // Listen for app state changes (when app comes back to foreground after OAuth)
            const appStateListener = CapacitorApp.addListener('appStateChange', async (state: AppState) => {
                if (state.isActive) {
                    // App came back to foreground, check if OAuth completed
                    console.log('App returned to foreground, checking for OAuth session...');
                    setTimeout(async () => {
                        const { supabase } = await import('./lib/supabase');
                        const { getCurrentUserProfile } = await import('./lib/userAuth');
                        const { data: { session } } = await supabase.auth.getSession();
                        
                        if (session) {
                            console.log('Session found after app state change, user is logged in');
                            try {
                                await getCurrentUserProfile();
                            } catch (error) {
                                console.error('Error ensuring user profile exists after OAuth:', error);
                            }
                            navigate('/', { replace: true });
                        }
                    }, 1000);
                }
            });

            // Also listen for Browser close events (in case OAuth completed but deep link didn't fire)
            import('@capacitor/browser').then(({ Browser }) => {
                Browser.addListener('browserFinished', async () => {
                    console.log('Browser closed, checking session...');
                    // Wait a moment for any pending redirects and deep link processing
                    setTimeout(async () => {
                        const { supabase } = await import('./lib/supabase');
                        const { getCurrentUserProfile } = await import('./lib/userAuth');
                        
                        // Check session multiple times with delays (deep link might take time)
                        let attempts = 0;
                        const maxAttempts = 5;
                        const checkSession = async () => {
                            const { data: { session }, error } = await supabase.auth.getSession();
                            
                            if (session) {
                                console.log('Session found after browser close, user is logged in');
                                // Ensure profile exists for OAuth users
                                try {
                                    await getCurrentUserProfile();
                                } catch (error) {
                                    console.error('Error ensuring user profile exists after OAuth:', error);
                                }
                                navigate('/', { replace: true });
                                return true;
                            } else if (attempts < maxAttempts) {
                                attempts++;
                                console.log(`Session not found, retrying... (${attempts}/${maxAttempts})`);
                                setTimeout(checkSession, 500);
                            } else {
                                console.warn('Session not found after browser close after multiple attempts');
                            }
                            return false;
                        };
                        
                        await checkSession();
                    }, 1500);
                });
            }).catch((error) => {
                console.warn('Browser plugin not available or listener failed:', error);
            });

            // Cleanup listeners on unmount
            return () => {
                listener.then(l => l.remove()).catch(() => { });
                appStateListener.then(l => l.remove()).catch(() => { });
            };
        }
    }, [navigate]);

    // Fix RTL direction switching with smooth transition
    useEffect(() => {
        const dir = language === 'ku' || language === 'ar' ? 'rtl' : 'ltr';

        // Add transition class for smooth direction change
        document.documentElement.style.transition = 'all 0.3s ease-in-out';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;

        // Save to localStorage
        localStorage.setItem('app_language', language);

        // Remove transition after animation completes
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }, [language]);

    // Determine active nav item based on route
    const getActiveNavItem = (): NavItem => {
        const path = location.pathname;
        if (path === '/favorites') return 'favorites';
        if (path === '/account' || path.startsWith('/account') || path.startsWith('/settings') || path.startsWith('/payment')) return 'account';
        if (path === '/' || path.startsWith('/search') || path.startsWith('/category') || path.startsWith('/resource') ||
            path.startsWith('/jobs') || path.startsWith('/cars') || path.startsWith('/lawyers') ||
            path.startsWith('/accountants') || path.startsWith('/travel-agents') || path.startsWith('/businesses') ||
            path.startsWith('/homes') || path.startsWith('/driving-instructors') || path.startsWith('/help')) return 'home';
        return 'home';
    };

    const activeNavItem = getActiveNavItem();

    const handleNavClick = useCallback((item: NavItem) => {
        switch (item) {
            case 'home':
                navigate('/', { replace: false });
                break;
            case 'favorites':
                navigate('/favorites', { replace: false });
                break;
            case 'account':
                navigate('/account', { replace: false });
                break;
        }
    }, [navigate]);

    // Prefetch common routes on mount for faster navigation
    useEffect(() => {
        // Use dynamic import to avoid blocking initial load
        import('./utils/prefetch').then((module) => {
            module.prefetchCommonRoutes();
        }).catch(() => {
            // Silently fail - prefetching is optional
        });
    }, []);

    const toggleLanguage = useCallback(() => {
        // Cycle through languages: ku -> ar -> en -> ku
        const langOrder: Language[] = ['ku', 'ar', 'en'];
        const currentIndex = langOrder.indexOf(language);
        const nextIndex = (currentIndex + 1) % langOrder.length;
        setLanguage(langOrder[nextIndex]);
    }, [language]);

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
    }, []);

    const currentTranslations = useMemo(() => translations[language], [language]);

    const providerValue = useMemo(() => ({
        language,
        translations: currentTranslations,
        toggleLanguage,
        setLanguage: handleSetLanguage,
    }), [language, currentTranslations, toggleLanguage, handleSetLanguage]);

    const isWebView = location.pathname.startsWith('/webview');
    const isAdmin = location.pathname.startsWith('/admin');
    const isAuth = location.pathname === '/login' || location.pathname === '/register';
    const isWelcome = location.pathname === '/welcome';

    return (
        <DarkModeProvider>
            <LanguageProvider value={providerValue}>
                {isCheckingAuth ? (
                    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
                    </div>
                ) : isWelcome || isAuth ? (
                    // Welcome and Auth routes (full-width, no mobile layout)
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/welcome" element={<Welcome />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </Suspense>
                ) : isAdmin ? (
                    // Admin routes (full-width, no mobile layout)
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/signup" element={<AdminSignup />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/resources/new" element={<AdminResourceForm />} />
                            <Route path="/admin/resources/:id/edit" element={<AdminResourceForm />} />
                            <Route path="/admin/categories" element={<AdminCategories />} />
                            <Route path="/admin/categories/new" element={<AdminCategoryForm />} />
                            <Route path="/admin/categories/:id/edit" element={<AdminCategoryForm />} />
                            <Route path="/admin/driving-instructors" element={<AdminDrivingInstructors />} />
                            <Route path="/admin/driving-instructors/new" element={<AdminDrivingInstructorForm />} />
                            <Route path="/admin/driving-instructors/:id/edit" element={<AdminDrivingInstructorForm />} />
                            <Route path="/admin/instructor-reviews" element={<AdminInstructorReviews />} />
                            <Route path="/admin/instructor-reviews/:instructorId" element={<AdminInstructorReviews />} />
                            <Route path="/admin/jobs" element={<AdminJobs />} />
                            <Route path="/admin/jobs/:id/edit" element={<AdminJobForm />} />
                            <Route path="/admin/cars" element={<AdminCars />} />
                            <Route path="/admin/cars/:id/edit" element={<AdminCarForm />} />
                            <Route path="/admin/lawyers" element={<AdminLawyers />} />
                            <Route path="/admin/lawyers/:id/edit" element={<AdminLawyerForm />} />
                            <Route path="/admin/accountants" element={<AdminAccountants />} />
                            <Route path="/admin/accountants/:id/edit" element={<AdminAccountantForm />} />
                            <Route path="/admin/travel-agents" element={<AdminTravelAgents />} />
                            <Route path="/admin/travel-agents/:id/edit" element={<AdminTravelAgentForm />} />
                            <Route path="/admin/homes" element={<AdminHomes />} />
                            <Route path="/admin/topics" element={<AdminTopics />} />
                            <Route path="/admin/topics/new" element={<AdminTopicForm />} />
                            <Route path="/admin/topics/:id/edit" element={<AdminTopicForm />} />
                            <Route path="/admin/topics/:id/resources" element={<AdminTopicResources />} />
                        </Routes>
                    </Suspense>
                ) : isWebView ? (
                    <Suspense fallback={<PageLoader />}>
                        <WebViewContent />
                    </Suspense>
                ) : (
                    <div
                        className="max-w-[640px] mx-auto bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 h-screen flex flex-col relative shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 transition-all duration-300 overflow-hidden"
                        style={{
                            height: '100dvh', // Use dvh for mobile browsers
                            maxHeight: '100dvh',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        <Header />
                        <main
                            className="flex-1 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden scrollbar-hide"
                            style={{
                                WebkitOverflowScrolling: 'touch',
                                overscrollBehavior: 'contain'
                            }}
                        >
                            <Suspense fallback={<PageLoader />}>
                                <PageTransition>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/welcome" element={<Welcome />} />
                                        <Route path="/category/:categoryId" element={<CategoryDetail />} />
                                        <Route path="/category/:categoryId/resource/:slug" element={<ResourceDetail />} />
                                        <Route path="/resource/:resourceId" element={<ResourceDetail />} />
                                        <Route path="/search" element={<SearchResults />} />
                                        <Route path="/favorites" element={<Favorites />} />
                                        <Route path="/account" element={<Account />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/help" element={<Help />} />
                                        <Route path="/payment/:planType" element={<Payment />} />
                                        <Route path="/webview" element={<WebViewContent />} />
                                        <Route path="/driving-instructors" element={<DrivingInstructorsList />} />
                                        <Route path="/driving-instructors/:instructorId" element={<InstructorDetail />} />
                                        <Route path="/jobs" element={<JobsList />} />
                                        <Route path="/jobs/:id" element={<JobDetail />} />
                                        <Route path="/cars" element={<CarsList />} />
                                        <Route path="/cars/:id" element={<CarDetail />} />
                                        <Route path="/lawyers" element={<LawyersList />} />
                                        <Route path="/lawyers/:id" element={<LawyerDetail />} />
                                        <Route path="/accountants" element={<AccountantsList />} />
                                        <Route path="/accountants/:id" element={<AccountantDetail />} />
                                        <Route path="/travel-agents" element={<TravelAgentsList />} />
                                        <Route path="/travel-agents/:id" element={<TravelAgentDetail />} />
                                        <Route path="/businesses" element={<BusinessesList />} />
                                        <Route path="/businesses/:id" element={<BusinessDetail />} />
                                        <Route path="/homes" element={<HomesList />} />
                                        <Route path="/homes/:id" element={<HomeDetail />} />
                                        <Route path="/category/:categoryId/topic/:topicSlug" element={<TopicDetail />} />
                                        <Route path="*" element={<Home />} />
                                    </Routes>
                                </PageTransition>
                            </Suspense>
                        </main>
                        <BottomNav activeItem={activeNavItem} setActiveItem={handleNavClick} />
                    </div>
                )}
            </LanguageProvider>
        </DarkModeProvider>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter basename={Capacitor.isNativePlatform() ? undefined : undefined}>
            <PasswordProtection>
                <AppContent />
            </PasswordProtection>
        </BrowserRouter>
    );
};

export default App;