import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, Scale, MapPin, Building, Phone, Mail, Globe, Languages, Calendar, DollarSign, Filter, X, Plus } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getActiveLawyers, type Lawyer } from '../lib/supabase';
import LawyerSubmissionForm from '../components/LawyerSubmissionForm';

const LawyersList: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const [allLawyers, setAllLawyers] = useState<Lawyer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        specialization: '',
    });

    useEffect(() => {
        loadLawyers();
    }, []);

    const loadLawyers = async () => {
        setLoading(true);
        try {
            const activeLawyers = await getActiveLawyers();
            setAllLawyers(activeLawyers);
            setLawyers(activeLawyers);
        } catch (error) {
            console.error('Error loading lawyers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filteredLawyers = [...allLawyers];

        if (searchQuery) {
            filteredLawyers = filteredLawyers.filter(lawyer =>
                lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lawyer.firm_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lawyer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lawyer.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.location) {
            filteredLawyers = filteredLawyers.filter(lawyer =>
                lawyer.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.specialization) {
            filteredLawyers = filteredLawyers.filter(lawyer => lawyer.specialization === filters.specialization);
        }

        setLawyers(filteredLawyers);
    }, [searchQuery, filters, allLawyers]);

    const handleBack = () => {
        navigate(-1);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            specialization: '',
        });
        setSearchQuery('');
    };

    const hasActiveFilters = filters.location || filters.specialization;

    const specializationNames: Record<string, string> = {
        'immigration': language === 'ku' ? 'کۆچکردن' : language === 'ar' ? 'الهجرة' : 'Immigration',
        'family': language === 'ku' ? 'خێزان' : language === 'ar' ? 'العائلة' : 'Family',
        'criminal': language === 'ku' ? 'تاوان' : language === 'ar' ? 'جنائي' : 'Criminal',
        'employment': language === 'ku' ? 'کار' : language === 'ar' ? 'العمل' : 'Employment',
        'housing': language === 'ku' ? 'نیشتەجێبوون' : language === 'ar' ? 'السكن' : 'Housing',
        'general': language === 'ku' ? 'گشتی' : language === 'ar' ? 'عام' : 'General',
    };

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
                        {language === 'ku' ? 'پارێزه‌رکان' : language === 'ar' ? 'المحامين' : 'Lawyers'}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        {language === 'ku' 
                            ? `${lawyers.length} پارێزه‌ر دۆزرایەوە`
                            : language === 'ar'
                            ? `${lawyers.length} محامي متاح`
                            : `${lawyers.length} lawyers found`
                        }
                    </p>
                </div>
                <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span className="font-bold text-sm">
                        {language === 'ku' ? 'زیادکردنی پارێزه‌ر' : language === 'ar' ? 'إضافة محامي' : 'Add Lawyer'}
                    </span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'ku' ? 'گەڕان بە دوای وەکیل...' : language === 'ar' ? 'البحث عن محامي...' : 'Search for lawyers...'}
                        className="w-full h-14 pr-14 pl-5 rounded-2xl bg-white border-2 border-slate-200 shadow-lg shadow-slate-200/50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-right placeholder:text-slate-400 text-slate-700 font-medium"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-400">
                        <Search size={22} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Filter Button */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        showFilters || hasActiveFilters
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    <Filter size={18} strokeWidth={2.5} />
                    {language === 'ku' ? 'فلتەر' : language === 'ar' ? 'تصفية' : 'Filter'}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-semibold text-sm transition-all"
                    >
                        <X size={16} />
                        {language === 'ku' ? 'پاککردنەوە' : language === 'ar' ? 'مسح' : 'Clear'}
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                            </label>
                            <input
                                type="text"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: London' : language === 'ar' ? 'مثل: London' : 'e.g.: London'}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'تایبەتمەندی' : language === 'ar' ? 'التخصص' : 'Specialization'}
                            </label>
                            <select
                                value={filters.specialization}
                                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="immigration">{language === 'ku' ? 'کۆچکردن' : language === 'ar' ? 'الهجرة' : 'Immigration'}</option>
                                <option value="family">{language === 'ku' ? 'خێزان' : language === 'ar' ? 'العائلة' : 'Family'}</option>
                                <option value="criminal">{language === 'ku' ? 'تاوان' : language === 'ar' ? 'جنائي' : 'Criminal'}</option>
                                <option value="employment">{language === 'ku' ? 'کار' : language === 'ar' ? 'العمل' : 'Employment'}</option>
                                <option value="housing">{language === 'ku' ? 'نیشتەجێبوون' : language === 'ar' ? 'السكن' : 'Housing'}</option>
                                <option value="general">{language === 'ku' ? 'گشتی' : language === 'ar' ? 'عام' : 'General'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Lawyers List */}
            {!loading && (
                <div className="space-y-4">
                    {lawyers.length === 0 ? (
                        <div className="text-center py-12 text-slate-600">
                            <p className="font-semibold text-lg mb-2">
                                {language === 'ku' ? 'هیچ پارێزه‌رێک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على محامين' : 'No lawyers found'}
                            </p>
                            <p className="text-sm">
                                {language === 'ku' 
                                    ? 'تکایە فلتەرەکان بگۆڕە یان گەڕان بکە'
                                    : language === 'ar'
                                    ? 'يرجى تغيير المرشحات أو البحث'
                                    : 'Please change filters or search'
                                }
                            </p>
                        </div>
                    ) : (
                        lawyers.map((lawyer) => (
                            <div
                                key={lawyer.id}
                                onClick={() => navigate(`/lawyers/${lawyer.id}`)}
                                className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 hover:shadow-lg hover:shadow-black/10 hover:border-indigo-200/50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Scale size={32} className="text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                {lawyer.name}
                                            </h3>
                                        </div>
                                        
                                        {lawyer.firm_name && (
                                            <div className="flex items-center gap-1 text-slate-600 mb-2">
                                                <Building size={16} />
                                                <span className="text-sm">{lawyer.firm_name}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            {lawyer.location && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{lawyer.location}</span>
                                                </div>
                                            )}
                                            {lawyer.specialization && (
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                                                    {specializationNames[lawyer.specialization] || lawyer.specialization}
                                                </span>
                                            )}
                                            {lawyer.experience_years && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Calendar size={16} />
                                                    <span className="text-sm">{lawyer.experience_years} {language === 'ku' ? 'ساڵ' : language === 'ar' ? 'سنة' : 'years'}</span>
                                                </div>
                                            )}
                                        </div>

                                        {lawyer.description && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {lawyer.description}
                                            </p>
                                        )}

                                        {lawyer.consultation_fee && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <DollarSign size={16} className="text-green-600" />
                                                <span className="text-sm font-bold text-green-600">£{lawyer.consultation_fee.toLocaleString()}</span>
                                                <span className="text-xs text-slate-500">
                                                    {language === 'ku' ? 'بۆ مشاورە' : language === 'ar' ? 'للاستشارة' : 'consultation'}
                                                </span>
                                            </div>
                                        )}

                                        {lawyer.languages && lawyer.languages.length > 0 && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <Languages size={16} className="text-slate-500" />
                                                <span className="text-xs text-slate-600">{lawyer.languages.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-sm flex-wrap">
                                        {lawyer.phone && (
                                            <a
                                                href={`tel:${lawyer.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Phone size={16} />
                                                <span>{lawyer.phone}</span>
                                            </a>
                                        )}
                                        {lawyer.email && (
                                            <a
                                                href={`mailto:${lawyer.email}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Mail size={16} />
                                                <span>{lawyer.email}</span>
                                            </a>
                                        )}
                                        {lawyer.website && (
                                            <a
                                                href={lawyer.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Globe size={16} />
                                                <span>{language === 'ku' ? 'ماڵپەڕ' : language === 'ar' ? 'الموقع' : 'Website'}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Lawyer Submission Form Modal */}
            {showSubmissionForm && (
                <LawyerSubmissionForm
                    onClose={() => setShowSubmissionForm(false)}
                    onSuccess={() => {
                        setShowSubmissionForm(false);
                        loadLawyers();
                    }}
                />
            )}
        </div>
    );
};

export default LawyersList;