import React, { useState } from 'react';
import { X, Plane, Building, MapPin, FileText, Phone as PhoneIcon, Mail, Globe, Languages, Calendar, DollarSign, User } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { submitTravelAgent } from '../lib/supabase';

interface TravelAgentSubmissionFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const TravelAgentSubmissionForm: React.FC<TravelAgentSubmissionFormProps> = ({ onClose, onSuccess }) => {
    const { language } = useTranslations();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        agency_name: '',
        services: '',
        location: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        languages: '',
        experience_years: '',
        consultation_fee: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const languagesArray = formData.languages
                ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
                : undefined;

            const servicesArray = formData.services
                ? formData.services.split(',').map(service => service.trim()).filter(service => service)
                : undefined;

            await submitTravelAgent({
                name: formData.name.trim(),
                agency_name: formData.agency_name.trim() || undefined,
                services: servicesArray,
                location: formData.location.trim(),
                description: formData.description.trim() || undefined,
                phone: formData.phone.trim(),
                email: formData.email.trim() || undefined,
                website: formData.website.trim() || undefined,
                languages: languagesArray,
                experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
                consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : undefined,
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error submitting travel agent:', error);
            const errorMessage = error?.message || 'Unknown error';
            alert(language === 'ku' 
                ? `هەڵەیەک ڕوویدا: ${errorMessage}`
                : language === 'ar'
                ? `حدث خطأ: ${errorMessage}`
                : `An error occurred: ${errorMessage}`
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-slate-900">
                        {language === 'ku' ? 'زیادکردنی دەستەی گەشت' : language === 'ar' ? 'إضافة وكيل سفر' : 'Add Travel Agent'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'ناوی دەستەی گەشت *' : language === 'ar' ? 'اسم وكيل السفر *' : 'Travel Agent Name *'}
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={language === 'ku' ? 'ناوی دەستەی گەشت' : language === 'ar' ? 'اسم وكيل السفر' : 'Travel agent name'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Agency Name and Location */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'ناوی کۆمپانیا' : language === 'ar' ? 'اسم الشركة' : 'Agency Name'}
                            </label>
                            <div className="relative">
                                <Building size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.agency_name}
                                    onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                                    placeholder={language === 'ku' ? 'ناوی کۆمپانیا' : language === 'ar' ? 'اسم الشركة' : 'Agency name'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'شوێن *' : language === 'ar' ? 'الموقع *' : 'Location *'}
                            </label>
                            <div className="relative">
                                <MapPin size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: London' : language === 'ar' ? 'مثل: London' : 'e.g.: London'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'خزمەتگوزاریەکان' : language === 'ar' ? 'الخدمات' : 'Services'}
                        </label>
                        <div className="relative">
                            <Plane size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={formData.services}
                                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: Flights, Hotels, Visas' : language === 'ar' ? 'مثل: Flights, Hotels, Visas' : 'e.g.: Flights, Hotels, Visas'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {language === 'ku' ? 'خزمەتگوزاریەکان بە کۆما جیا بکەرەوە' : language === 'ar' ? 'افصل بين الخدمات بفواصل' : 'Separate services with commas'}
                        </p>
                    </div>

                    {/* Experience and Consultation Fee */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'ساڵانی ئەزموون' : language === 'ar' ? 'سنوات الخبرة' : 'Experience (Years)'}
                            </label>
                            <div className="relative">
                                <Calendar size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience_years}
                                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                    placeholder="5"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'نرخی مشاورە' : language === 'ar' ? 'رسوم الاستشارة' : 'Consultation Fee'}
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.consultation_fee}
                                    onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: 100' : language === 'ar' ? 'مثل: 100' : 'e.g.: 100'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'وەسف' : language === 'ar' ? 'الوصف' : 'Description'}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={language === 'ku' ? 'وەسفی دەستەی گەشت' : language === 'ar' ? 'وصف وكيل السفر' : 'Travel agent description'}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 resize-none text-sm"
                        />
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'زمانەکان' : language === 'ar' ? 'اللغات' : 'Languages'}
                        </label>
                        <div className="relative">
                            <Languages size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={formData.languages}
                                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: English, Arabic, Kurdish' : language === 'ar' ? 'مثل: English, Arabic, Kurdish' : 'e.g.: English, Arabic, Kurdish'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {language === 'ku' ? 'زمانەکان بە کۆما جیا بکەرەوە' : language === 'ar' ? 'افصل بين اللغات بفواصل' : 'Separate languages with commas'}
                        </p>
                    </div>

                    {/* Phone and Email */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'ژمارەی تەلەفۆن *' : language === 'ar' ? 'رقم الهاتف *' : 'Phone *'}
                            </label>
                            <div className="relative">
                                <PhoneIcon size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: +44 7700 900000' : language === 'ar' ? 'مثل: +44 7700 900000' : 'e.g.: +44 7700 900000'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'ئیمەیڵ' : language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'ماڵپەڕ' : language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                        </label>
                        <div className="relative">
                            <Globe size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://..."
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2.5 pt-3 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                        >
                            {language === 'ku' ? 'هەڵوەشاندن' : language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

export default TravelAgentSubmissionForm;










