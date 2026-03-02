import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Car as CarIcon, MapPin, Calendar, Gauge, DollarSign, Fuel, Settings, Palette, Phone, Mail } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getCarById, type Car } from '../lib/supabase';

const CarDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadCar();
        }
    }, [id]);

    const loadCar = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const carData = await getCarById(id);
            if (carData && carData.is_active) {
                setCar(carData);
            } else {
                navigate('/cars', { replace: true });
            }
        } catch (error) {
            console.error('Error loading car:', error);
            navigate('/cars', { replace: true });
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
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!car) {
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
                        {language === 'ku' ? 'وردەکاریەکانی ئۆتۆمبێل' : language === 'ar' ? 'تفاصيل السيارة' : 'Car Details'}
                    </h1>
                </div>
            </div>

            {/* Car Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                {/* Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CarIcon size={40} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                            {car.make} {car.model}
                        </h2>
                        {car.year && (
                            <p className="text-slate-600">{car.year}</p>
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-3xl font-bold text-green-600">£{car.price.toLocaleString()}</p>
                    </div>
                </div>

                {/* Car Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {car.location && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <MapPin size={18} className="text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">
                                    {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                                </p>
                                <p className="font-semibold text-slate-900 text-sm">{car.location}</p>
                            </div>
                        </div>
                    )}
                    {car.mileage && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                            <Gauge size={18} className="text-blue-600" />
                            <div>
                                <p className="text-xs text-blue-600 mb-0.5">
                                    {language === 'ku' ? 'مایل' : language === 'ar' ? 'المسافة المقطوعة' : 'Mileage'}
                                </p>
                                <p className="font-semibold text-blue-700 text-sm">{car.mileage.toLocaleString()} mi</p>
                            </div>
                        </div>
                    )}
                    {car.fuel_type && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                            <Fuel size={18} className="text-green-600" />
                            <div>
                                <p className="text-xs text-green-600 mb-0.5">
                                    {language === 'ku' ? 'جۆری سووتەمەنی' : language === 'ar' ? 'نوع الوقود' : 'Fuel Type'}
                                </p>
                                <p className="font-semibold text-green-700 text-sm capitalize">{car.fuel_type}</p>
                            </div>
                        </div>
                    )}
                    {car.transmission && (
                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                            <Settings size={18} className="text-purple-600" />
                            <div>
                                <p className="text-xs text-purple-600 mb-0.5">
                                    {language === 'ku' ? 'جۆری بۆکس' : language === 'ar' ? 'نوع ناقل الحركة' : 'Transmission'}
                                </p>
                                <p className="font-semibold text-purple-700 text-sm capitalize">{car.transmission}</p>
                            </div>
                        </div>
                    )}
                    {car.color && (
                        <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-xl">
                            <Palette size={18} className="text-pink-600" />
                            <div>
                                <p className="text-xs text-pink-600 mb-0.5">
                                    {language === 'ku' ? 'ڕەنگ' : language === 'ar' ? 'اللون' : 'Color'}
                                </p>
                                <p className="font-semibold text-pink-700 text-sm capitalize">{car.color}</p>
                            </div>
                        </div>
                    )}
                    {car.condition && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                            <Calendar size={18} className="text-amber-600" />
                            <div>
                                <p className="text-xs text-amber-600 mb-0.5">
                                    {language === 'ku' ? 'دۆخ' : language === 'ar' ? 'الحالة' : 'Condition'}
                                </p>
                                <p className="font-semibold text-amber-700 text-sm capitalize">{car.condition.replace('-', ' ')}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {car.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                            {language === 'ku' ? 'وەسف' : language === 'ar' ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {car.description}
                        </p>
                    </div>
                )}

                {/* Contact Information */}
                <div className="mb-6 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {language === 'ku' ? 'زانیاری پەیوەندی' : language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-700">
                            <span className="font-semibold">{car.contact_name}</span>
                        </div>
                        {car.contact_phone && (
                            <a
                                href={`tel:${car.contact_phone}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Phone size={18} />
                                <span>{car.contact_phone}</span>
                            </a>
                        )}
                        {car.contact_email && (
                            <a
                                href={`mailto:${car.contact_email}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <Mail size={18} />
                                <span>{car.contact_email}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
