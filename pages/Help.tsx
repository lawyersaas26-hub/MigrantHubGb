import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';

const Help: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const handleBack = () => {
        navigate(-1);
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
                        {language === 'ku' ? 'یارمەتی' : language === 'ar' ? 'المساعدة' : 'Help'}
                    </h1>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400">
                    {language === 'ku' 
                        ? 'یارمەتی و پشتیوانی بۆ بەکارهێنەران'
                        : language === 'ar'
                        ? 'مساعدة ودعم للمستخدمين'
                        : 'Help and support for users'
                    }
                </p>
            </div>
        </div>
    );
};

export default Help;

