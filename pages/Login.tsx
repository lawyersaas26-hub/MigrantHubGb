import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser } from '../lib/userAuth';
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';

    const translations = {
        ku: {
            title: 'چوونەژوورەوە بۆ',
            appName: 'Migrant Hub GB',
            subtitle: 'بچۆرەوە بۆ هەژمارەکەت',
            email: 'ئیمەیڵ',
            password: 'وشەی نهێنی',
            signIn: 'چوونەژوورەوە',
            signingIn: 'جارکردن...',
            noAccount: 'هەژمارت نییە؟',
            forgot: 'وشەی نهێنیت بیرچووە؟',
            signUp: 'دروستکردنی هەژمار',
            orContinue: 'یان بەردەوام بە',
        },
        ar: {
            title: 'تسجيل الدخول إلى',
            appName: 'Migrant Hub GB',
            subtitle: 'قم بتسجيل الدخول إلى حسابك',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            signIn: 'تسجيل الدخول',
            signingIn: 'جارٍ التحميل...',
            noAccount: 'ليس لديك حساب؟',
            forgot: 'نسيت كلمة المرور؟',
            signUp: 'إنشاء حساب',
            orContinue: 'أو تابع مع',
        },
        en: {
            title: 'Login to',
            appName: 'Migrant Hub GB',
            subtitle: 'Sign in to your account',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
            signingIn: 'Signing in...',
            noAccount: "Don't have an account?",
            forgot: 'Forgot Password?',
            signUp: 'Create Account',
            orContinue: 'Or continue with',
        },
    };

    const t = translations[language];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInUser(email, password);
            // Mark as visited so welcome screen doesn't show
            localStorage.setItem('app_has_visited', 'true');
            navigate('/');
        } catch (err: any) {
            setError(err.message || (language === 'ku' ? 'چوونەژوورەوە سەرکەوتوو نەبوو' : 'فشل تسجيل الدخول'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-5 py-20">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/20">
                        <LogIn size={32} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {t.appName}
                    </h2>
                    <p className="text-slate-600">{t.subtitle}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={`mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm flex-1">{error}</p>
                    </div>
                )}

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-semibold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.email}
                        </label>
                        <div className="relative">
                            <Mail size={20} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base`}
                                placeholder={t.email}
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.password}
                        </label>
                        <div className="relative">
                            <Lock size={20} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base`}
                                placeholder={t.password}
                                dir="ltr"
                            />
                        </div>
                        <div className={`mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <Link to="/forgot-password" className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700">
                                {t.forgot}
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                    >
                        {loading ? t.signingIn : t.signIn}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className={`mt-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-sm text-slate-600">
                        {t.noAccount}{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold">
                            {t.signUp}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
