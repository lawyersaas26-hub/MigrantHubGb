import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import type { Language } from '../types';
import logo from '../assets/logo.svg';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useTranslations();
    const [selectedLang, setSelectedLang] = useState<Language>(language);
    const isRTL = selectedLang === 'ku' || selectedLang === 'ar';

    // Update app language when selection changes
    useEffect(() => {
        setLanguage(selectedLang);
    }, [selectedLang, setLanguage]);

    const welcomeContent = {
        ku: {
            title: "چوونەژوورەوە بۆ",
            appName: "Migrant Hub GB",
            description: "ئەپلیکەیشنێکی تەواو بۆ یارمەتیدانی کۆچبەران لە بەریتانیا. زانیاری گرنگ دەربارەی کۆچکردن، نیشتەجێبوون، کار، پەروەردە، تەندروستی و زیاتر.",
            getStarted: "دەستپێکردن",
            login: "چوونەژوورەوە",
            register: "دروستکردنی هەژمار",
            selectLanguage: "زمان هەڵبژێرە"
        },
        ar: {
            title: "تسجيل الدخول إلى",
            appName: "Migrant Hub GB",
            description: "تطبيق شامل لمساعدة المهاجرين في المملكة المتحدة. معلومات مهمة حول الهجرة، السكن، التوظيف، التعليم، الصحة والمزيد.",
            getStarted: "ابدأ الآن",
            login: "تسجيل الدخول",
            register: "إنشاء حساب",
            selectLanguage: "اختر اللغة"
        },
        en: {
            title: "Login to",
            appName: "Migrant Hub GB",
            description: "A comprehensive app to help immigrants in the UK. Essential information about immigration, housing, employment, education, healthcare, and more.",
            getStarted: "Get Started",
            login: "Sign In",
            register: "Create Account",
            selectLanguage: "Select Language"
        }
    };

    const content = welcomeContent[selectedLang];

    // Kurdistan Flag Component - Red, White, Green with Yellow Sun
    const KurdistanFlag: React.FC = () => (
        <div className="w-8 h-6 rounded-sm overflow-hidden relative border border-slate-200" style={{
            background: 'linear-gradient(to bottom, #E00000 0%, #E00000 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #00A651 66.66%, #00A651 100%)'
        }}>
            {/* Yellow Sun with Rays */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative" style={{ width: '16px', height: '16px' }}>
                    {/* Sun Center */}
                    <div className="absolute inset-0 rounded-full" style={{
                        background: '#FFD700',
                        boxShadow: '0 0 2px rgba(0,0,0,0.2)'
                    }}></div>
                    {/* Sun Rays - 21 rays as per Kurdistan flag */}
                    {[...Array(21)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 rounded-full"
                            style={{
                                background: '#FFD700',
                                height: '3px',
                                left: '50%',
                                top: '50%',
                                transformOrigin: 'center',
                                transform: `translate(-50%, -50%) rotate(${i * (360 / 21)}deg) translateY(-7px)`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const languages: { code: Language; name: string; nativeName: string; flag: string | React.ReactNode }[] = [
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇮🇶' },
        { code: 'ku', name: 'Kurdish', nativeName: 'کوردی', flag: <KurdistanFlag /> },
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    ];

    // Save language preference when navigating to login/register
    useEffect(() => {
        localStorage.setItem('app_language', selectedLang);
    }, [selectedLang]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-5">
            <div className="max-w-md w-full">
                {/* Logo/Icon Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 mb-6">
                        <img
                            src={logo}
                            alt="Migrant Hub Logo"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {content.title}
                    </h1>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {content.appName}
                    </h2>
                </div>

                {/* Description Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-black/5 border border-slate-200/50 mb-6">
                    <p className={`text-slate-700 leading-relaxed font-medium text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                        {content.description}
                    </p>
                </div>

                {/* Language Selection */}
                <div className="mb-6">
                    <h3 className={`text-sm font-bold text-slate-700 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {content.selectLanguage}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className={`relative p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${selectedLang === lang.code
                                    ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center mb-2" style={{ height: '2rem' }}>
                                    {typeof lang.flag === 'string' ? (
                                        <span className="text-3xl">{lang.flag}</span>
                                    ) : (
                                        lang.flag
                                    )}
                                </div>
                                <div className={`text-xs font-bold ${selectedLang === lang.code
                                    ? 'text-indigo-700'
                                    : 'text-slate-600'
                                    }`}>
                                    {lang.nativeName}
                                </div>
                                {selectedLang === lang.code && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white border-2 border-indigo-200 text-indigo-600 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                    >
                        <LogIn size={20} strokeWidth={2.5} />
                        <span>{content.login}</span>
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-indigo-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <UserPlus size={20} strokeWidth={2.5} />
                        <span>{content.register}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
