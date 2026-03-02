import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, MapPin, Star, Phone, Mail, Filter, X, Plus } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getDrivingInstructors, type DrivingInstructor } from '../lib/supabase';
import InstructorSubmissionForm from '../components/InstructorSubmissionForm';

interface DrivingInstructorsListProps {
    hideHeader?: boolean;
}

const DrivingInstructorsList: React.FC<DrivingInstructorsListProps> = ({ hideHeader = false }) => {
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [instructors, setInstructors] = useState<DrivingInstructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        language: '',
        minRating: 0,
        maxPrice: 0,
        vehicleType: '',
    });

    useEffect(() => {
        const fetchInstructors = async () => {
            setLoading(true);
            try {
                const data = await getDrivingInstructors({
                    ...filters,
                    searchQuery: searchQuery || undefined,
                    minRating: filters.minRating > 0 ? filters.minRating : undefined,
                    maxPrice: filters.maxPrice > 0 ? filters.maxPrice : undefined,
                    vehicleType: filters.vehicleType || undefined,
                    language: filters.language || undefined,
                    location: filters.location || undefined,
                });
                setInstructors(data);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, [searchQuery, filters]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleInstructorClick = (instructorId: string) => {
        navigate(`/driving-instructors/${instructorId}`);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            language: '',
            minRating: 0,
            maxPrice: 0,
            vehicleType: '',
        });
        setSearchQuery('');
    };

    const handleFormSuccess = () => {
        // Refresh the instructors list after successful submission
        const fetchInstructors = async () => {
            setLoading(true);
            try {
                const data = await getDrivingInstructors({
                    ...filters,
                    searchQuery: searchQuery || undefined,
                    minRating: filters.minRating > 0 ? filters.minRating : undefined,
                    maxPrice: filters.maxPrice > 0 ? filters.maxPrice : undefined,
                    vehicleType: filters.vehicleType || undefined,
                    language: filters.language || undefined,
                    location: filters.location || undefined,
                });
                setInstructors(data);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstructors();
    };

    const hasActiveFilters = filters.location || filters.language || filters.minRating > 0 || filters.maxPrice > 0 || filters.vehicleType;

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            {!hideHeader && (
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
                            {language === 'ku' ? 'مامۆستاکانی شۆفێری' : language === 'ar' ? 'مدرسي القيادة' : 'Driving Instructors'}
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            {language === 'ku' 
                                ? `${instructors.length} مامۆستا دۆزرایەوە`
                                : language === 'ar'
                                ? `${instructors.length} مدرس متاح`
                                : `${instructors.length} instructors found`
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'ku' ? 'گەڕان بە دوای مامۆستا...' : language === 'ar' ? 'البحث عن مدرس...' : 'Search for instructor...'}
                        className="w-full h-14 pr-14 pl-5 rounded-2xl bg-white border-2 border-slate-200 shadow-lg shadow-slate-200/50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-right placeholder:text-slate-400 text-slate-700 font-medium"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-400">
                        <Search size={22} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Filter and Add Buttons */}
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
                <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all ml-auto"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    {language === 'ku' ? 'مامۆستا زیاد بکە' : language === 'ar' ? 'إضافة مدرس' : 'Add Instructor'}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-4">
                        {/* Location */}
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

                        {/* Language */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'زمان' : language === 'ar' ? 'اللغة' : 'Language'}
                            </label>
                            <select
                                value={filters.language}
                                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو زمانەکان' : language === 'ar' ? 'جميع اللغات' : 'All Languages'}</option>
                                <option value="ku">{language === 'ku' ? 'کوردی' : language === 'ar' ? 'الكردية' : 'Kurdish'}</option>
                                <option value="ar">{language === 'ku' ? 'عەرەبی' : language === 'ar' ? 'العربية' : 'Arabic'}</option>
                                <option value="en">{language === 'ku' ? 'ئینگلیزی' : language === 'ar' ? 'الإنجليزية' : 'English'}</option>
                            </select>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'جۆری ئۆتۆمبێل' : language === 'ar' ? 'نوع السيارة' : 'Vehicle Type'}
                            </label>
                            <select
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="manual">{language === 'ku' ? 'دەستی' : language === 'ar' ? 'يدوي' : 'Manual'}</option>
                                <option value="automatic">{language === 'ku' ? 'ئۆتۆماتیک' : language === 'ar' ? 'أوتوماتيكي' : 'Automatic'}</option>
                                <option value="both">{language === 'ku' ? 'هەردووکیان' : language === 'ar' ? 'كلاهما' : 'Both'}</option>
                            </select>
                        </div>

                        {/* Min Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'کەمترین پێوانە' : language === 'ar' ? 'الحد الأدنى للتقييم' : 'Minimum Rating'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={filters.minRating}
                                onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) || 0 })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            />
                        </div>

                        {/* Max Price */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'زیاترین نرخ (GBP)' : language === 'ar' ? 'الحد الأقصى للسعر (GBP)' : 'Maximum Price (GBP)'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) || 0 })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            />
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

            {/* Instructors List */}
            {!loading && (
                <div className="space-y-4">
                    {instructors.length === 0 ? (
                        <div className="text-center py-12 text-slate-600">
                            <p className="font-semibold text-lg mb-2">
                                {language === 'ku' ? 'هیچ مامۆستایەک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على مدرس' : 'No instructors found'}
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
                        instructors.map((instructor) => (
                            <div
                                key={instructor.id}
                                onClick={() => handleInstructorClick(instructor.id)}
                                className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 hover:shadow-lg hover:shadow-black/10 hover:border-indigo-200/50 transition-all duration-200 cursor-pointer active:scale-[0.98] hover:-translate-y-0.5"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                {instructor.name}
                                            </h3>
                                            {instructor.is_verified && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                                                    {language === 'ku' ? 'پشتڕاستکراوە' : language === 'ar' ? 'موثق' : 'Verified'}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            {instructor.rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {instructor.rating.toFixed(1)}
                                                    </span>
                                                    {instructor.total_reviews > 0 && (
                                                        <span className="text-xs text-slate-500">
                                                            ({instructor.total_reviews})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {instructor.location && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{instructor.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {instructor.bio && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {instructor.bio}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 flex-wrap">
                                            {instructor.price_per_hour && (
                                                <span className="text-sm font-bold text-indigo-600">
                                                    £{instructor.price_per_hour}/hr
                                                </span>
                                            )}
                                            {instructor.experience_years > 0 && (
                                                <span className="text-xs text-slate-500">
                                                    {instructor.experience_years} {language === 'ku' ? 'ساڵ' : language === 'ar' ? 'سنة' : 'years'} {language === 'ku' ? 'ئەزموون' : language === 'ar' ? 'خبرة' : 'experience'}
                                                </span>
                                            )}
                                            {instructor.languages_spoken && instructor.languages_spoken.length > 0 && (
                                                <span className="text-xs text-slate-500">
                                                    {instructor.languages_spoken.map(lang => {
                                                        const langNames: Record<string, string> = {
                                                            ku: language === 'ku' ? 'کوردی' : language === 'ar' ? 'الكردية' : 'Kurdish',
                                                            ar: language === 'ku' ? 'عەرەبی' : language === 'ar' ? 'العربية' : 'Arabic',
                                                            en: language === 'ku' ? 'ئینگلیزی' : language === 'ar' ? 'الإنجليزية' : 'English',
                                                        };
                                                        return langNames[lang] || lang;
                                                    }).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Submission Form Modal */}
            {showSubmissionForm && (
                <InstructorSubmissionForm
                    onClose={() => setShowSubmissionForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default DrivingInstructorsList;


