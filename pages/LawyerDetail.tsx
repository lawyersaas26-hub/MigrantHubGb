import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Scale, MapPin, Building, Phone, Mail, Globe, Languages, Calendar, DollarSign, FileText } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getLawyerById, type Lawyer } from '../lib/supabase';

const LawyerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [lawyer, setLawyer] = useState<Lawyer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadLawyer();
        }
    }, [id]);

    const loadLawyer = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const lawyerData = await getLawyerById(id);
            if (lawyerData && lawyerData.is_active) {
                setLawyer(lawyerData);
            } else {
                navigate('/lawyers', { replace: true });
            }
        } catch (error) {
            console.error('Error loading lawyer:', error);
            navigate('/lawyers', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const specializationNames: Record<string, string> = {
        'immigration': language === 'ku' ? 'کۆچکردن' : language === 'ar' ? 'الهجرة' : 'Immigration',
        'family': language === 'ku' ? 'خێزان' : language === 'ar' ? 'العائلة' : 'Family',
        'criminal': language === 'ku' ? 'تاوان' : language === 'ar' ? 'جنائي' : 'Criminal',
        'employment': language === 'ku' ? 'کار' : language === 'ar' ? 'العمل' : 'Employment',
        'housing': language === 'ku' ? 'نیشتەجێبوون' : language === 'ar' ? 'السكن' : 'Housing',
        'general': language === 'ku' ? 'گشتی' : language === 'ar' ? 'عام' : 'General',
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

    if (!lawyer) {
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
                        {language === 'ku' ? 'وردەکاریەکانی پارێزه‌ر' : language === 'ar' ? 'تفاصيل المحامي' : 'Lawyer Details'}
                    </h1>
                </div>
            </div>

            {/* Lawyer Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                {/* Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Scale size={40} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                            {lawyer.name}
                        </h2>
                        {lawyer.firm_name && (
                            <p className="text-slate-600 flex items-center gap-2">
                                <Building size={18} />
                                {lawyer.firm_name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Lawyer Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {lawyer.location && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <MapPin size={18} className="text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">
                                    {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                                </p>
                                <p className="font-semibold text-slate-900 text-sm">{lawyer.location}</p>
                            </div>
                        </div>
                    )}
                    {lawyer.specialization && (
                        <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl">
                            <Scale size={18} className="text-indigo-600" />
                            <div>
                                <p className="text-xs text-indigo-600 mb-0.5">
                                    {language === 'ku' ? 'تایبەتمەندی' : language === 'ar' ? 'التخصص' : 'Specialization'}
                                </p>
                                <p className="font-semibold text-indigo-700 text-sm capitalize">
                                    {specializationNames[lawyer.specialization] || lawyer.specialization}
                                </p>
                            </div>
                        </div>
                    )}
                    {lawyer.experience_years && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                            <Calendar size={18} className="text-blue-600" />
                            <div>
                                <p className="text-xs text-blue-600 mb-0.5">
                                    {language === 'ku' ? 'ئەزموون' : language === 'ar' ? 'الخبرة' : 'Experience'}
                                </p>
                                <p className="font-semibold text-blue-700 text-sm">{lawyer.experience_years} {language === 'ku' ? 'ساڵ' : language === 'ar' ? 'سنة' : 'years'}</p>
                            </div>
                        </div>
                    )}
                    {lawyer.consultation_fee && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                            <DollarSign size={18} className="text-green-600" />
                            <div>
                                <p className="text-xs text-green-600 mb-0.5">
                                    {language === 'ku' ? 'نرخی مشاورە' : language === 'ar' ? 'رسوم الاستشارة' : 'Consultation Fee'}
                                </p>
                                <p className="font-semibold text-green-700 text-sm">£{lawyer.consultation_fee.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Languages */}
                {lawyer.languages && lawyer.languages.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                            <Languages size={18} className="text-purple-600" />
                            <div>
                                <p className="text-xs text-purple-600 mb-0.5">
                                    {language === 'ku' ? 'زمانەکان' : language === 'ar' ? 'اللغات' : 'Languages'}
                                </p>
                                <p className="font-semibold text-purple-700 text-sm">{lawyer.languages.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Description */}
                {lawyer.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText size={20} />
                            {language === 'ku' ? 'وەسف' : language === 'ar' ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {lawyer.description}
                        </p>
                    </div>
                )}

                {/* Contact Information */}
                <div className="mb-6 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {language === 'ku' ? 'زانیاری پەیوەندی' : language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                    </h3>
                    <div className="space-y-2">
                        {lawyer.phone && (
                            <a
                                href={`tel:${lawyer.phone}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Phone size={18} />
                                <span>{lawyer.phone}</span>
                            </a>
                        )}
                        {lawyer.email && (
                            <a
                                href={`mailto:${lawyer.email}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Mail size={18} />
                                <span>{lawyer.email}</span>
                            </a>
                        )}
                        {lawyer.website && (
                            <a
                                href={lawyer.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Globe size={18} />
                                <span>{lawyer.website}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawyerDetail;
