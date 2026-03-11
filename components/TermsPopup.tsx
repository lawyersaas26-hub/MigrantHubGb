import React from 'react';
import { X } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';

interface TermsPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsPopup: React.FC<TermsPopupProps> = ({ isOpen, onClose }) => {
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';

    if (!isOpen) return null;

    const t = {
        title: language === 'ku' ? 'مەرجەکانی بەکارهێنان' : language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use',
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
                        
                        <p>By using MigrantHub GB, you agree to the following terms.</p>
                        
                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Platform Purpose</h3>
                        <p>The app connects migrant communities in the UK, particularly Kurdish and Arab communities, with useful services and information such as:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Housing and car rentals</li>
                            <li>Legal and accounting services</li>
                            <li>Travel agencies</li>
                            <li>Driving instructors</li>
                            <li>Information to help people settle in the UK</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Platform Role</h3>
                        <p>MigrantHub GB acts only as a platform connecting users with service providers. We do not own, manage, or guarantee the services offered by third parties.</p>
                        <p>Users are responsible for verifying the accuracy and reliability of service providers before engaging with them.</p>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">User Responsibilities</h3>
                        <p>Users agree to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide accurate information</li>
                            <li>Use the platform legally and respectfully</li>
                            <li>Not misuse or attempt to harm the platform</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Limitation of Liability</h3>
                        <p>MigrantHub GB is not responsible for:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Agreements between users and service providers</li>
                            <li>Quality, safety, or legality of services offered by third parties</li>
                            <li>Losses resulting from using services found through the platform</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Account Termination</h3>
                        <p>We may suspend or remove accounts that violate these terms or misuse the platform.</p>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Changes to Terms</h3>
                        <p>We may update these Terms from time to time. Continued use of the app means you accept the updated terms.</p>

                        <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">Contact</h3>
                        <p>For questions, please contact:<br />
                        <a href="mailto:Migranthubgb@gmail.com" className="text-indigo-600 hover:underline font-medium">Migranthubgb@gmail.com</a></p>
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

export default TermsPopup;
