import React, { useState } from 'react';
import { X, MapPin, Building, Clock, DollarSign, Mail, Phone as PhoneIcon, FileText, Briefcase } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { submitJob } from '../lib/supabase';

interface JobSubmissionFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const JobSubmissionForm: React.FC<JobSubmissionFormProps> = ({ onClose, onSuccess }) => {
    const { language } = useTranslations();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: '',
        description: '',
        requirements: '',
        apply_url: '',
        apply_email: '',
        category: '',
        contact_phone: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await submitJob({
                title: formData.title.trim(),
                company: formData.company.trim(),
                location: formData.location.trim(),
                salary: formData.salary.trim() || undefined,
                type: formData.type || undefined,
                description: formData.description.trim(),
                requirements: formData.requirements.trim() || undefined,
                apply_url: formData.apply_url.trim() || undefined,
                apply_email: formData.apply_email.trim() || undefined,
                category: formData.category || undefined,
                contact_phone: formData.contact_phone.trim() || undefined,
            });

            // Show success message via callback (no alert)
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error submitting job:', error);
            const errorMessage = error?.message || 'Unknown error';
            console.error('Full error details:', error);
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
                        {language === 'ku' ? 'زیادکردنی کار' : language === 'ar' ? 'إضافة وظيفة' : 'Post a Job'}
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
                    {/* Job Title */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'ناونیشانی کار *' : language === 'ar' ? 'عنوان الوظيفة *' : 'Job Title *'}
                        </label>
                        <div className="relative">
                            <Briefcase size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: Customer Service Assistant' : language === 'ar' ? 'مثل: مساعد خدمة العملاء' : 'e.g.: Customer Service Assistant'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Company and Location */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'کۆمپانیا *' : language === 'ar' ? 'الشركة *' : 'Company *'}
                            </label>
                            <div className="relative">
                                <Building size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder={language === 'ku' ? 'کۆمپانیا' : language === 'ar' ? 'الشركة' : 'Company'}
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

                    {/* Job Type and Salary */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'جۆری کار' : language === 'ar' ? 'نوع الوظيفة' : 'Job Type'}
                            </label>
                            <div className="relative">
                                <Clock size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm appearance-none"
                                >
                                    <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                                    <option value="full-time">{language === 'ku' ? 'کاتێکی تەواو' : language === 'ar' ? 'دوام كامل' : 'Full-time'}</option>
                                    <option value="part-time">{language === 'ku' ? 'کاتێکی بەشێک' : language === 'ar' ? 'دوام جزئي' : 'Part-time'}</option>
                                    <option value="contract">{language === 'ku' ? 'گرێبەست' : language === 'ar' ? 'عقد' : 'Contract'}</option>
                                    <option value="temporary">{language === 'ku' ? 'کاتی' : language === 'ar' ? 'مؤقت' : 'Temporary'}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'مووچە' : language === 'ar' ? 'الراتب' : 'Salary'}
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder={language === 'ku' ? 'وەک: £10-12/hour' : language === 'ar' ? 'مثل: £10-12/hour' : 'e.g.: £10-12/hour'}
                                    className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'بەش' : language === 'ar' ? 'الفئة' : 'Category'}
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                        >
                            <option value="">{language === 'ku' ? 'هەڵبژێرە' : language === 'ar' ? 'اختر' : 'Select'}</option>
                            <option value="retail">{language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail'}</option>
                            <option value="warehouse">{language === 'ku' ? 'کۆگا' : language === 'ar' ? 'مستودع' : 'Warehouse'}</option>
                            <option value="hospitality">{language === 'ku' ? 'خواردن' : language === 'ar' ? 'ضيافة' : 'Hospitality'}</option>
                            <option value="cleaning">{language === 'ku' ? 'پاککردنەوە' : language === 'ar' ? 'تنظيف' : 'Cleaning'}</option>
                            <option value="security">{language === 'ku' ? 'ئاسایش' : language === 'ar' ? 'أمن' : 'Security'}</option>
                            <option value="office">{language === 'ku' ? 'ئۆفیس' : language === 'ar' ? 'مكتب' : 'Office'}</option>
                            <option value="other">{language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other'}</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'وەسف *' : language === 'ar' ? 'الوصف *' : 'Description *'}
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={language === 'ku' ? 'وەسفی کارەکە' : language === 'ar' ? 'وصف الوظيفة' : 'Job description'}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 resize-none text-sm"
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'پێویستیەکان' : language === 'ar' ? 'المتطلبات' : 'Requirements'}
                        </label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            placeholder={language === 'ku' ? 'پێویستیەکان بۆ کار' : language === 'ar' ? 'متطلبات الوظيفة' : 'Job requirements'}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 resize-none text-sm"
                        />
                    </div>

                    {/* Contact Phone */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {language === 'ku' ? 'ژمارەی تەلەفۆن' : language === 'ar' ? 'رقم الهاتف' : 'Contact Phone'}
                        </label>
                        <div className="relative">
                            <PhoneIcon size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: +44 7700 900000' : language === 'ar' ? 'مثل: +44 7700 900000' : 'e.g.: +44 7700 900000'}
                                className="w-full h-10 pr-10 pl-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none text-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    {/* Apply URL and Email */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                {language === 'ku' ? 'لینکی داوای کار' : language === 'ar' ? 'رابط التقديم' : 'Apply URL'}
                            </label>
                            <div className="relative">
                                <FileText size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    value={formData.apply_url}
                                    onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                                    placeholder="https://..."
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
                                    value={formData.apply_email}
                                    onChange={(e) => setFormData({ ...formData, apply_email: e.target.value })}
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

export default JobSubmissionForm;

