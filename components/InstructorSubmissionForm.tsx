import React, { useState } from 'react';
import { Plus, X, MapPin, Phone, Mail, Car, Languages, Clock, DollarSign, FileText } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { submitDrivingInstructor } from '../lib/supabase';

interface InstructorSubmissionFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const InstructorSubmissionForm: React.FC<InstructorSubmissionFormProps> = ({ onClose, onSuccess }) => {
    const { language } = useTranslations();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        location: '',
        postcode: '',
        bio: '',
        price_per_hour: '',
        experience_years: '',
        vehicle_type: '',
        availability: '',
        languages_spoken: [] as string[],
        specialties: [] as string[],
    });
    const [specialtyInput, setSpecialtyInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await submitDrivingInstructor({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim() || undefined,
                location: formData.location.trim() || undefined,
                postcode: formData.postcode.trim() || undefined,
                bio: formData.bio.trim() || undefined,
                price_per_hour: formData.price_per_hour ? parseFloat(formData.price_per_hour) : undefined,
                experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
                vehicle_type: formData.vehicle_type || undefined,
                availability: formData.availability || undefined,
                languages_spoken: formData.languages_spoken.length > 0 ? formData.languages_spoken : undefined,
                specialties: formData.specialties.length > 0 ? formData.specialties : undefined,
            });

            alert(language === 'ku' 
                ? 'مامۆستاکەت نێردرا! دواتر پشتڕاست دەکرێتەوە.'
                : 'تم إرسال المدرس! سيتم مراجعته لاحقاً.'
            );
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting instructor:', error);
            alert(language === 'ku' 
                ? 'هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەوە.'
                : 'حدث خطأ. يرجى المحاولة مرة أخرى.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const toggleLanguage = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages_spoken: prev.languages_spoken.includes(lang)
                ? prev.languages_spoken.filter(l => l !== lang)
                : [...prev.languages_spoken, lang]
        }));
    };

    const addSpecialty = () => {
        if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
            setFormData(prev => ({
                ...prev,
                specialties: [...prev.specialties, specialtyInput.trim()]
            }));
            setSpecialtyInput('');
        }
    };

    const removeSpecialty = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.filter(s => s !== specialty)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {language === 'ku' ? 'مامۆستایەکی نوێ زیاد بکە' : 'إضافة مدرس جديد'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === 'ku' ? 'ناو' : 'الاسم'} *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                            placeholder={language === 'ku' ? 'ناوی مامۆستا' : 'اسم المدرس'}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Phone size={18} />
                            {language === 'ku' ? 'تەلەفۆن' : 'الهاتف'} *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                            placeholder={language === 'ku' ? '+44 7xxx xxxxxx' : '+44 7xxx xxxxxx'}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Mail size={18} />
                            {language === 'ku' ? 'ئیمەیڵ' : 'البريد الإلكتروني'}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                            placeholder="email@example.com"
                        />
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin size={18} />
                                {language === 'ku' ? 'شوێن' : 'الموقع'}
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                                placeholder={language === 'ku' ? 'وەک: London' : 'مثل: London'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'کۆدی پۆست' : 'الرمز البريدي'}
                            </label>
                            <input
                                type="text"
                                value={formData.postcode}
                                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                                placeholder="SW1A 1AA"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <FileText size={18} />
                            {language === 'ku' ? 'زانیاری' : 'السيرة الذاتية'}
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                            placeholder={language === 'ku' ? 'زانیاری دەربارەی مامۆستا...' : 'معلومات عن المدرس...'}
                        />
                    </div>

                    {/* Price & Experience */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <DollarSign size={18} />
                                {language === 'ku' ? 'نرخ/کاتژمێر (GBP)' : 'السعر/ساعة (GBP)'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                value={formData.price_per_hour}
                                onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                                placeholder="30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Clock size={18} />
                                {language === 'ku' ? 'ساڵانی ئەزموون' : 'سنوات الخبرة'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.experience_years}
                                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                                placeholder="5"
                            />
                        </div>
                    </div>

                    {/* Vehicle Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Car size={18} />
                            {language === 'ku' ? 'جۆری ئۆتۆمبێل' : 'نوع السيارة'}
                        </label>
                        <select
                            value={formData.vehicle_type}
                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                        >
                            <option value="">{language === 'ku' ? 'هەڵبژاردن' : 'اختر'}</option>
                            <option value="manual">{language === 'ku' ? 'دەستی' : 'يدوي'}</option>
                            <option value="automatic">{language === 'ku' ? 'ئۆتۆماتیک' : 'أوتوماتيكي'}</option>
                            <option value="both">{language === 'ku' ? 'هەردووکیان' : 'كلاهما'}</option>
                        </select>
                    </div>

                    {/* Availability */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === 'ku' ? 'بەردەستی' : 'التوفر'}
                        </label>
                        <select
                            value={formData.availability}
                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                        >
                            <option value="">{language === 'ku' ? 'هەڵبژاردن' : 'اختر'}</option>
                            <option value="full-time">{language === 'ku' ? 'کاتێکی تەواو' : 'دوام كامل'}</option>
                            <option value="part-time">{language === 'ku' ? 'کاتێکی بەشێک' : 'دوام جزئي'}</option>
                            <option value="weekends-only">{language === 'ku' ? 'تەنها کۆتایی هەفتە' : 'عطلات نهاية الأسبوع فقط'}</option>
                        </select>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Languages size={18} />
                            {language === 'ku' ? 'زمانەکان' : 'اللغات'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['ku', 'ar', 'en'].map((lang) => {
                                const langNames: Record<string, string> = {
                                    ku: language === 'ku' ? 'کوردی' : 'الكردية',
                                    ar: language === 'ku' ? 'عەرەبی' : 'العربية',
                                    en: language === 'ku' ? 'ئینگلیزی' : 'الإنجليزية',
                                };
                                return (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => toggleLanguage(lang)}
                                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                                            formData.languages_spoken.includes(lang)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {langNames[lang]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === 'ku' ? 'تایبەتمەندیەکان' : 'التخصصات'}
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={specialtyInput}
                                onChange={(e) => setSpecialtyInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSpecialty();
                                    }
                                }}
                                className="flex-1 px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                                placeholder={language === 'ku' ? 'تایبەتمەندی زیاد بکە' : 'أضف تخصص'}
                            />
                            <button
                                type="button"
                                onClick={addSpecialty}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        {formData.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.specialties.map((specialty) => (
                                    <span
                                        key={specialty}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold"
                                    >
                                        {specialty}
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialty(specialty)}
                                            className="hover:text-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? (language === 'ku' ? 'نێردراوە...' : 'جارٍ الإرسال...')
                                : (language === 'ku' ? 'ناردن' : 'إرسال')
                            }
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
                        >
                            {language === 'ku' ? 'هەڵوەشاندنەوە' : 'إلغاء'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstructorSubmissionForm;












