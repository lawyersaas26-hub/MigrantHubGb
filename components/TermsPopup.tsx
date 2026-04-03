import React from 'react';
import { X, ExternalLink } from 'lucide-react';
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
        title: language === 'ku' ? 'مەرجەکانی بەکارهێنان' : language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use (EULA)',
        close: language === 'ku' ? 'داخستن' : language === 'ar' ? 'إغلاق' : 'Close'
    };

    const openExternalLink = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div 
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 dark:text-slate-400 space-y-4">
                        <p className="font-semibold text-slate-500 dark:text-slate-400">Effective Date: 10/03/2026</p>
                        
                        <p>By using MigrantHub GB, you agree to the following terms.</p>
                        
                        {/* Subscription Section - Required by Apple App Store - MOVED TO TOP FOR VISIBILITY */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 my-4">
                            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                                {language === 'ku' ? 'بەشداریکردن و نوێکردنەوەی خۆکار' : language === 'ar' ? 'الاشتراكات والتجديد التلقائي' : 'Subscriptions and Auto-Renewal'}
                            </h3>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">MigrantHub GB offers the following auto-renewable subscription plans:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li><strong>Light Plan</strong> — £6.99/month. Access to all resources, search functionality, favorites, and immigration information.</li>
                                <li><strong>Gold Plan</strong> — £19.99/month. All Light features plus access to job listings, lawyers, accountants, driving instructors, and car listings.</li>
                                <li><strong>Business Plan</strong> — £39.99/month. All Gold features plus the ability to post listings, priority support, and unlimited listings.</li>
                            </ul>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Subscriptions automatically renew each month unless cancelled at least 24 hours before the renewal date. Payment is charged to your Apple ID account at confirmation of purchase. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage or cancel your subscription at any time in your device's App Store subscription settings. No refund is provided for any unused section of a subscription period.
                            </p>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">Platform Purpose</h3>
                        <p>The app connects migrant communities in the UK, particularly Kurdish and Arab communities, with useful services and information such as:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Housing and car rentals</li>
                            <li>Legal and accounting services</li>
                            <li>Travel agencies</li>
                            <li>Driving instructors</li>
                            <li>Information to help people settle in the UK</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">Platform Role</h3>
                        <p>MigrantHub GB acts only as a platform connecting users with service providers. We do not own, manage, or guarantee the services offered by third parties.</p>
                        <p>Users are responsible for verifying the accuracy and reliability of service providers before engaging with them.</p>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">User Responsibilities</h3>
                        <p>Users agree to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide accurate information</li>
                            <li>Use the platform legally and respectfully</li>
                            <li>Not misuse or attempt to harm the platform</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">Limitation of Liability</h3>
                        <p>MigrantHub GB is not responsible for:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Agreements between users and service providers</li>
                            <li>Quality, safety, or legality of services offered by third parties</li>
                            <li>Losses resulting from using services found through the platform</li>
                        </ul>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">Account Termination</h3>
                        <p>We may suspend or remove accounts that violate these terms or misuse the platform.</p>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">Changes to Terms</h3>
                        <p>We may update these Terms from time to time. Continued use of the app means you accept the updated terms.</p>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">Contact</h3>
                        <p>For questions, please contact:<br />
                        <a href="mailto:Migranthubgb@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Migranthubgb@gmail.com</a></p>

                        {/* Functional Links Section - Required by Apple */}
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">You can also view these documents online:</p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => openExternalLink('https://sites.google.com/view/migranthubterms/')}
                                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                >
                                    <ExternalLink size={14} />
                                    Terms of Use (EULA)
                                </button>
                                <button
                                    onClick={() => openExternalLink('https://sites.google.com/view/migranthubgb/')}
                                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                >
                                    <ExternalLink size={14} />
                                    Privacy Policy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer Button */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-xl font-bold transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsPopup;
