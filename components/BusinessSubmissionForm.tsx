import React, { useState } from 'react';
import { X, Store, MapPin, FileText, Phone as PhoneIcon, Mail, Globe, DollarSign, User, Building } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { submitBusiness } from '../lib/supabase';

interface BusinessSubmissionFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const BusinessSubmissionForm: React.FC<BusinessSubmissionFormProps> = ({ onClose, onSuccess }) => {
    const { language } = useTranslations();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        business_name: '',
        business_type: '',
        category: '',
        location: '',
        description: '',
        price: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        website: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await submitBusiness({
                business_name: formData.business_name.trim(),
                business_type: formData.business_type || undefined,
                category: formData.category || undefined,
                location: formData.location.trim(),
                description: formData.description.trim() || undefined,
                price: formData.price ? parseFloat(formData.price) : undefined,
                contact_name: formData.contact_name.trim(),
                contact_phone: formData.contact_phone.trim(),
                contact_email: formData.contact_email.trim() || undefined,
                website: formData.website.trim() || undefined,
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error submitting business:', error);
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
                        {language === 'ku' ? 'زیادکردنی کاروبار' : language === 'ar' ? 'إضافة عمل تجاري' : 'Add Business'}
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
                    {/* Business Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'ناوی کاروبار *' : language === 'ar' ? 'اسم العمل التجاري *' : 'Business Name *'}
                        </label>
                        <div className="relative">
                            <Store size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.business_name}
                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                placeholder={language === 'ku' ? 'ناوی کاروبار' : language === 'ar' ? 'اسم العمل التجاري' : 'Business name'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Business Type and Category */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'جۆری کاروبار' : language === 'ar' ? 'نوع العمل' : 'Business Type'}
                            </label>
                            <div className="relative">
                                <Building size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={formData.business_type}
                                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm appearance-none"
                                >
                                    <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                    <option value="restaurant">{language === 'ku' ? 'خواردنگە' : language === 'ar' ? 'مطعم' : 'Restaurant'}</option>
                                    <option value="shop">{language === 'ku' ? 'دوکان' : language === 'ar' ? 'متجر' : 'Shop'}</option>
                                    <option value="service">{language === 'ku' ? 'خزمەتگوزاری' : language === 'ar' ? 'خدمة' : 'Service'}</option>
                                    <option value="retail">{language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail'}</option>
                                    <option value="other">{language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other'}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'بەش' : language === 'ar' ? 'الفئة' : 'Category'}
                            </label>
                            <div className="relative">
                                <Store size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm appearance-none"
                                >
                                    <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                    <option value="food">{language === 'ku' ? 'خواردن' : language === 'ar' ? 'طعام' : 'Food & Beverage'}</option>
                                    <option value="retail">{language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail'}</option>
                                    <option value="beauty">{language === 'ku' ? 'جوانکاری' : language === 'ar' ? 'جمال' : 'Beauty & Salon'}</option>
                                    <option value="automotive">{language === 'ku' ? 'ئۆتۆمبێل' : language === 'ar' ? 'سيارات' : 'Automotive'}</option>
                                    <option value="services">{language === 'ku' ? 'خزمەتگوزاری' : language === 'ar' ? 'خدمات' : 'Services'}</option>
                                    <option value="other">{language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other'}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location and Price */}
                    <div className="grid grid-cols-2 gap-2.5">
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
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'نرخ (£)' : language === 'ar' ? 'السعر (£)' : 'Price (£)'}
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: 50000' : language === 'ar' ? 'مثل: 50000' : 'e.g.: 50000'}
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
                            placeholder={language === 'ku' ? 'وەسفی کاروبارەکە' : language === 'ar' ? 'وصف العمل التجاري' : 'Business description'}
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
                                placeholder={language === 'ku' ? 'ناوی پەیوەندیکار' : language === 'ar' ? 'اسم جهة الاتصال' : 'Contact name'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
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

export default BusinessSubmissionForm;









