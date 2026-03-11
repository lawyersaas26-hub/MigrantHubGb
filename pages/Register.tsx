import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpUser } from '../lib/userAuth';
import { Mail, Lock, User, AlertCircle, UserPlus, CheckCircle, Check } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import TermsPopup from '../components/TermsPopup';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';

    const translations = {
        ku: {
            title: 'دروستکردنی هەژمار',
            fullName: 'ناوی تەواو',
            email: 'ئیمەیڵ',
            password: 'وشەی نهێنی',
            confirmPassword: 'دووبارەکردنەوەی وشەی نهێنی',
            signUp: 'دروستکردن',
            creating: 'دروستکردن...',
            success: 'هەژمار بە سەرکەوتوویی دروست کرا!',
            redirecting: 'گەڕاندنەوە بۆ چوونەژوورەوە...',
            hasAccount: 'هەژمارت هەیە؟',
            signIn: 'چوونەژوورەوە',
            orContinue: 'یان بەردەوام بە',
            passwordTooShort: 'وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت',
            passwordsNotMatch: 'وشەکانی نهێنی یەکسان نین',
            agreeTo: 'ڕازیم بە ',
            termsOfUse: 'مەرجەکانی بەکارهێنان',
            mustAgree: 'تکایە ڕازی بە بە مەرجەکانی بەکارهێنان',
        },
        ar: {
            title: 'إنشاء حساب',
            fullName: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            signUp: 'إنشاء',
            creating: 'جارٍ الإنشاء...',
            success: 'تم إنشاء الحساب بنجاح!',
            redirecting: 'إعادة التوجيه إلى تسجيل الدخول...',
            hasAccount: 'لديك حساب بالفعل؟',
            signIn: 'تسجيل الدخول',
            orContinue: 'أو تابع مع',
            passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
            passwordsNotMatch: 'كلمات المرور غير متطابقة',
            agreeTo: 'أوافق على ',
            termsOfUse: 'شروط الاستخدام',
            mustAgree: 'يرجى الموافقة على شروط الاستخدام',
        },
        en: {
            title: 'Create Account',
            fullName: 'Full Name',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            signUp: 'Sign Up',
            creating: 'Creating...',
            success: 'Account created successfully!',
            redirecting: 'Redirecting to login...',
            hasAccount: 'Already have an account?',
            signIn: 'Sign In',
            orContinue: 'Or continue with',
            passwordTooShort: 'Password must be at least 6 characters',
            passwordsNotMatch: 'Passwords do not match',
            agreeTo: 'I agree to the ',
            termsOfUse: 'Terms of Use',
            mustAgree: 'Please agree to the Terms of Use',
        },
    };

    const t = translations[language] || translations.en;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (password.length < 6) {
            setError(t.passwordTooShort);
            return;
        }

        if (password !== confirmPassword) {
            setError(t.passwordsNotMatch);
            return;
        }

        if (!acceptedTerms) {
            setError(t.mustAgree);
            return;
        }

        setLoading(true);

        try {
            await signUpUser(email, password, fullName);
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || (language === 'ku' ? 'دروستکردنی هەژمار سەرکەوتوو نەبوو' : 'فشل إنشاء الحساب'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden"
            style={{ 
                height: '100vh',
                maxHeight: '100vh',
                paddingTop: 'env(safe-area-inset-top)',
            }}
        >
            {/* Scrollable Content Area */}
            <div 
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{
                    paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div className="w-full max-w-md mx-auto px-4 py-6">
                    {/* Header - Single Title Only */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/20">
                            <UserPlus size={28} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm flex-1">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className={`mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-green-700 text-sm font-semibold">{t.success}</p>
                                <p className="text-green-600 text-xs mt-1">{t.redirecting}</p>
                            </div>
                        </div>
                    )}

                    {/* Registration Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-semibold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t.fullName}
                            </label>
                            <div className="relative">
                                <User size={18} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-white`}
                                    placeholder={t.fullName}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-semibold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t.email}
                            </label>
                            <div className="relative">
                                <Mail size={18} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-white`}
                                    placeholder={t.email}
                                    dir="ltr"
                                    disabled={loading || success}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-semibold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t.password}
                            </label>
                            <div className="relative">
                                <Lock size={18} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-white`}
                                    placeholder={t.password}
                                    dir="ltr"
                                    disabled={loading || success}
                                />
                            </div>
                            <p className={`mt-1.5 text-xs text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {language === 'ku' ? 'لانیکەم ٦ پیت' : language === 'ar' ? '6 أحرف على الأقل' : 'At least 6 characters'}
                            </p>
                        </div>

                        <div>
                            <label className={`block text-sm font-semibold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t.confirmPassword}
                            </label>
                            <div className="relative">
                                <Lock size={18} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-white`}
                                    placeholder={t.confirmPassword}
                                    dir="ltr"
                                    disabled={loading || success}
                                />
                            </div>
                        </div>

                        {/* Terms of Use */}
                        <div className={`pt-2 flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <label className="relative flex items-center justify-center cursor-pointer mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 rounded-md border-slate-300 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center bg-white">
                                    <Check size={14} className="text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                                </div>
                            </label>
                            <p className={`text-sm text-slate-600 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t.agreeTo}
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }}
                                    className="text-indigo-600 hover:text-indigo-700 font-bold underline px-1"
                                >
                                    {t.termsOfUse}
                                </button>
                            </p>
                        </div>

                        {/* Sign In Link */}
                        <div className={`pt-2 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm text-slate-600">
                                {t.hasAccount}{' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
                                    {t.signIn}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button - Always Visible Above System Buttons */}
            <div 
                className="w-full bg-white border-t border-slate-200 shadow-lg flex-shrink-0"
                style={{
                    paddingTop: '1rem',
                    paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                }}
            >
                <div className="max-w-md mx-auto">
                    <form onSubmit={handleSubmit} className="w-full">
                        <button
                            type="submit"
                            disabled={loading || success || !acceptedTerms}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                        >
                            {loading ? t.creating : success ? t.success : t.signUp}
                        </button>
                    </form>
                </div>
            </div>

            {/* Terms of Use Popup */}
            <TermsPopup 
                isOpen={isTermsOpen} 
                onClose={() => setIsTermsOpen(false)} 
            />
        </div>
    );
};

export default Register;
