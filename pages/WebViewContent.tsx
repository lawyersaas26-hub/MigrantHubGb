import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, ExternalLink } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

const WebViewContent: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const url = searchParams.get('url') || '';
    const title = searchParams.get('title') || '';
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const loadCheckRef = useRef<boolean>(false);

    // Check if iframe is blocked and automatically fall back to Browser
    useEffect(() => {
        if (!url) return;

        // Function to open in Browser plugin (fallback for blocked iframes)
        const openInBrowser = async () => {
            if (Capacitor.isNativePlatform()) {
                try {
                    await Browser.open({
                        url: url,
                        toolbarColor: '#ffffff',
                        presentationStyle: 'popover',
                    });
                    // Close this view after opening browser
                    setTimeout(() => navigate(-1), 300);
                } catch (err) {
                    console.error('Failed to open in Browser:', err);
                    setError(true);
                    setBlocked(false);
                }
            } else {
                // Web fallback - open in new tab
                window.open(url, '_blank', 'noopener,noreferrer');
                navigate(-1);
            }
        };

        // Set timeout to detect if iframe is blocked (3 seconds - faster detection)
        timeoutRef.current = setTimeout(() => {
            if (!loadCheckRef.current && loading) {
                // Iframe didn't load within timeout, likely blocked
                console.log('Iframe likely blocked, falling back to Browser plugin');
                setBlocked(true);
                setLoading(false);
                openInBrowser();
            }
        }, 3000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [url, loading, navigate]);

    const handleClose = () => {
        navigate(-1);
    };

    const handleOpenExternal = async () => {
        if (Capacitor.isNativePlatform()) {
            // Use Capacitor Browser plugin on native
            try {
                await Browser.open({
                    url: url,
                    toolbarColor: '#ffffff',
                    presentationStyle: 'popover',
                });
                navigate(-1);
            } catch (err) {
                console.error('Failed to open in Browser:', err);
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } else {
            // Web fallback
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    if (!url) {
        return (
            <div className="flex items-center justify-center min-h-screen p-5">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">
                        {language === 'ku' ? 'لینک دۆزرایەوە' : 'الرابط غير موجود'}
                    </p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
                    >
                        {language === 'ku' ? 'گەڕانەوە' : 'رجوع'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100vh', zIndex: 9999 }}>
            {/* Custom Header - Native App Style */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
                <button
                    onClick={handleClose}
                    className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                <div className="flex-1 mx-4 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate text-center" dir="ltr">
                        {title || 'Content'}
                    </p>
                    {loading && (
                        <p className="text-xs text-slate-500 text-center mt-0.5">
                            {language === 'ku' ? 'بارکردن...' : 'جارٍ التحميل...'}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleOpenExternal}
                    className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Open in external browser"
                    title={language === 'ku' ? 'کردنەوەی لە براوزەر' : 'افتح في المتصفح'}
                >
                    <ExternalLink size={20} className="text-slate-600" strokeWidth={2.5} />
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 top-16 flex items-center justify-center bg-white z-10">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : 'جارٍ التحميل...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 top-16 flex items-center justify-center bg-white z-10 p-5">
                    <div className="text-center max-w-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X size={32} className="text-red-600" />
                        </div>
                        <p className="text-slate-700 font-semibold mb-2">
                            {language === 'ku' ? 'نەتوانرا پەڕەکە لە ناو ئەپ بێت' : 'لا يمكن عرض الصفحة داخل التطبيق'}
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                            {language === 'ku' 
                                ? 'ئەم وێبسایتە ڕێگەی دەگرێت لە ناو ئەپ بێت. تکایە لە براوزەر بیکەوە.'
                                : 'هذا الموقع يمنع العرض داخل التطبيق. الرجاء الفتح في المتصفح.'
                            }
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => {
                                    setError(false);
                                    setLoading(true);
                                    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                                    if (iframe) {
                                        iframe.src = url;
                                    }
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm"
                            >
                                {language === 'ku' ? 'دووبارە هەوڵ بدە' : 'إعادة المحاولة'}
                            </button>
                            <button
                                onClick={handleOpenExternal}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm"
                            >
                                {language === 'ku' ? 'لە براوزەر بیکەوە' : 'افتح في المتصفح'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blocked Message - Auto-opening in browser */}
            {blocked && (
                <div className="absolute inset-0 top-16 flex items-center justify-center bg-white z-10 p-5">
                    <div className="text-center max-w-sm">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ExternalLink size={32} className="text-blue-600" />
                        </div>
                        <p className="text-slate-700 font-semibold mb-2">
                            {language === 'ku' ? 'کردنەوەی لە براوزەر' : 'الفتح في المتصفح'}
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                            {language === 'ku' 
                                ? 'پەڕەکە بە شێوەیەکی خۆکار دەکرێتەوە لە براوزەر...'
                                : 'سيتم فتح الصفحة تلقائيًا في المتصفح...'
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* WebView/Iframe - Native Content */}
            {!blocked && (
                <iframe
                    ref={iframeRef}
                    src={url}
                    className="flex-1 w-full border-0 bg-white"
                    title={title || 'Web Content'}
                    onLoad={(e) => {
                        loadCheckRef.current = true;
                        
                        // Clear timeout since iframe loaded
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }

                        // Check if iframe actually loaded content or was blocked
                        try {
                            const iframe = e.currentTarget;
                            
                            // Try to check if iframe content is accessible
                            // If blocked by X-Frame-Options, we might still be able to detect it
                            setTimeout(() => {
                                try {
                                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                                    if (iframeDoc) {
                                        // Check if iframe has content (not just blank/error page)
                                        const body = iframeDoc.body;
                                        if (body && (body.innerHTML.trim().length > 100 || body.children.length > 0)) {
                                            // Content loaded successfully
                                            setLoading(false);
                                            setError(false);
                                        } else {
                                            // Iframe loaded but appears blank - might be blocked
                                            console.log('Iframe appears blank, might be blocked');
                                            // Still show it, user might see something
                                            setLoading(false);
                                            setError(false);
                                        }
                                    } else {
                                        // Can't access document - likely blocked by CORS
                                        // But onLoad fired, so let's assume it's working
                                        setLoading(false);
                                        setError(false);
                                    }
                                } catch (accessError) {
                                    // Can't access iframe - blocked by CORS/X-Frame-Options
                                    // But onLoad fired, so content might still be visible to user
                                    console.log('Cannot access iframe content (likely CORS/X-Frame-Options):', accessError);
                                    // Content might still be visible even if we can't access it
                                    setLoading(false);
                                    setError(false);
                                    
                                    // Note: We can't reliably detect if content is actually visible
                                    // If onLoad fired but we can't access content, it might still work
                                    // User will see if it's blank and can use the external browser button
                                }
                            }, 500); // Small delay to let content render
                        } catch (err) {
                            console.log('Iframe load check error:', err);
                            setLoading(false);
                            setError(false);
                        }
                    }}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ 
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: (error || blocked) ? 'none' : 'block',
                    }}
                />
            )}
        </div>
    );
};

export default WebViewContent;

