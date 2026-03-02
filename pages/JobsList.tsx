import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, MapPin, Briefcase, Building, Clock, DollarSign, Filter, X, ExternalLink, Plus } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import JobSubmissionForm from '../components/JobSubmissionForm';
import { getActiveJobs, type Job } from '../lib/supabase';

const JobsList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        type: '',
        category: '',
    });

    // Favorites state
    const [favoriteStatuses, setFavoriteStatuses] = useState<Record<string, boolean>>({});
    const [togglingFavorites, setTogglingFavorites] = useState<Record<string, boolean>>({});

    // Load jobs from Supabase
    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const activeJobs = await getActiveJobs();
            setAllJobs(activeJobs);
            setJobs(activeJobs);

            // Check favorites
            const { isItemFavorite } = await import('../utils/favorites');
            const favoriteChecks = await Promise.all(
                activeJobs.map(async (job) => ({
                    id: job.id,
                    isFav: await isItemFavorite(job.id, 'job'),
                }))
            );
            const statusMap: Record<string, boolean> = {};
            favoriteChecks.forEach(({ id, isFav }) => {
                statusMap[id] = isFav;
            });
            setFavoriteStatuses(statusMap);
        } catch (error) {
            console.error('Error loading jobs:', error);
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

    // Filter jobs based on search and filters
    useEffect(() => {
        let filteredJobs = [...allJobs];

        if (searchQuery) {
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.location) {
            filteredJobs = filteredJobs.filter(job =>
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.type) {
            filteredJobs = filteredJobs.filter(job => job.type === filters.type);
        }

        if (filters.category) {
            filteredJobs = filteredJobs.filter(job => job.category === filters.category);
        }

        setJobs(filteredJobs);
    }, [searchQuery, filters, allJobs]);

    const handleBack = () => {
        navigate(-1);
    };


    const clearFilters = () => {
        setFilters({
            location: '',
            type: '',
            category: '',
        });
        setSearchQuery('');
    };

    const handleToggleFavorite = async (job: Job) => {
        if (togglingFavorites[job.id]) return;

        setTogglingFavorites(prev => ({ ...prev, [job.id]: true }));
        try {
            const { toggleItemFavorite } = await import('../utils/favorites');
            const newStatus = await toggleItemFavorite(job, 'job');
            setFavoriteStatuses(prev => ({ ...prev, [job.id]: newStatus }));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setTogglingFavorites(prev => {
                const newState = { ...prev };
                delete newState[job.id];
                return newState;
            });
        }
    };

    const hasActiveFilters = filters.location || filters.type || filters.category;

    const jobTypeNames: Record<string, string> = {
        'full-time': language === 'ku' ? 'کاتێکی تەواو' : language === 'ar' ? 'دوام كامل' : 'Full-time',
        'part-time': language === 'ku' ? 'کاتێکی بەشێک' : language === 'ar' ? 'دوام جزئي' : 'Part-time',
        'contract': language === 'ku' ? 'گرێبەست' : language === 'ar' ? 'عقد' : 'Contract',
        'temporary': language === 'ku' ? 'کاتی' : language === 'ar' ? 'مؤقت' : 'Temporary',
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
                        {language === 'ku' ? 'دۆزینەوەی کار' : language === 'ar' ? 'البحث عن عمل' : 'Find a Job'}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        {language === 'ku'
                            ? `${jobs.length} کار دۆزرایەوە`
                            : language === 'ar'
                                ? `${jobs.length} وظيفة متاحة`
                                : `${jobs.length} jobs found`
                        }
                    </p>
                </div>
                <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span className="font-bold text-sm">
                        {language === 'ku' ? 'زیادکردنی کار' : language === 'ar' ? 'إضافة وظيفة' : 'Add Job'}
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
                        placeholder={language === 'ku' ? 'گەڕان بە دوای کار...' : language === 'ar' ? 'البحث عن وظيفة...' : 'Search for jobs...'}
                        className="w-full h-14 pr-14 pl-5 rounded-2xl bg-white border-2 border-slate-200 shadow-lg shadow-slate-200/50 focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-200 text-right placeholder:text-slate-400 text-slate-700 font-medium"
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${showFilters || hasActiveFilters
                            ? 'bg-green-600 text-white'
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
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none text-slate-700"
                            />
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'جۆری کار' : language === 'ar' ? 'نوع الوظيفة' : 'Job Type'}
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="full-time">{language === 'ku' ? 'کاتێکی تەواو' : language === 'ar' ? 'دوام كامل' : 'Full-time'}</option>
                                <option value="part-time">{language === 'ku' ? 'کاتێکی بەشێک' : language === 'ar' ? 'دوام جزئي' : 'Part-time'}</option>
                                <option value="contract">{language === 'ku' ? 'گرێبەست' : language === 'ar' ? 'عقد' : 'Contract'}</option>
                                <option value="temporary">{language === 'ku' ? 'کاتی' : language === 'ar' ? 'مؤقت' : 'Temporary'}</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'بەش' : language === 'ar' ? 'الفئة' : 'Category'}
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="retail">{language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail'}</option>
                                <option value="warehouse">{language === 'ku' ? 'کۆگا' : language === 'ar' ? 'مستودع' : 'Warehouse'}</option>
                                <option value="hospitality">{language === 'ku' ? 'خواردن' : language === 'ar' ? 'ضيافة' : 'Hospitality'}</option>
                                <option value="cleaning">{language === 'ku' ? 'پاککردنەوە' : language === 'ar' ? 'تنظيف' : 'Cleaning'}</option>
                                <option value="security">{language === 'ku' ? 'ئاسایش' : language === 'ar' ? 'أمن' : 'Security'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Jobs List */}
            {!loading && (
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <div className="text-center py-12 text-slate-600">
                            <p className="font-semibold text-lg mb-2">
                                {language === 'ku' ? 'هیچ کارێک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على وظائف' : 'No jobs found'}
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
                        jobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 hover:shadow-lg hover:shadow-black/10 hover:border-green-200/50 transition-all duration-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-lg">
                                                    {job.title}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleFavorite(job);
                                                }}
                                                disabled={togglingFavorites[job.id]}
                                                className={`p-2 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0 ${favoriteStatuses[job.id]
                                                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500'
                                                    }`}
                                            >
                                                <div className={togglingFavorites[job.id] ? 'animate-pulse' : ''}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill={favoriteStatuses[job.id] ? "currentColor" : "none"}
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                </div>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <Building size={16} />
                                                <span className="text-sm">{job.company}</span>
                                            </div>
                                            {job.location && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{job.location}</span>
                                                </div>
                                            )}
                                            {job.type && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Clock size={16} />
                                                    <span className="text-sm">{jobTypeNames[job.type] || job.type}</span>
                                                </div>
                                            )}
                                            {job.contact_phone && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <span className="text-sm">{job.contact_phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {job.description && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {job.description}
                                            </p>
                                        )}

                                        {job.requirements && (
                                            <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                                                {language === 'ku' ? 'پێویستیەکان: ' : language === 'ar' ? 'المتطلبات: ' : 'Requirements: '}
                                                {job.requirements}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 flex-wrap">
                                            {job.salary && (
                                                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                                                    <DollarSign size={16} />
                                                    {job.salary}
                                                </span>
                                            )}
                                            {job.posted_date && (
                                                <span className="text-xs text-slate-500">
                                                    {new Date(job.posted_date).toLocaleDateString(language === 'ku' ? 'ku' : language === 'ar' ? 'ar' : 'en-GB')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* View Job Button */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                        className="w-full px-4 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>
                                            {language === 'ku'
                                                ? 'بینینی کار و داوای کار'
                                                : language === 'ar'
                                                    ? 'عرض الوظيفة والتقديم'
                                                    : 'View Job and Apply'
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

            {/* Job Submission Form Modal */}
            {showSubmissionForm && (
                <JobSubmissionForm
                    onClose={() => {
                        setShowSubmissionForm(false);
                        // Remove the action parameter from URL
                        navigate('/jobs', { replace: true });
                    }}
                    onSuccess={() => {
                        setShowSubmissionForm(false);
                        // Refresh jobs list
                        loadJobs();
                        navigate('/jobs', { replace: true });
                    }}
                />
            )}
        </div>
    );
};

export default JobsList;
