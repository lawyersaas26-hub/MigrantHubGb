
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { Language } from '../types';

const Header: React.FC = React.memo(() => {
    const { translations, setLanguage, language } = useTranslations();
    const navigate = useNavigate();
    const [isChanging, setIsChanging] = useState(false);
    const [username, setUsername] = useState<string>('');
    const location = useLocation();

    // Determine if we should show the back button
    const isMainMenu = location.pathname === '/' || location.pathname === '/favorites' || location.pathname === '/account';
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.email) {
                const name = user.email.split('@')[0];
                setUsername(name);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email) {
                setUsername(session.user.email.split('@')[0]);
            } else {
                setUsername('');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSearchClick = useCallback(() => {
        navigate('/search');
    }, [navigate]);

    const handleLanguageChange = useCallback((newLang: Language) => {
        if (newLang === language) return;

        setIsChanging(true);

        // Smooth transition effect
        setTimeout(() => {
            setLanguage(newLang);
            setTimeout(() => {
                setIsChanging(false);
            }, 150);
        }, 100);
    }, [language, setLanguage]);

    const languages: { code: Language; label: string }[] = useMemo(() => [
        { code: 'ar', label: 'AR' },
        { code: 'ku', label: 'KU' },
        { code: 'en', label: 'EN' },
    ], []);

    const welcomeMessage = useMemo(
        () => translations.welcomeUser.replace('User', username || 'User'),
        [translations.welcomeUser, username]
    );

    return (
        <header className="w-full bg-white dark:bg-slate-800 border-b border-slate-200/50 dark:border-slate-700/50 z-50 transition-all duration-300 flex-shrink-0" style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(3.5rem + env(safe-area-inset-top))' }}>
            <div className="max-w-[640px] mx-auto h-14 flex items-center px-4 gap-2">
                {/* Back Button for Inner Pages */}
                {!isMainMenu && (
                    <button 
                        onClick={handleBack}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                    >
                        <BackIcon size={20} strokeWidth={2.5} />
                    </button>
                )}

                {/* User Avatar and Welcome */}
                <div className={`flex items-center gap-2.5 flex-shrink-0 transition-all duration-300 ${isChanging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20 flex-shrink-0">
                        <span className="text-white font-bold text-xs uppercase text-ellipsis overflow-hidden px-1">{username ? username.substring(0, 2) : 'UK'}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`text-slate-900 dark:text-slate-100 text-sm font-semibold leading-tight transition-all duration-300 truncate ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
                            {welcomeMessage}
                        </span>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>


                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-0.5 border border-slate-200/50 dark:border-slate-600/50 flex-shrink-0">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`relative px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all duration-300 active:scale-95 ${language === lang.code
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-600'
                                }`}
                        >
                            <span className="relative z-10">{lang.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
});

Header.displayName = 'Header';

export default Header;