import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Store, MapPin, Phone, Mail, Globe, DollarSign, FileText, Building, User } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getBusinessById, type Business } from '../lib/supabase';

const BusinessDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadBusiness();
        }
    }, [id]);

    const loadBusiness = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const businessData = await getBusinessById(id);
            if (businessData && businessData.is_active) {
                setBusiness(businessData);
            } else {
                navigate('/businesses', { replace: true });
            }
        } catch (error) {
            console.error('Error loading business:', error);
            navigate('/businesses', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const categoryNames: Record<string, string> = {
        'food': language === 'ku' ? 'خواردن' : language === 'ar' ? 'طعام' : 'Food & Beverage',
        'retail': language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail',
        'beauty': language === 'ku' ? 'جوانکاری' : language === 'ar' ? 'جمال' : 'Beauty & Salon',
        'automotive': language === 'ku' ? 'ئۆتۆمبێل' : language === 'ar' ? 'سيارات' : 'Automotive',
        'services': language === 'ku' ? 'خزمەتگوزاری' : language === 'ar' ? 'خدمات' : 'Services',
        'other': language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other',
    };

    const businessTypeNames: Record<string, string> = {
        'restaurant': language === 'ku' ? 'خواردنگە' : language === 'ar' ? 'مطعم' : 'Restaurant',
        'shop': language === 'ku' ? 'دوکان' : language === 'ar' ? 'متجر' : 'Shop',
        'service': language === 'ku' ? 'خزمەتگوزاری' : language === 'ar' ? 'خدمة' : 'Service',
        'retail': language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail',
        'other': language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other',
    };

    if (loading) {
        return (
            <div className="px-5 pb-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!business) {
        return null;
    }

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6">
                <button
                    onClick={handleBack}
                    className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {language === 'ku' ? 'وردەکاریەکانی کاروبار' : language === 'ar' ? 'تفاصيل العمل التجاري' : 'Business Details'}
                    </h1>
                </div>
            </div>

            {/* Business Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                {/* Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Store size={40} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                            {business.business_name}
                        </h2>
                        {business.business_type && (
                            <p className="text-slate-600 flex items-center gap-2">
                                <Building size={18} />
                                {businessTypeNames[business.business_type] || business.business_type}
                            </p>
                        )}
                    </div>
                </div>

                {/* Business Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {business.location && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <MapPin size={18} className="text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">
                                    {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                                </p>
                                <p className="font-semibold text-slate-900 text-sm">{business.location}</p>
                            </div>
                        </div>
                    )}
                    {business.category && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                            <Store size={18} className="text-amber-600" />
                            <div>
                                <p className="text-xs text-amber-600 mb-0.5">
                                    {language === 'ku' ? 'بەش' : language === 'ar' ? 'الفئة' : 'Category'}
                                </p>
                                <p className="font-semibold text-amber-700 text-sm capitalize">
                                    {categoryNames[business.category] || business.category}
                                </p>
                            </div>
                        </div>
                    )}
                    {business.price && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                            <DollarSign size={18} className="text-green-600" />
                            <div>
                                <p className="text-xs text-green-600 mb-0.5">
                                    {language === 'ku' ? 'نرخ' : language === 'ar' ? 'السعر' : 'Price'}
                                </p>
                                <p className="font-semibold text-green-700 text-sm">£{business.price.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                    {business.contact_name && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                            <User size={18} className="text-blue-600" />
                            <div>
                                <p className="text-xs text-blue-600 mb-0.5">
                                    {language === 'ku' ? 'پەیوەندیکار' : language === 'ar' ? 'جهة الاتصال' : 'Contact'}
                                </p>
                                <p className="font-semibold text-blue-700 text-sm">{business.contact_name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {business.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText size={20} />
                            {language === 'ku' ? 'وەسف' : language === 'ar' ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {business.description}
                        </p>
                    </div>
                )}

                {/* Contact Information */}
                <div className="mb-6 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {language === 'ku' ? 'زانیاری پەیوەندی' : language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                    </h3>
                    <div className="space-y-2">
                        {business.contact_phone && (
                            <a
                                href={`tel:${business.contact_phone}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Phone size={18} />
                                <span>{business.contact_phone}</span>
                            </a>
                        )}
                        {business.contact_email && (
                            <a
                                href={`mailto:${business.contact_email}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Mail size={18} />
                                <span>{business.contact_email}</span>
                            </a>
                        )}
                        {business.website && (
                            <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Globe size={18} />
                                <span>{business.website}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetail;









