import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Home as HomeIcon, MapPin, DollarSign, Bed, Bath, Calendar, Building, Phone, Mail, Check, X } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getHomeById, type Home } from '../lib/supabase';

const HomeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [home, setHome] = useState<Home | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadHome();
        }
    }, [id]);

    const loadHome = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const homeData = await getHomeById(id);
            if (homeData && homeData.is_active) {
                setHome(homeData);
            } else {
                navigate('/homes', { replace: true });
            }
        } catch (error) {
            console.error('Error loading home:', error);
            navigate('/homes', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="px-5 pb-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!home) {
        return null;
    }

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6">
                <button
                    onClick={handleBack}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ku' ? 'وردەکاریەکانی ماڵ' : language === 'ar' ? 'تفاصيل المنزل' : 'Home Details'}
                    </h1>
                </div>
            </div>

            {/* Home Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 dark:border-slate-700 mb-6">
                {/* Title and Price */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <HomeIcon size={40} className="text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {home.title}
                        </h2>
                        {home.address && (
                            <p className="text-slate-600 dark:text-slate-400">{home.address}</p>
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">£{home.rent_amount.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {language === 'ku' ? '/مانگ' : language === 'ar' ? '/شهر' : '/month'}
                        </p>
                    </div>
                </div>

                {/* Home Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {home.location && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <MapPin size={18} className="text-slate-500 dark:text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                                    {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                                </p>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{home.location}</p>
                            </div>
                        </div>
                    )}
                    {home.city && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Building size={18} className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">
                                    {language === 'ku' ? 'شار' : language === 'ar' ? 'المدينة' : 'City'}
                                </p>
                                <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{home.city}</p>
                            </div>
                        </div>
                    )}
                    {home.bedrooms !== undefined && home.bedrooms !== null && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <Bed size={18} className="text-green-600 dark:text-green-400" />
                            <div>
                                <p className="text-xs text-green-600 dark:text-green-400 mb-0.5">
                                    {language === 'ku' ? 'ژووری خەوتن' : language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                                </p>
                                <p className="font-semibold text-green-700 dark:text-green-300 text-sm">{home.bedrooms}</p>
                            </div>
                        </div>
                    )}
                    {home.bathrooms !== undefined && home.bathrooms !== null && (
                        <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Bath size={18} className="text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mb-0.5">
                                    {language === 'ku' ? 'حەمام' : language === 'ar' ? 'الحمام' : 'Bathrooms'}
                                </p>
                                <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">{home.bathrooms}</p>
                            </div>
                        </div>
                    )}
                    {home.property_type && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <HomeIcon size={18} className="text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mb-0.5">
                                    {language === 'ku' ? 'جۆری ماڵ' : language === 'ar' ? 'نوع العقار' : 'Property Type'}
                                </p>
                                <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm capitalize">{home.property_type}</p>
                            </div>
                        </div>
                    )}
                    {home.furnished && (
                        <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                            <HomeIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
                            <div>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {language === 'ku' ? 'ئامادە' : language === 'ar' ? 'مفروش' : 'Furnished'}
                                </p>
                                <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm capitalize">{home.furnished.replace('-', ' ')}</p>
                            </div>
                        </div>
                    )}
                    {home.available_from && (
                        <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                            <Calendar size={18} className="text-pink-600 dark:text-pink-400" />
                            <div>
                                <p className="text-xs text-pink-600 dark:text-pink-400 mb-0.5">
                                    {language === 'ku' ? 'بەردەست لە' : language === 'ar' ? 'متاح من' : 'Available From'}
                                </p>
                                <p className="font-semibold text-pink-700 dark:text-pink-300 text-sm">
                                    {new Date(home.available_from).toLocaleDateString(language === 'ku' ? 'ku' : language === 'ar' ? 'ar' : 'en-GB')}
                                </p>
                            </div>
                        </div>
                    )}
                    {home.deposit_amount && (
                        <div className="flex items-center gap-2 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                            <DollarSign size={18} className="text-cyan-600 dark:text-cyan-400" />
                            <div>
                                <p className="text-xs text-cyan-600 dark:text-cyan-400 mb-0.5">
                                    {language === 'ku' ? 'داشکاندن' : language === 'ar' ? 'الوديعة' : 'Deposit'}
                                </p>
                                <p className="font-semibold text-cyan-700 dark:text-cyan-300 text-sm">£{home.deposit_amount.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                    {home.minimum_tenancy_months && (
                        <div className="flex items-center gap-2 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                            <Calendar size={18} className="text-teal-600 dark:text-teal-400" />
                            <div>
                                <p className="text-xs text-teal-600 dark:text-teal-400 mb-0.5">
                                    {language === 'ku' ? 'کەمترین ماوە' : language === 'ar' ? 'الحد الأدنى' : 'Min Tenancy'}
                                </p>
                                <p className="font-semibold text-teal-700 dark:text-teal-300 text-sm">
                                    {home.minimum_tenancy_months} {language === 'ku' ? 'مانگ' : language === 'ar' ? 'شهر' : 'months'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="mb-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {language === 'ku' ? 'تایبەتمەندیەکان' : language === 'ar' ? 'المميزات' : 'Features'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            {home.bills_included ? (
                                <Check size={18} className="text-green-600 dark:text-green-400" />
                            ) : (
                                <X size={18} className="text-slate-400" />
                            )}
                            <span className={`text-sm ${home.bills_included ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'ku' ? 'بەیلەکان لەگەڵدایە' : language === 'ar' ? 'الفواتير مشمولة' : 'Bills Included'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {home.parking_available ? (
                                <Check size={18} className="text-green-600 dark:text-green-400" />
                            ) : (
                                <X size={18} className="text-slate-400" />
                            )}
                            <span className={`text-sm ${home.parking_available ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'ku' ? 'پارکینگ' : language === 'ar' ? 'موقف سيارات' : 'Parking Available'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {home.garden_available ? (
                                <Check size={18} className="text-green-600 dark:text-green-400" />
                            ) : (
                                <X size={18} className="text-slate-400" />
                            )}
                            <span className={`text-sm ${home.garden_available ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'ku' ? 'باخچە' : language === 'ar' ? 'حديقة' : 'Garden Available'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {home.pets_allowed ? (
                                <Check size={18} className="text-green-600 dark:text-green-400" />
                            ) : (
                                <X size={18} className="text-slate-400" />
                            )}
                            <span className={`text-sm ${home.pets_allowed ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'ku' ? 'هاوەڵەکان ڕێگەپێدراون' : language === 'ar' ? 'الحيوانات الأليفة مسموحة' : 'Pets Allowed'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {home.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {language === 'ku' ? 'وەسف' : language === 'ar' ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {home.description}
                        </p>
                    </div>
                )}

                {/* Contact Information */}
                <div className="mb-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {language === 'ku' ? 'زانیاری پەیوەندی' : language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">{home.contact_name}</span>
                        </div>
                        {home.contact_phone && (
                            <a
                                href={`tel:${home.contact_phone}`}
                                className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold"
                            >
                                <Phone size={18} />
                                <span>{home.contact_phone}</span>
                            </a>
                        )}
                        {home.contact_email && (
                            <a
                                href={`mailto:${home.contact_email}`}
                                className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold"
                            >
                                <Mail size={18} />
                                <span>{home.contact_email}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeDetail;






