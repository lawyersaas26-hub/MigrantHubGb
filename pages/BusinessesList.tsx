import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, Store, MapPin, Phone, Mail, Globe, DollarSign, Filter, X, Building, Plus } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getActiveBusinesses, type Business } from '../lib/supabase';
import BusinessSubmissionForm from '../components/BusinessSubmissionForm';

const BusinessesList: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        business_type: '',
    });

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        setLoading(true);
        try {
            const activeBusinesses = await getActiveBusinesses();
            setAllBusinesses(activeBusinesses);
            setBusinesses(activeBusinesses);
        } catch (error) {
            console.error('Error loading businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filteredBusinesses = [...allBusinesses];

        if (searchQuery) {
            filteredBusinesses = filteredBusinesses.filter(business =>
                business.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                business.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                business.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.location) {
            filteredBusinesses = filteredBusinesses.filter(business =>
                business.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.category) {
            filteredBusinesses = filteredBusinesses.filter(business => business.category === filters.category);
        }

        if (filters.business_type) {
            filteredBusinesses = filteredBusinesses.filter(business => business.business_type === filters.business_type);
        }

        setBusinesses(filteredBusinesses);
    }, [searchQuery, filters, allBusinesses]);

    const handleBack = () => {
        navigate(-1);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            category: '',
            business_type: '',
        });
        setSearchQuery('');
    };

    const hasActiveFilters = filters.location || filters.category || filters.business_type;

    const categoryNames: Record<string, string> = {
        'food': language === 'ku' ? 'خواردن' : language === 'ar' ? 'طعام' : 'Food & Beverage',
        'retail': language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail',
        'beauty': language === 'ku' ? 'جوانکاری' : language === 'ar' ? 'جمال' : 'Beauty & Salon',
        'automotive': language === 'ku' ? 'ئۆتۆمبێل' : language === 'ar' ? 'سيارات' : 'Automotive',
        'services': language === 'ku' ? 'خزمەتگوزاری' : language === 'ar' ? 'خدمات' : 'Services',
        'other': language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other',
    };

    const businessTypeNames: Record<string, string> = {
        'restaurant': language === 'ku' ? 'خواردنگە' : language === 'ar' ? 'مطعم' : 'Restaurant',
        'shop': language === 'ku' ? 'دوکان' : language === 'ar' ? 'متجر' : 'Shop',
        'service': language === 'ku' ? 'خزمەتگوزاری' : language === 'ar' ? 'خدمة' : 'Service',
        'retail': language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail',
        'other': language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other',
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
                        {language === 'ku' ? 'کاروبارەکان' : language === 'ar' ? 'الأعمال التجارية' : 'Businesses'}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        {language === 'ku' 
                            ? `${businesses.length} کاروبار دۆزرایەوە`
                            : language === 'ar'
                            ? `${businesses.length} عمل تجاري متاح`
                            : `${businesses.length} businesses found`
                        }
                    </p>
                </div>
                <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span className="font-bold text-sm">
                        {language === 'ku' ? 'زیادکردنی کاروبار' : language === 'ar' ? 'إضافة عمل تجاري' : 'Add Business'}
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
                        placeholder={language === 'ku' ? 'گەڕان بە دوای کاروبار...' : language === 'ar' ? 'البحث عن عمل تجاري...' : 'Search for businesses...'}
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
                                {language === 'ku' ? 'بەش' : language === 'ar' ? 'الفئة' : 'Category'}
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
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

            {/* Businesses List */}
            {!loading && (
                <div className="space-y-4">
                    {businesses.length === 0 ? (
                        <div className="text-center py-12 text-slate-600">
                            <p className="font-semibold text-lg mb-2">
                                {language === 'ku' ? 'هیچ کاروبارێک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على أعمال تجارية' : 'No businesses found'}
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
                        businesses.map((business) => (
                            <div
                                key={business.id}
                                onClick={() => navigate(`/businesses/${business.id}`)}
                                className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 hover:shadow-lg hover:shadow-black/10 hover:border-indigo-200/50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Store size={32} className="text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                {business.business_name}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            {business.location && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{business.location}</span>
                                                </div>
                                            )}
                                            {business.category && (
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                                                    {categoryNames[business.category] || business.category}
                                                </span>
                                            )}
                                            {business.business_type && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                                                    {businessTypeNames[business.business_type] || business.business_type}
                                                </span>
                                            )}
                                        </div>

                                        {business.description && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {business.description}
                                            </p>
                                        )}

                                        {business.price && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <DollarSign size={16} className="text-green-600" />
                                                <span className="text-sm font-bold text-green-600">£{business.price.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-sm flex-wrap">
                                        {business.contact_phone && (
                                            <a
                                                href={`tel:${business.contact_phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Phone size={16} />
                                                <span>{business.contact_phone}</span>
                                            </a>
                                        )}
                                        {business.contact_email && (
                                            <a
                                                href={`mailto:${business.contact_email}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Mail size={16} />
                                                <span>{business.contact_email}</span>
                                            </a>
                                        )}
                                        {business.website && (
                                            <a
                                                href={business.website}
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

            {/* Business Submission Form Modal */}
            {showSubmissionForm && (
                <BusinessSubmissionForm
                    onClose={() => setShowSubmissionForm(false)}
                    onSuccess={() => {
                        setShowSubmissionForm(false);
                        loadBusinesses();
                    }}
                />
            )}
        </div>
    );
};

export default BusinessesList;








