import React, { useState } from 'react';
import { X, Car, Calendar, Gauge, DollarSign, MapPin, FileText, Fuel, Settings, Palette, Phone as PhoneIcon, Mail, User } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { submitCar } from '../lib/supabase';

interface CarSubmissionFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CarSubmissionForm: React.FC<CarSubmissionFormProps> = ({ onClose, onSuccess }) => {
    const { language } = useTranslations();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        price: '',
        location: '',
        description: '',
        fuel_type: '',
        transmission: '',
        color: '',
        condition: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await submitCar({
                make: formData.make.trim(),
                model: formData.model.trim(),
                year: parseInt(formData.year),
                mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
                price: parseFloat(formData.price),
                location: formData.location.trim(),
                description: formData.description.trim() || undefined,
                fuel_type: formData.fuel_type || undefined,
                transmission: formData.transmission || undefined,
                color: formData.color.trim() || undefined,
                condition: formData.condition || undefined,
                contact_name: formData.contact_name.trim(),
                contact_phone: formData.contact_phone.trim(),
                contact_email: formData.contact_email.trim() || undefined,
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error submitting car:', error);
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
                        {language === 'ku' ? 'فرۆشتن یان کرێکردنی ئۆتۆمبێل' : language === 'ar' ? 'بيع أو تأجير سيارة' : 'Sell or Rent Car'}
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
                    {/* Make and Model */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'مارکە *' : language === 'ar' ? 'الماركة *' : 'Make *'}
                            </label>
                            <div className="relative">
                                <Car size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.make}
                                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: Toyota' : language === 'ar' ? 'مثل: Toyota' : 'e.g.: Toyota'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'مۆدێل *' : language === 'ar' ? 'الموديل *' : 'Model *'}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: Corolla' : language === 'ar' ? 'مثل: Corolla' : 'e.g.: Corolla'}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Year and Mileage */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'ساڵ *' : language === 'ar' ? 'السنة *' : 'Year *'}
                            </label>
                            <div className="relative">
                                <Calendar size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    required
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    placeholder="2020"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'مایل' : language === 'ar' ? 'المسافة المقطوعة' : 'Mileage'}
                            </label>
                            <div className="relative">
                                <Gauge size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.mileage}
                                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: 50000' : language === 'ar' ? 'مثل: 50000' : 'e.g.: 50000'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price and Location */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'نرخ *' : language === 'ar' ? 'السعر *' : 'Price *'}
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: 5000' : language === 'ar' ? 'مثل: 5000' : 'e.g.: 5000'}
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

                    {/* Fuel Type and Transmission */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'جۆری سووتەمەنی' : language === 'ar' ? 'نوع الوقود' : 'Fuel Type'}
                            </label>
                            <div className="relative">
                                <Fuel size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={formData.fuel_type}
                                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm appearance-none"
                                >
                                    <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                    <option value="petrol">{language === 'ku' ? 'بەنزین' : language === 'ar' ? 'بنزين' : 'Petrol'}</option>
                                    <option value="diesel">{language === 'ku' ? 'دیزڵ' : language === 'ar' ? 'ديزل' : 'Diesel'}</option>
                                    <option value="electric">{language === 'ku' ? 'کارەبایی' : language === 'ar' ? 'كهربائي' : 'Electric'}</option>
                                    <option value="hybrid">{language === 'ku' ? 'هايبرید' : language === 'ar' ? 'هجين' : 'Hybrid'}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'جۆری بۆکس' : language === 'ar' ? 'نوع ناقل الحركة' : 'Transmission'}
                            </label>
                            <div className="relative">
                                <Settings size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={formData.transmission}
                                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm appearance-none"
                                >
                                    <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                    <option value="manual">{language === 'ku' ? 'دەستی' : language === 'ar' ? 'يدوي' : 'Manual'}</option>
                                    <option value="automatic">{language === 'ku' ? 'ئۆتۆماتیک' : language === 'ar' ? 'أوتوماتيكي' : 'Automatic'}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Color and Condition */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'ڕەنگ' : language === 'ar' ? 'اللون' : 'Color'}
                            </label>
                            <div className="relative">
                                <Palette size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: سپی' : language === 'ar' ? 'مثل: أبيض' : 'e.g.: White'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'دۆخ' : language === 'ar' ? 'الحالة' : 'Condition'}
                            </label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            >
                                <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                <option value="new">{language === 'ku' ? 'نوێ' : language === 'ar' ? 'جديد' : 'New'}</option>
                                <option value="used">{language === 'ku' ? 'بەکارهاتوو' : language === 'ar' ? 'مستعمل' : 'Used'}</option>
                                <option value="certified-pre-owned">{language === 'ku' ? 'پشتڕاستکراوە' : language === 'ar' ? 'معتمد' : 'Certified Pre-owned'}</option>
                            </select>
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
                            placeholder={language === 'ku' ? 'وەسفی ئۆتۆمبێلەکە' : language === 'ar' ? 'وصف السيارة' : 'Car description'}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 resize-none text-sm"
                        />
                    </div>

                    {/* Contact Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'ناوی پەیوەندیکار *' : language === 'ar' ? 'اسم جهة الاتصال *' : 'Contact Name *'}
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.contact_name}
                                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                placeholder={language === 'ku' ? 'ناوی تۆ' : language === 'ar' ? 'اسمك' : 'Your name'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Contact Phone and Email */}
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
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
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
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    placeholder="email@example.com"
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
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

export default CarSubmissionForm;
