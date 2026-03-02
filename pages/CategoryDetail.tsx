import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ExternalLink, FileText, Plus, Briefcase, Car, Scale, Calculator, Store, Plane, Star, Lock } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getCategoryContent } from '../constants/categoryContent';
import { getResourcesByCategory, getCategoryById, getTopicsByCategory, type Resource, type CategoryData, type Topic } from '../lib/supabase';
import { getIconByName } from '../utils/iconMapper';
import { openLink } from '../utils/browser';
import { stripHtml } from '../utils/htmlUtils';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { checkCategoryAccess, checkTopicAccess, isFreeTopic, hasActiveSubscription } from '../utils/accessControl';
import type { CategoryKey } from '../types';

// Topic Item Component with access check
const TopicItem: React.FC<{
    topic: Topic;
    categoryId: string;
    language: string;
    onNavigate: (path: string) => void;
    userHasSubscription: boolean;
    isFreeTopic: boolean;
}> = ({ topic, categoryId, language, onNavigate, userHasSubscription, isFreeTopic }) => {
    // Determine access immediately - no async check needed
    // If it's a free topic, always accessible
    // If user has subscription, accessible
    // Otherwise, locked
    const hasAccess = isFreeTopic || userHasSubscription;
    const isLocked = !hasAccess;

    const topicTitle = stripHtml(
        language === 'ku' ? topic.title_ku :
            language === 'ar' ? topic.title_ar :
                (topic.title_en || topic.title_ar || topic.title_ku)
    );

    const handleClick = async () => {
        if (hasAccess) {
            onNavigate(`/category/${categoryId}/topic/${topic.slug}`);
        } else {
            // Double-check access on click (in case subscription was just activated)
            const access = await checkTopicAccess(topic.slug, categoryId);
            if (access.hasAccess) {
                onNavigate(`/category/${categoryId}/topic/${topic.slug}`);
            } else {
                // Redirect to account page to show subscription plans
                onNavigate('/account');
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full text-left bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 border transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-between gap-3 ${isLocked
                ? 'border-slate-200 dark:border-slate-700 opacity-75'
                : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700'
                }`}
        >
            <h3 className={`font-bold text-base leading-tight flex-1 ${isLocked
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-slate-100'
                }`}>
                {topicTitle}
            </h3>
            {isLocked ? (
                <Lock size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0" strokeWidth={2.5} />
            ) : (
                <ExternalLink size={20} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" strokeWidth={2.5} />
            )}
        </button>
    );
};

const CategoryDetail: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const { translations, language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [resources, setResources] = useState<Resource[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(false);
    const [category, setCategory] = useState<CategoryData | null>(null);
    const [favoriteStatuses, setFavoriteStatuses] = useState<Record<string, boolean>>({});
    const [togglingFavorites, setTogglingFavorites] = useState<Record<string, boolean>>({});
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [accessLoading, setAccessLoading] = useState(true);
    const [userHasSubscription, setUserHasSubscription] = useState<boolean>(false);

    // Check subscription status once when component loads
    useEffect(() => {
        let cancelled = false;
        const checkSubscription = async () => {
            try {
                const hasSub = await hasActiveSubscription();
                if (!cancelled) {
                    setUserHasSubscription(hasSub);
                }
            } catch (error) {
                console.error('Error checking subscription:', error);
                if (!cancelled) {
                    setUserHasSubscription(false);
                }
            }
        };
        checkSubscription();
        return () => {
            cancelled = true;
        };
    }, []);

    // Check access when categoryId changes
    // Note: We allow viewing all categories, but restrict access to topics
    useEffect(() => {
        let cancelled = false;
        const checkAccess = async () => {
            if (!categoryId) {
                if (!cancelled) {
                    setAccessLoading(false);
                }
                return;
            }
            if (!cancelled) {
                setAccessLoading(true);
            }
            try {
                const access = await checkCategoryAccess(categoryId);
                // Allow viewing category even without subscription
                // Access restriction is handled at topic level
                if (!cancelled) {
                    setHasAccess(access.hasAccess || access.requiredPlan === 'free');
                    setAccessLoading(false);
                }
            } catch (error) {
                console.error('Error checking category access:', error);
                if (!cancelled) {
                    setHasAccess(false);
                    setAccessLoading(false);
                }
            }
        };
        checkAccess();
        return () => {
            cancelled = true;
        };
    }, [categoryId]);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            if (!categoryId) return;

            setLoading(true);
            try {
                // Fetch category data and topics in parallel
                const [categoryData, topicsData, supabaseResources] = await Promise.all([
                    getCategoryById(categoryId),
                    getTopicsByCategory(categoryId),
                    getResourcesByCategory(categoryId, language),
                ]);

                if (cancelled) return;

                setCategory(categoryData);
                // Filter out the topic "پێشکەشکردن بۆ مۆڵەتی شۆفێری"
                const filteredTopics = (topicsData || []).filter(
                    topic => topic.title_ku !== 'پێشکەشکردن بۆ مۆڵەتی شۆفێری' &&
                        !topic.title_ku.includes('پێشکەشکردن بۆ مۆڵەتی شۆفێری')
                );
                setTopics(filteredTopics);

                if (supabaseResources && supabaseResources.length > 0) {
                    setResources(supabaseResources);
                    setUseSupabase(true);

                    // Check favorite status for all resources (batch)
                    const favoriteChecks = await Promise.all(
                        supabaseResources.map(async (resource) => ({
                            id: resource.id,
                            isFav: await isFavorite(resource.id),
                        }))
                    );

                    if (!cancelled) {
                        const statusMap: Record<string, boolean> = {};
                        favoriteChecks.forEach(({ id, isFav }) => {
                            statusMap[id] = isFav;
                        });
                        setFavoriteStatuses(statusMap);
                    }
                } else {
                    setUseSupabase(false);
                    setResources([]);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Error fetching data from Supabase:', error);
                    setUseSupabase(false);
                    setResources([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [categoryId, language]);

    // Note: We removed the access denied redirect
    // All categories can be viewed, but topics require subscription (handled by TopicItem)
    // IMPORTANT: All hooks must be called before any early returns

    const staticContent = useMemo(() => {
        if (!categoryId) return null;
        return getCategoryContent(categoryId, language);
    }, [categoryId, language]);

    // Get icon and name from database category or fallback to static (memoized)
    const Icon = useMemo(() => category ? getIconByName(category.icon_name) : null, [category]);
    const categoryName = useMemo(() => {
        if (!categoryId) return '';
        if (category) {
            return language === 'ku' ? category.name_ku : language === 'ar' ? category.name_ar : (category.name_en || category.name_ar);
        }
        return staticContent && categoryId in translations.categories ? translations.categories[categoryId as CategoryKey] : categoryId;
    }, [category, language, staticContent, categoryId, translations.categories]);
    const categoryColor = useMemo(() => category?.color || 'bg-indigo-600', [category]);

    // Use Supabase resources if available, otherwise fall back to static content
    const displayResources = useMemo(() => {
        if (!categoryId) return [];
        if (useSupabase) return resources;
        return (staticContent?.resources || []).map((r, idx) => ({
            id: `static-${idx}`,
            title: r.title,
            description: r.description || null,
            external_link: r.link || null,
            phone: r.phone || null,
            email: r.email || null,
            source: r.source || null,
            slug: null,
            html_content: '',
            category_id: categoryId,
            language: language,
            display_order: idx,
            is_active: true,
            created_at: '',
            updated_at: '',
        } as Resource));
    }, [useSupabase, resources, staticContent, categoryId, language]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleToggleFavorite = useCallback(async (resource: Resource) => {
        if (togglingFavorites[resource.id]) return;

        setTogglingFavorites(prev => ({ ...prev, [resource.id]: true }));
        try {
            const newFavoriteStatus = await toggleFavorite(resource);
            setFavoriteStatuses(prev => ({ ...prev, [resource.id]: newFavoriteStatus }));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setTogglingFavorites(prev => {
                const newState = { ...prev };
                delete newState[resource.id];
                return newState;
            });
        }
    }, [togglingFavorites]);

    // Early returns AFTER all hooks
    if (!categoryId) {
        return (
            <div className="p-5">
                <p>Category not found</p>
            </div>
        );
    }

    // Only show "not found" if we have neither category data nor static content
    if (!category && !staticContent) {
        return (
            <div className="p-5">
                <p>Category not found</p>
            </div>
        );
    }

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pt-6">
                <button
                    onClick={handleBack}
                    className="p-2.5 active:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                {Icon && (
                    <div className={`w-14 h-14 rounded-2xl ${categoryColor} flex items-center justify-center shadow-lg shadow-black/10 ring-2 ring-white`}>
                        <Icon size={28} color="white" strokeWidth={2.5} />
                    </div>
                )}
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {categoryName}
                </h1>
            </div>

            {/* Description */}
            {staticContent?.description && (
                <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/60 shadow-sm">
                    <p className="text-slate-700 leading-relaxed font-medium">
                        {staticContent.description}
                    </p>
                </div>
            )}
            {/* Show category description from database if available and no static description */}
            {!staticContent?.description && category && (
                <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/60 shadow-sm">
                    <p className="text-slate-700 leading-relaxed font-medium">
                        {language === 'ku' ? category.description_ku
                            : language === 'ar' ? category.description_ar
                                : (category.description_en || category.description_ar || category.description_ku)}
                    </p>
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

            {/* Driving Instructors and Car Sale Links - Only for driving category */}
            {/* Driving Instructors and Car Sale Links - Removed as per request */}

            {/* Lawyer Links Section - Only for legal category */}
            {!loading && categoryId === 'legal' && (
                <div className="mb-8 space-y-2.5">
                    {/* View Lawyers Button */}
                    <button
                        onClick={() => navigate('/lawyers')}
                        className="w-full bg-gradient-to-br from-violet-500 via-violet-600 to-purple-600 text-white rounded-xl p-3 shadow-lg shadow-violet-500/25 transition-all duration-300 active:scale-[0.98] flex items-center gap-3 relative overflow-hidden"
                    >
                        {/* Icon */}
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-white/30">
                            <Scale size={20} className="text-white" strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-right relative z-10 min-w-0">
                            <h2 className="text-base font-bold mb-0.5 truncate">
                                {language === 'ku' ? 'بینینی پارێزه‌رکان' : language === 'ar' ? 'عرض المحامين' : 'View Lawyers'}
                            </h2>
                            <p className="text-[11px] text-violet-50 opacity-95 leading-tight line-clamp-1">
                                {language === 'ku'
                                    ? 'بینینی لیستی پارێزه‌رکان'
                                    : language === 'ar'
                                        ? 'عرض قائمة المحامين المعتمدين'
                                        : 'View approved lawyers'
                                }
                            </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex-shrink-0 opacity-60">
                            <ExternalLink size={16} className="text-white" strokeWidth={2.5} />
                        </div>
                    </button>
                </div>
            )}

            {/* Travel Agent Links Section - Only for travel category */}
            {!loading && categoryId === 'travel' && (
                <div className="mb-8 space-y-2.5">
                    {/* View Travel Agents Button */}
                    <button
                        onClick={() => navigate('/travel-agents')}
                        className="w-full bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white rounded-xl p-3 shadow-lg shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] flex items-center gap-3 relative overflow-hidden"
                    >
                        {/* Icon */}
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-white/30">
                            <Plane size={20} className="text-white" strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-right relative z-10 min-w-0">
                            <h2 className="text-base font-bold mb-0.5 truncate">
                                {language === 'ku' ? 'بینینی دەستەی گەشت' : language === 'ar' ? 'عرض وكلاء السفر' : 'View Travel Agents'}
                            </h2>
                            <p className="text-[11px] text-cyan-50 opacity-95 leading-tight line-clamp-1">
                                {language === 'ku'
                                    ? 'بینینی لیستی دەستەی گەشت'
                                    : language === 'ar'
                                        ? 'عرض قائمة وكلاء السفر المعتمدين'
                                        : 'View approved travel agents'
                                }
                            </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex-shrink-0 opacity-60">
                            <ExternalLink size={16} className="text-white" strokeWidth={2.5} />
                        </div>
                    </button>
                </div>
            )}

            {/* Job Links Section - Only for employment category */}
            {!loading && categoryId === 'employment' && (
                <div className="mb-8 space-y-2.5">
                    {/* View Jobs List Button */}
                    <button
                        onClick={() => navigate('/jobs')}
                        className="group w-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white rounded-xl p-3 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 transition-all duration-300 active:scale-[0.98] flex items-center gap-3 relative overflow-hidden"
                    >
                        {/* Animated background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        {/* Icon */}
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <Briefcase size={20} className="text-white" strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-right relative z-10 min-w-0">
                            <h2 className="text-base font-bold mb-0.5 group-hover:translate-x-[-2px] transition-transform duration-300 truncate">
                                {language === 'ku' ? 'بینینی کارەکان' : language === 'ar' ? 'عرض الوظائف' : 'View Jobs'}
                            </h2>
                            <p className="text-[11px] text-purple-50 opacity-95 leading-tight line-clamp-1">
                                {language === 'ku'
                                    ? 'بینینی کارە بەردەستەکان و دۆزینەوەی کار'
                                    : language === 'ar'
                                        ? 'عرض الوظائف المتاحة والبحث عن عمل'
                                        : 'View available jobs and search for work'
                                }
                            </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-[-4px] transition-all duration-300">
                            <ExternalLink size={16} className="text-white" strokeWidth={2.5} />
                        </div>
                    </button>
                </div>
            )}

            {/* Topics Section */}
            {!loading && topics.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                        {category && (
                            (language === 'ku' && category.topics_section_title_ku) ||
                            (language === 'ar' && category.topics_section_title_ar) ||
                            (language === 'en' && category.topics_section_title_en)
                        ) ? (
                            language === 'ku' ? category.topics_section_title_ku :
                                language === 'ar' ? category.topics_section_title_ar :
                                    (category.topics_section_title_en || category.topics_section_title_ar)
                        ) : (
                            language === 'ku' ? 'بابەتەکان' : language === 'ar' ? 'المواضيع' : 'Topics'
                        )}
                    </h2>
                    {/* Show subscription notice for non-free categories */}
                    {hasAccess === false && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2">
                            <Lock size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                {language === 'ku'
                                    ? 'بۆ دەستگەیشتن بە بابەتەکان، پێویستت بە بەشداریکردن هەیە'
                                    : language === 'ar'
                                        ? 'للوصول إلى المواضيع، يلزم الاشتراك'
                                        : 'A subscription is required to access topics'
                                }
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-3">
                        {topics.map((topic) => {
                            const isFree = isFreeTopic(topic.slug, categoryId || '');
                            return (
                                <TopicItem
                                    key={topic.id}
                                    topic={topic}
                                    categoryId={categoryId || ''}
                                    language={language}
                                    onNavigate={navigate}
                                    userHasSubscription={userHasSubscription}
                                    isFreeTopic={isFree}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Resources List - Only show if there are no topics and not driving category */}
            {!loading && topics.length === 0 && categoryId !== 'driving' && (
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                        {language === 'ku' ? 'سەرچاوەکان' : language === 'ar' ? 'الموارد' : 'Resources'}
                    </h2>
                    {displayResources.length > 0 && displayResources.map((resource) => {
                        const hasHtmlContent = resource.html_content && resource.html_content.trim().length > 0;
                        const hasSlug = resource.slug && resource.slug.trim().length > 0;
                        const isFavorited = favoriteStatuses[resource.id] || false;
                        const isToggling = togglingFavorites[resource.id] || false;

                        return (
                            <div
                                key={resource.id}
                                className="group bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 transition-all duration-200 active:scale-[0.98]"
                            >
                                <div className="flex items-start justify-between gap-3 mb-2.5">
                                    <h3 className="font-bold text-slate-900 text-base leading-tight flex-1">
                                        {resource.title}
                                    </h3>
                                    <button
                                        onClick={() => handleToggleFavorite(resource)}
                                        disabled={isToggling}
                                        className={`p-2 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0 ${isFavorited
                                            ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500'
                                            }`}
                                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <Star
                                            size={18}
                                            strokeWidth={2.5}
                                            fill={isFavorited ? 'currentColor' : 'none'}
                                            className={isToggling ? 'animate-pulse' : ''}
                                        />
                                    </button>
                                </div>
                                {resource.description && (
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                        {resource.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    {/* Special handling for driving instructors link */}
                                    {resource.slug === 'driving-instructors' && categoryId === 'driving' ? (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/driving-instructors');
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-indigo-500/20"
                                        >
                                            <span>{language === 'ku' ? 'بینینی مامۆستاکان' : 'عرض المدرسين'}</span>
                                            <ExternalLink size={16} strokeWidth={2.5} />
                                        </button>
                                    ) : (hasHtmlContent || resource.external_link) && (
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                if (hasHtmlContent && hasSlug) {
                                                    // Navigate to resource detail page
                                                    navigate(`/category/${categoryId}/resource/${resource.slug}`);
                                                } else if (resource.external_link) {
                                                    // Open external link
                                                    await openLink(resource.external_link, resource.title);
                                                }
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-indigo-500/10"
                                        >
                                            <span>{language === 'ku' ? 'زیاتر بخوێنەوە' : 'اقرأ المزيد'}</span>
                                            {hasHtmlContent ? (
                                                <FileText size={16} strokeWidth={2.5} />
                                            ) : (
                                                <ExternalLink size={16} strokeWidth={2.5} />
                                            )}
                                        </button>
                                    )}
                                    {resource.source && (
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
                                            {resource.source}
                                        </span>
                                    )}
                                </div>
                                {resource.phone && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <a
                                            href={`tel:${resource.phone}`}
                                            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm transition-colors"
                                        >
                                            <span className="text-lg">📞</span>
                                            <span>{resource.phone}</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })
                    }
                </div>
            )}



        </div>
    );
};

export default CategoryDetail;
