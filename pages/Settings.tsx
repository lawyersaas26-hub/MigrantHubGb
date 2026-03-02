import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bell, Moon, Sun, Globe, Shield, HelpCircle, FileText, Trash2 } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { getCurrentUserProfile, updateUserProfile } from '../lib/userAuth';
import type { Language } from '../types';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useTranslations();
    const { darkMode, setDarkMode } = useDarkMode();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;
    const [notifications, setNotifications] = useState(true);

    const settingsTranslations = {
        ku: {
            title: 'ڕێکخستنەکان',
            language: 'زمان',
            notifications: 'ئاگاداریەکان',
            darkMode: 'دۆخی تاریک',
            privacy: 'تایبەتمەندی',
            help: 'یارمەتی',
            terms: 'مەرجەکان',
            deleteAccount: 'سڕینەوەی هەژمار',
            languageDesc: 'زمانی ئەپلیکەیشن هەڵبژێرە',
            notificationsDesc: 'ئاگاداریەکان وەربگرە',
            darkModeDesc: 'دۆخی تاریک چالاک بکە',
            privacyDesc: 'سیاسەتی تایبەتمەندی',
            helpDesc: 'یارمەتی و پشتیوانی',
            termsDesc: 'مەرجەکانی بەکارهێنان',
            deleteAccountDesc: 'هەژمارەکەت بە هەمیشەیی بسڕەوە',
            confirmDelete: 'دڵنیایت لە سڕینەوەی هەژمارەکەت؟',
            deleteWarning: 'ئەم کارە ناگەڕێتەوە',
        },
        ar: {
            title: 'الإعدادات',
            language: 'اللغة',
            notifications: 'الإشعارات',
            darkMode: 'الوضع الداكن',
            privacy: 'الخصوصية',
            help: 'المساعدة',
            terms: 'الشروط',
            deleteAccount: 'حذف الحساب',
            languageDesc: 'اختر لغة التطبيق',
            notificationsDesc: 'تلقي الإشعارات',
            darkModeDesc: 'تفعيل الوضع الداكن',
            privacyDesc: 'سياسة الخصوصية',
            helpDesc: 'المساعدة والدعم',
            termsDesc: 'شروط الاستخدام',
            deleteAccountDesc: 'حذف حسابك بشكل دائم',
            confirmDelete: 'هل أنت متأكد من حذف حسابك؟',
            deleteWarning: 'لا يمكن التراجع عن هذا الإجراء',
        },
        en: {
            title: 'Settings',
            language: 'Language',
            notifications: 'Notifications',
            darkMode: 'Dark Mode',
            privacy: 'Privacy',
            help: 'Help',
            terms: 'Terms',
            deleteAccount: 'Delete Account',
            languageDesc: 'Choose app language',
            notificationsDesc: 'Receive notifications',
            darkModeDesc: 'Enable dark mode',
            privacyDesc: 'Privacy policy',
            helpDesc: 'Help & Support',
            termsDesc: 'Terms of Service',
            deleteAccountDesc: 'Permanently delete your account',
            confirmDelete: 'Are you sure you want to delete your account?',
            deleteWarning: 'This action cannot be undone',
        },
    };

    const t = settingsTranslations[language] || settingsTranslations.en;

    const languages: { code: Language; name: string; nativeName: string }[] = [
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'ku', name: 'Kurdish', nativeName: 'کوردی' },
        { code: 'en', name: 'English', nativeName: 'English' },
    ];

    const handleLanguageChange = (newLang: Language) => {
        setLanguage(newLang);
        localStorage.setItem('app_language', newLang);
    };

    const handleDeleteAccount = () => {
        if (window.confirm(t.confirmDelete + '\n' + t.deleteWarning)) {
            // TODO: Implement account deletion
            alert('Account deletion feature coming soon');
        }
    };

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 active:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {t.title}
                </h1>
            </div>

            {/* Language Settings */}
            <div className="mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Globe size={22} className="text-indigo-600" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                                {t.language}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t.languageDesc}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
                                    language === lang.code
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600'
                                }`}
                            >
                                {lang.nativeName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* App Settings */}
            <div className="space-y-3 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Bell size={22} className="text-blue-600" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                                    {t.notifications}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {t.notificationsDesc}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600"></div>
                        </label>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center">
                                {darkMode ? (
                                    <Sun size={22} className="text-slate-600" strokeWidth={2.5} />
                                ) : (
                                    <Moon size={22} className="text-slate-600" strokeWidth={2.5} />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">
                                    {t.darkMode}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {t.darkModeDesc}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Legal & Support */}
            <div className="space-y-3 mb-6">
                <button
                    onClick={() => alert('Privacy policy coming soon')}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200 active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                        <Shield size={22} className="text-green-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                            {t.privacy}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.privacyDesc}
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/help')}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200 active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <HelpCircle size={22} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                            {t.help}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.helpDesc}
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => alert('Terms of Service coming soon')}
                    className="w-full bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 transition-all duration-200 active:scale-[0.98] flex items-center gap-4"
                >
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                        <FileText size={22} className="text-purple-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-900 text-base mb-1">
                            {t.terms}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {t.termsDesc}
                        </p>
                    </div>
                </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-red-100 dark:border-red-900/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                        <Trash2 size={22} className="text-red-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-600 text-base mb-1">
                            {t.deleteAccount}
                        </h3>
                        <p className="text-xs text-red-500">
                            {t.deleteAccountDesc}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDeleteAccount}
                    className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-all duration-200 active:scale-95 border-2 border-red-200"
                >
                    {t.deleteAccount}
                </button>
            </div>
        </div>
    );
};

export default Settings;

