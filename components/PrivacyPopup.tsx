import React from 'react';
import { X } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';

interface PrivacyPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyPopup: React.FC<PrivacyPopupProps> = ({ isOpen, onClose }) => {
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';

    if (!isOpen) return null;

    const t = {
        title: language === 'ku' ? 'تایبەتمەندی' : language === 'ar' ? 'الخصوصية' : 'Privacy Policy',
        close: language === 'ku' ? 'داخستن' : language === 'ar' ? 'إغلاق' : 'Close'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div 
                className={`bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label={t.close}
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content (Rendered in English to preserve legal meaning as provided) */}
                <div 
                    className="p-6 overflow-y-auto w-full"
                    dir="ltr" 
                    style={{ textAlign: 'left' }}
                >
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-4">
                        <p className="font-semibold text-slate-500">Effective Date: 10/03/2026</p>
                        
                        <p>Your privacy is important to us. This Privacy Policy explains how the Migrant Hub app collects, uses, and protects your information.</p>
                        
                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Information We Collect</h3>
                        <p>We may collect the following information when you use the app:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Basic account information (name, email, phone number)</li>
                            <li>Location information (to show nearby services)</li>
                            <li>Profile details you choose to provide</li>
                            <li>Messages or inquiries sent through the platform</li>
                            <li>Device and usage information</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">How We Use Your Information</h3>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide access to services such as housing, cars, lawyers, accountants, travel agents, and driving instructors</li>
                            <li>Help migrant communities find useful information and support in the UK</li>
                            <li>Improve the app and user experience</li>
                            <li>Communicate with you about your account or services</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Sharing Information</h3>
                        <p>We may share limited information with service providers listed in the app (for example landlords or professionals) when you contact them through the platform.</p>
                        <p>We do not sell your personal data to third parties.</p>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Data Security</h3>
                        <p>We take reasonable steps to protect your personal information from unauthorized access or misuse.</p>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Your Rights</h3>
                        <p>You can request to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Access your data</li>
                            <li>Correct your information</li>
                            <li>Delete your account</li>
                        </ul>

                        <p>Please contact us at: <a href="mailto:Migranthubgb@gmail.com" className="text-indigo-600 hover:underline font-medium">Migranthubgb@gmail.com</a></p>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Changes to This Policy</h3>
                        <p>We may update this Privacy Policy from time to time. Updates will be posted in the app</p>
                    </div>
                </div>
                
                {/* Footer Button */}
                <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-bold transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPopup;
