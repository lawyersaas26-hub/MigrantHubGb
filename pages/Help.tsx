import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, HelpCircle, Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const Help: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [feedbackType, setFeedbackType] = useState('general_feedback');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                setEmail(user.email || '');
            }
        };
        checkUser();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const t = {
        title: language === 'ku' ? 'یارمەتی و فیدباک' : language === 'ar' ? 'المساعدة والتعليقات' : 'Help & Feedback',
        desc: language === 'ku' ? 'یارمەتی و پشتیوانی بۆ بەکارهێنەران. تکایە پێشنیارەکانت بنێرە.' : language === 'ar' ? 'مساعدة ودعم للمستخدمين. يرجى إرسال ملاحظاتك.' : 'Help and support for users. We value your feedback.',
        feedbackType: language === 'ku' ? 'جۆری فیدباک' : language === 'ar' ? 'نوع التعليق' : 'Feedback Type',
        general: language === 'ku' ? 'گشتی' : language === 'ar' ? 'عام' : 'General',
        feature: language === 'ku' ? 'پێشنیاری تایبەتمەندی' : language === 'ar' ? 'اقتراح ميزة' : 'Feature Request',
        bug: language === 'ku' ? 'ڕاپۆرتی کێشە' : language === 'ar' ? 'الإبلاغ عن مشكلة' : 'Report a Bug',
        message: language === 'ku' ? 'پەیامەکەت' : language === 'ar' ? 'رسالتك' : 'Your Message',
        emailPlaceholder: language === 'ku' ? 'ئیمەیڵ (ئارەزوومەندانە)' : language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)',
        send: language === 'ku' ? 'ناردن' : language === 'ar' ? 'إرسال' : 'Send Feedback',
        sending: language === 'ku' ? 'ناردن...' : language === 'ar' ? 'جاري الإرسال...' : 'Sending...',
        successMsg: language === 'ku' ? 'سوپاس بۆ فیدباکەکەت! بە سەرکەوتوویی نێردرا.' : language === 'ar' ? 'شكرا لملاحظاتك! تم الإرسال بنجاح.' : 'Thank you for your feedback! It was sent successfully.',
        errorMsg: language === 'ku' ? 'کێشەیەک ڕوویدا لە ناردنی فیدباکەکە.' : language === 'ar' ? 'حدث خطأ أثناء إرسال التعليق.' : 'An error occurred while sending feedback.',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!message.trim()) {
            return;
        }

        setLoading(true);
        try {
            // Note: Make sure the `user_feedback` table exists in Supabase.
            const { error: sbError } = await supabase
                .from('user_feedback')
                .insert([
                    {
                        user_id: userId,
                        user_email: email,
                        feedback_type: feedbackType,
                        message: message,
                    }
                ]);

            if (sbError) throw sbError;
            
            setSuccess(true);
            setMessage('');
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error(err);
            setError(t.errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 py-8">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={handleBack}
                    className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <HelpCircle size={22} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {t.title}
                    </h1>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 mb-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {t.desc}
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full translate-x-16 -translate-y-16 pointer-events-none"></div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <MessageSquare size={20} className="text-indigo-600" />
                    {t.title}
                </h2>

                {error && (
                    <div className={`mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm flex-1 font-semibold">{error}</p>
                    </div>
                )}

                {success && (
                    <div className={`mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700 text-sm flex-1 font-semibold">{t.successMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
                    {!userId && (
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 text-base"
                                placeholder={t.emailPlaceholder}
                                dir="ltr"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t.feedbackType}
                        </label>
                        <select
                            value={feedbackType}
                            onChange={(e) => setFeedbackType(e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 appearance-none text-base"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: isRTL ? 'left 1rem center' : 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="general_feedback">{t.general}</option>
                            <option value="feature_request">{t.feature}</option>
                            <option value="bug_report">{t.bug}</option>
                        </select>
                    </div>

                    <div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 resize-none text-base"
                            placeholder={t.message}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 outline-none text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
                    >
                        {loading ? (
                            <span>{t.sending}</span>
                        ) : (
                            <>
                                <span>{t.send}</span>
                                <Send size={18} strokeWidth={2.5} className={isRTL ? 'rotate-180' : ''} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Help;

