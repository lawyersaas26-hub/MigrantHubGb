import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, MapPin, Home, DollarSign, Bed, Bath, Filter, X, ExternalLink, Plus, Building } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import HomeSubmissionForm from '../components/HomeSubmissionForm';
import { getActiveHomes, type Home } from '../lib/supabase';

const HomesList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [allHomes, setAllHomes] = useState<Home[]>([]);
    const [homes, setHomes] = useState<Home[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        city: '',
        property_type: '',
        furnished: '',
    });

    // Load homes from Supabase
    useEffect(() => {
        loadHomes();
    }, []);

    const loadHomes = async () => {
        setLoading(true);
        try {
            const activeHomes = await getActiveHomes();
            setAllHomes(activeHomes);
            setHomes(activeHomes);
        } catch (error) {
            console.error('Error loading homes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check if we should show the form based on URL parameter
    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setShowSubmissionForm(true);
        }
    }, [searchParams]);

    // Filter homes based on search and filters
    useEffect(() => {
        let filteredHomes = [...allHomes];

        if (searchQuery) {
            filteredHomes = filteredHomes.filter(home =>
                home.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                home.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                home.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                home.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.location) {
            filteredHomes = filteredHomes.filter(home =>
                home.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.city) {
            filteredHomes = filteredHomes.filter(home =>
                home.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.property_type) {
            filteredHomes = filteredHomes.filter(home => home.property_type === filters.property_type);
        }

        if (filters.furnished) {
            filteredHomes = filteredHomes.filter(home => home.furnished === filters.furnished);
        }

        setHomes(filteredHomes);
    }, [searchQuery, filters, allHomes]);

    const handleBack = () => {
        navigate(-1);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            city: '',
            property_type: '',
            furnished: '',
        });
        setSearchQuery('');
    };

    const hasActiveFilters = filters.location || filters.city || filters.property_type || filters.furnished;

    const propertyTypeNames: Record<string, string> = {
        'house': language === 'ku' ? 'ماڵ' : language === 'ar' ? 'منزل' : 'House',
        'flat': language === 'ku' ? 'فلەت' : language === 'ar' ? 'شقة' : 'Flat',
        'apartment': language === 'ku' ? 'ئەپارتمێنت' : language === 'ar' ? 'شقة' : 'Apartment',
        'studio': language === 'ku' ? 'ستودیۆ' : language === 'ar' ? 'استوديو' : 'Studio',
        'room': language === 'ku' ? 'ژوور' : language === 'ar' ? 'غرفة' : 'Room',
    };

    const furnishedNames: Record<string, string> = {
        'furnished': language === 'ku' ? 'ئامادە' : language === 'ar' ? 'مفروش' : 'Furnished',
        'unfurnished': language === 'ku' ? 'نەئامادە' : language === 'ar' ? 'غير مفروش' : 'Unfurnished',
        'part-furnished': language === 'ku' ? 'بەشێک ئامادە' : language === 'ar' ? 'مفروش جزئيا' : 'Part-furnished',
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ku' ? 'دۆزینەوەی ماڵ بۆ کرێ' : language === 'ar' ? 'البحث عن منزل للإيجار' : 'Find a Home for Rent'}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {language === 'ku' 
                            ? `${homes.length} ماڵ دۆزرایەوە`
                            : language === 'ar'
                            ? `${homes.length} منزل متاح`
                            : `${homes.length} homes found`
                        }
                    </p>
                </div>
                <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="p-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span className="font-bold text-sm">
                        {language === 'ku' ? 'زیادکردنی ماڵ' : language === 'ar' ? 'إضافة منزل' : 'Add Home'}
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
                        placeholder={language === 'ku' ? 'گەڕان بە دوای ماڵ...' : language === 'ar' ? 'البحث عن منزل...' : 'Search for homes...'}
                        className="w-full h-14 pr-14 pl-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none transition-all duration-200 text-right placeholder:text-slate-400 text-slate-700 dark:text-slate-200 font-medium"
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
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                    <Filter size={18} strokeWidth={2.5} />
                    {language === 'ku' ? 'فلتەر' : language === 'ar' ? 'تصفية' : 'Filter'}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold text-sm transition-all"
                    >
                        <X size={16} />
                        {language === 'ku' ? 'پاککردنەوە' : language === 'ar' ? 'مسح' : 'Clear'}
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="space-y-4">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                            </label>
                            <input
                                type="text"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: Central London' : language === 'ar' ? 'مثل: Central London' : 'e.g.: Central London'}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                {language === 'ku' ? 'شار' : language === 'ar' ? 'المدينة' : 'City'}
                            </label>
                            <input
                                type="text"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: London' : language === 'ar' ? 'مثل: London' : 'e.g.: London'}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200"
                            />
                        </div>

                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                {language === 'ku' ? 'جۆری ماڵ' : language === 'ar' ? 'نوع العقار' : 'Property Type'}
                            </label>
                            <select
                                value={filters.property_type}
                                onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="house">{language === 'ku' ? 'ماڵ' : language === 'ar' ? 'منزل' : 'House'}</option>
                                <option value="flat">{language === 'ku' ? 'فلەت' : language === 'ar' ? 'شقة' : 'Flat'}</option>
                                <option value="apartment">{language === 'ku' ? 'ئەپارتمێنت' : language === 'ar' ? 'شقة' : 'Apartment'}</option>
                                <option value="studio">{language === 'ku' ? 'ستودیۆ' : language === 'ar' ? 'استوديو' : 'Studio'}</option>
                                <option value="room">{language === 'ku' ? 'ژوور' : language === 'ar' ? 'غرفة' : 'Room'}</option>
                            </select>
                        </div>

                        {/* Furnished */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                {language === 'ku' ? 'ئامادە' : language === 'ar' ? 'مفروش' : 'Furnished'}
                            </label>
                            <select
                                value={filters.furnished}
                                onChange={(e) => setFilters({ ...filters, furnished: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-slate-700 dark:text-slate-200"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="furnished">{language === 'ku' ? 'ئامادە' : language === 'ar' ? 'مفروش' : 'Furnished'}</option>
                                <option value="unfurnished">{language === 'ku' ? 'نەئامادە' : language === 'ar' ? 'غير مفروش' : 'Unfurnished'}</option>
                                <option value="part-furnished">{language === 'ku' ? 'بەشێک ئامادە' : language === 'ar' ? 'مفروش جزئيا' : 'Part-furnished'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Homes List */}
            {!loading && (
                <div className="space-y-4">
                    {homes.length === 0 ? (
                        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
                            <p className="font-semibold text-lg mb-2">
                                {language === 'ku' ? 'هیچ ماڵێک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على منازل' : 'No homes found'}
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
                        homes.map((home) => (
                            <div
                                key={home.id}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:shadow-black/10 hover:border-rose-200/50 dark:hover:border-rose-700/50 transition-all duration-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                                                {home.title}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            {home.location && (
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{home.location}</span>
                                                </div>
                                            )}
                                            {home.city && (
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                    <Building size={16} />
                                                    <span className="text-sm">{home.city}</span>
                                                </div>
                                            )}
                                            {home.bedrooms !== undefined && home.bedrooms !== null && (
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                    <Bed size={16} />
                                                    <span className="text-sm">{home.bedrooms} {language === 'ku' ? 'ژوور' : language === 'ar' ? 'غرف' : 'bed'}</span>
                                                </div>
                                            )}
                                            {home.bathrooms !== undefined && home.bathrooms !== null && (
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                    <Bath size={16} />
                                                    <span className="text-sm">{home.bathrooms} {language === 'ku' ? 'حەمام' : language === 'ar' ? 'حمام' : 'bath'}</span>
                                                </div>
                                            )}
                                            {home.property_type && (
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                    <Home size={16} />
                                                    <span className="text-sm">{propertyTypeNames[home.property_type] || home.property_type}</span>
                                                </div>
                                            )}
                                        </div>

                                        {home.description && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                                {home.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                                <DollarSign size={18} />
                                                £{home.rent_amount.toLocaleString()}
                                                <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                                                    {language === 'ku' ? '/مانگ' : language === 'ar' ? '/شهر' : '/month'}
                                                </span>
                                            </span>
                                            {home.furnished && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                    {furnishedNames[home.furnished] || home.furnished}
                                                </span>
                                            )}
                                            {home.bills_included && (
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                                    {language === 'ku' ? 'بەیلەکان لەگەڵدایە' : language === 'ar' ? 'الفواتير مشمولة' : 'Bills Included'}
                                                </span>
                                            )}
                                            {home.parking_available && (
                                                <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                    {language === 'ku' ? 'پارکینگ' : language === 'ar' ? 'موقف سيارات' : 'Parking'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* View Home Button */}
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => navigate(`/homes/${home.id}`)}
                                        className="w-full px-4 py-2.5 bg-rose-600 text-white font-semibold text-sm rounded-xl hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>
                                            {language === 'ku' 
                                                ? 'بینینی ماڵ' 
                                                : language === 'ar'
                                                ? 'عرض المنزل'
                                                : 'View Home'
                                            }
                                        </span>
                                        <ExternalLink size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Home Submission Form Modal */}
            {showSubmissionForm && (
                <HomeSubmissionForm
                    onClose={() => {
                        setShowSubmissionForm(false);
                        navigate('/homes', { replace: true });
                    }}
                    onSuccess={() => {
                        setShowSubmissionForm(false);
                        loadHomes();
                        navigate('/homes', { replace: true });
                    }}
                />
            )}
        </div>
    );
};

export default HomesList;






