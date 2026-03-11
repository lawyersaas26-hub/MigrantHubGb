import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const translations = {
        ku: {
            title: 'بیرچوونەوەی وشەی نهێنی',
            subtitle: 'ئیمەیڵەکەت بنووسە بۆ گۆڕینی وشەی نهێنی',
            email: 'ئیمەیڵ',
            sendResetLink: 'ناردنی بەستەر',
            sending: 'ناردن...',
            backToLogin: 'گەڕانەوە بۆ چوونەژوورەوە',
            successMessage: 'بەستەری گۆڕینی وشەی نهێنی نێردرا، تکایە سەردانی ئیمەیڵەکەت بکە.',
            invalidEmail: 'تکایە ئیمەیڵێکی دروست بنووسە',
        },
        ar: {
            title: 'نسيت كلمة المرور',
            subtitle: 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور',
            email: 'البريد الإلكتروني',
            sendResetLink: 'إرسال الرابط',
            sending: 'جاري الإرسال...',
            backToLogin: 'العودة لتسجيل الدخول',
            successMessage: 'تم إرسال رابط إعادة تعيين كلمة المرور، يرجى التحقق من بريدك الإلكتروني.',
            invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
        },
        en: {
            title: 'Forgot Password',
            subtitle: 'Enter your email to receive a password reset link',
            email: 'Email',
            sendResetLink: 'Send Reset Link',
            sending: 'Sending...',
            backToLogin: 'Back to Login',
            successMessage: 'Password reset link sent! Please check your inbox.',
            invalidEmail: 'Please enter a valid email address',
        },
    };

    const t = translations[language];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !email.includes('@')) {
            setError(t.invalidEmail);
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            
            if (error) throw error;
            
            setSuccess(t.successMessage);
            setEmail('');
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col p-5 py-8">
            <button
                onClick={() => navigate('/login')}
                className={`self-start p-2 rounded-xl transition-all duration-200 active:scale-95 bg-white shadow-sm border border-slate-200 mb-8`}
            >
                <BackIcon size={24} className="text-slate-700" strokeWidth={2.5} />
            </button>

            <div className="flex-1 flex items-center justify-center -mt-16">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/20">
                            <Mail size={32} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h1>
                        <p className="text-slate-600 px-4">{t.subtitle}</p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm flex-1">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className={`mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-green-700 text-sm flex-1">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                        >
                            {loading ? t.sending : t.sendResetLink}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors">
                            {t.backToLogin}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
