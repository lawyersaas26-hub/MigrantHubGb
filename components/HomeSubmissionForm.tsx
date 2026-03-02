import React, { useState } from 'react';
import { X, Home, MapPin, DollarSign, Bed, Bath, Calendar, Phone, Mail, Building } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { submitHome } from '../lib/supabase';

interface HomeSubmissionFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const HomeSubmissionForm: React.FC<HomeSubmissionFormProps> = ({ onClose, onSuccess }) => {
    const { language } = useTranslations();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        city: '',
        location: '',
        description: '',
        rent_amount: '',
        bedrooms: '',
        bathrooms: '',
        property_type: '',
        furnished: '',
        available_from: '',
        minimum_tenancy_months: '',
        deposit_amount: '',
        bills_included: false,
        parking_available: false,
        garden_available: false,
        pets_allowed: false,
        contact_name: '',
        contact_phone: '',
        contact_email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await submitHome({
                title: formData.title.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                rent_amount: parseFloat(formData.rent_amount),
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
                property_type: formData.property_type || undefined,
                furnished: formData.furnished || undefined,
                available_from: formData.available_from || undefined,
                minimum_tenancy_months: formData.minimum_tenancy_months ? parseInt(formData.minimum_tenancy_months) : undefined,
                deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : undefined,
                bills_included: formData.bills_included,
                parking_available: formData.parking_available,
                garden_available: formData.garden_available,
                pets_allowed: formData.pets_allowed,
                contact_name: formData.contact_name.trim(),
                contact_phone: formData.contact_phone.trim(),
                contact_email: formData.contact_email.trim() || undefined,
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error submitting home:', error);
            alert(language === 'ku' 
                ? `هەڵەیەک ڕوویدا: ${error?.message || 'Unknown error'}`
                : language === 'ar'
                ? `حدث خطأ: ${error?.message || 'Unknown error'}`
                : `An error occurred: ${error?.message || 'Unknown error'}`
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ku' ? 'زیادکردنی ماڵ بۆ کرێ' : language === 'ar' ? 'إضافة منزل للإيجار' : 'Add Home for Rent'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {language === 'ku' ? 'ناونیشان *' : language === 'ar' ? 'العنوان *' : 'Title *'}
                        </label>
                        <div className="relative">
                            <Home size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: 2 Bedroom Flat in London' : language === 'ar' ? 'مثل: شقة بغرفتين في لندن' : 'e.g.: 2 Bedroom Flat in London'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                            />
                        </div>
                    </div>

                    {/* Address and City */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'ناونیشان *' : language === 'ar' ? 'العنوان *' : 'Address *'}
                            </label>
                            <div className="relative">
                                <MapPin size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder={language === 'ku' ? 'ناونیشان' : language === 'ar' ? 'العنوان' : 'Address'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'شار *' : language === 'ar' ? 'المدينة *' : 'City *'}
                            </label>
                            <div className="relative">
                                <Building size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: London' : language === 'ar' ? 'مثل: London' : 'e.g.: London'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {language === 'ku' ? 'شوێن *' : language === 'ar' ? 'الموقع *' : 'Location *'}
                        </label>
                        <div className="relative">
                            <MapPin size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: Central London' : language === 'ar' ? 'مثل: Central London' : 'e.g.: Central London'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                            />
                        </div>
                    </div>

                    {/* Rent Amount and Property Type */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'کرێ (بە مانگ) *' : language === 'ar' ? 'الإيجار (شهريا) *' : 'Rent (per month) *'}
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.rent_amount}
                                    onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                                    placeholder="£0.00"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'جۆری ماڵ' : language === 'ar' ? 'نوع العقار' : 'Property Type'}
                            </label>
                            <select
                                value={formData.property_type}
                                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                            >
                                <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                <option value="house">{language === 'ku' ? 'ماڵ' : language === 'ar' ? 'منزل' : 'House'}</option>
                                <option value="flat">{language === 'ku' ? 'فلەت' : language === 'ar' ? 'شقة' : 'Flat'}</option>
                                <option value="apartment">{language === 'ku' ? 'ئەپارتمێنت' : language === 'ar' ? 'شقة' : 'Apartment'}</option>
                                <option value="studio">{language === 'ku' ? 'ستودیۆ' : language === 'ar' ? 'استوديو' : 'Studio'}</option>
                                <option value="room">{language === 'ku' ? 'ژوور' : language === 'ar' ? 'غرفة' : 'Room'}</option>
                            </select>
                        </div>
                    </div>

                    {/* Bedrooms and Bathrooms */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'ژووری خەوتن' : language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                            </label>
                            <div className="relative">
                                <Bed size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                    placeholder="0"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'حەمام' : language === 'ar' ? 'الحمام' : 'Bathrooms'}
                            </label>
                            <div className="relative">
                                <Bath size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                    placeholder="0"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Furnished and Available From */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'ئامادە' : language === 'ar' ? 'مفروش' : 'Furnished'}
                            </label>
                            <select
                                value={formData.furnished}
                                onChange={(e) => setFormData({ ...formData, furnished: e.target.value })}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                            >
                                <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                <option value="furnished">{language === 'ku' ? 'ئامادە' : language === 'ar' ? 'مفروش' : 'Furnished'}</option>
                                <option value="unfurnished">{language === 'ku' ? 'نەئامادە' : language === 'ar' ? 'غير مفروش' : 'Unfurnished'}</option>
                                <option value="part-furnished">{language === 'ku' ? 'بەشێک ئامادە' : language === 'ar' ? 'مفروش جزئيا' : 'Part-furnished'}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'بەردەست لە' : language === 'ar' ? 'متاح من' : 'Available From'}
                            </label>
                            <div className="relative">
                                <Calendar size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={formData.available_from}
                                    onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deposit and Minimum Tenancy */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'داشکاندن' : language === 'ar' ? 'الوديعة' : 'Deposit'}
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.deposit_amount}
                                    onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                                    placeholder="£0.00"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                {language === 'ku' ? 'کەمترین ماوەی کرێ (مانگ)' : language === 'ar' ? 'الحد الأدنى للإيجار (شهر)' : 'Min Tenancy (months)'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minimum_tenancy_months}
                                onChange={(e) => setFormData({ ...formData, minimum_tenancy_months: e.target.value })}
                                placeholder="0"
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {language === 'ku' ? 'وەسف *' : language === 'ar' ? 'الوصف *' : 'Description *'}
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={language === 'ku' ? 'وەسفی ماڵەکە' : language === 'ar' ? 'وصف المنزل' : 'Home description'}
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 resize-none text-sm"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.bills_included}
                                onChange={(e) => setFormData({ ...formData, bills_included: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                {language === 'ku' ? 'بەیلەکان لەگەڵدایە' : language === 'ar' ? 'الفواتير مشمولة' : 'Bills Included'}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.parking_available}
                                onChange={(e) => setFormData({ ...formData, parking_available: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                {language === 'ku' ? 'پارکینگ هەیە' : language === 'ar' ? 'موقف سيارات متاح' : 'Parking Available'}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.garden_available}
                                onChange={(e) => setFormData({ ...formData, garden_available: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                {language === 'ku' ? 'باخچە هەیە' : language === 'ar' ? 'حديقة متاحة' : 'Garden Available'}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.pets_allowed}
                                onChange={(e) => setFormData({ ...formData, pets_allowed: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                {language === 'ku' ? 'هاوەڵەکان ڕێگەپێدراون' : language === 'ar' ? 'الحيوانات الأليفة مسموحة' : 'Pets Allowed'}
                            </span>
                        </label>
                    </div>

                    {/* Contact Information */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {language === 'ku' ? 'زانیاری پەیوەندی' : language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    {language === 'ku' ? 'ناو *' : language === 'ar' ? 'الاسم *' : 'Name *'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.contact_name}
                                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                    className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        {language === 'ku' ? 'تەلەفۆن *' : language === 'ar' ? 'الهاتف *' : 'Phone *'}
                                    </label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.contact_phone}
                                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                            placeholder="+44 7700 900000"
                                            className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        {language === 'ku' ? 'ئیمەیڵ' : language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                            placeholder="email@example.com"
                                            className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-1 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                            {language === 'ku' ? 'هەڵوەشاندن' : language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {submitting 
                                ? (language === 'ku' ? 'نێردراوە...' : language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                                : (language === 'ku' ? 'نێردن' : language === 'ar' ? 'إرسال' : 'Submit')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomeSubmissionForm;






