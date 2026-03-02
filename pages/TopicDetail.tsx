import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ExternalLink, FileText, Star, Lock } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getTopicBySlug, getResourcesByTopic, getCategoryById, type Topic, type Resource, type CategoryData } from '../lib/supabase';
import { getIconByName } from '../utils/iconMapper';
import { openLink } from '../utils/browser';
import { stripHtml, processFixedButtons } from '../utils/htmlUtils';
import { isFavorite, toggleFavorite, isTopicFavorite, toggleTopicFavorite } from '../utils/favorites';
import { checkTopicAccess } from '../utils/accessControl';

const TopicDetail: React.FC = () => {
    const { categoryId, topicSlug } = useParams<{ categoryId: string; topicSlug: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [topic, setTopic] = useState<Topic | null>(null);
    const [category, setCategory] = useState<CategoryData | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoriteStatuses, setFavoriteStatuses] = useState<Record<string, boolean>>({});
    const [togglingFavorites, setTogglingFavorites] = useState<Record<string, boolean>>({});
    const [isTopicFavorited, setIsTopicFavorited] = useState(false);
    const [togglingTopicFavorite, setTogglingTopicFavorite] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [accessLoading, setAccessLoading] = useState(true);

    // Check access when topic changes
    useEffect(() => {
        let cancelled = false;
        const checkAccess = async () => {
            if (!topicSlug || !categoryId) {
                if (!cancelled) {
                    setAccessLoading(false);
                }
                return;
            }
            if (!cancelled) {
                setAccessLoading(true);
            }
            try {
                const access = await checkTopicAccess(topicSlug, categoryId);
                if (!cancelled) {
                    setHasAccess(access.hasAccess);
                    setAccessLoading(false);
                    
                    // Redirect to account if no access (but allow free topics)
                    if (!access.hasAccess && access.requiredPlan !== 'free') {
                        setTimeout(() => {
                            if (!cancelled) {
                                navigate('/account');
                            }
                        }, 2000); // Show message for 2 seconds then redirect
                    }
                }
            } catch (error) {
                console.error('Error checking topic access:', error);
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
    }, [topicSlug, categoryId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId || !topicSlug) return;
            
            setLoading(true);
            try {
                const [topicData, categoryData] = await Promise.all([
                    getTopicBySlug(categoryId, topicSlug),
                    getCategoryById(categoryId),
                ]);
                
                setTopic(topicData);
                setCategory(categoryData);
                
                if (topicData) {
                    const resourcesData = await getResourcesByTopic(topicData.id, language);
                    setResources(resourcesData);
                    
                    // Check favorite status for the topic
                    const topicFavoriteStatus = await isTopicFavorite(topicData.id);
                    setIsTopicFavorited(topicFavoriteStatus);
                    
                    // Check favorite status for all resources
                    const favoriteChecks = await Promise.all(
                        resourcesData.map(async (resource) => ({
                            id: resource.id,
                            isFav: await isFavorite(resource.id),
                        }))
                    );
                    const statusMap: Record<string, boolean> = {};
                    favoriteChecks.forEach(({ id, isFav }) => {
                        statusMap[id] = isFav;
                    });
                    setFavoriteStatuses(statusMap);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, topicSlug, language]);

    const handleBack = () => {
        navigate(`/category/${categoryId}`);
    };

    const handleToggleFavorite = async (resource: Resource) => {
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
    };

    const handleToggleTopicFavorite = async () => {
        if (!topic || togglingTopicFavorite) return;
        
        setTogglingTopicFavorite(true);
        try {
            const newFavoriteStatus = await toggleTopicFavorite(topic, language);
            setIsTopicFavorited(newFavoriteStatus);
        } catch (error) {
            console.error('Error toggling topic favorite:', error);
        } finally {
            setTogglingTopicFavorite(false);
        }
    };

    if (loading || accessLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">
                        {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    // Show access denied message if user doesn't have access
    if (accessLoading === false && hasAccess === false) {
        return (
            <div className="px-5 py-8">
                <div className="flex items-center gap-4 mb-6 pt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 active:bg-slate-100 dark:active:bg-slate-700 rounded-xl transition-all duration-200 active:scale-95"
                    >
                        <BackIcon size={22} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                        <Lock size={40} className="text-red-600 dark:text-red-400" strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {language === 'ku' 
                            ? 'دەستگەیشتن قەدەغەکراوە' 
                            : language === 'ar'
                            ? 'الوصول مقيد'
                            : 'Access Restricted'
                        }
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xs leading-relaxed mb-6">
                        {language === 'ku'
                            ? 'ئەم بەشە پێویستی بە بەشداریکردن هەیە. تکایە بچۆ بۆ هەژمارەکەت بۆ بینینی پلانەکان.'
                            : language === 'ar'
                            ? 'يتطلب هذا القسم اشتراكًا. يرجى الانتقال إلى حسابك لعرض الخطط.'
                            : 'This section requires a subscription. Please go to your account to view plans.'
                        }
                    </p>
                    <button
                        onClick={() => navigate('/account')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        {language === 'ku' ? 'بینینی پلانەکان' : language === 'ar' ? 'عرض الخطط' : 'View Plans'}
                    </button>
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center p-5">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-slate-700 font-semibold mb-2">
                        {language === 'ku' ? 'بابەتەکە نەدۆزرایەوە' : language === 'ar' ? 'الموضوع غير موجود' : 'Topic not found'}
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        {language === 'ku' ? 'گەڕانەوە' : language === 'ar' ? 'رجوع' : 'Back'}
                    </button>
                </div>
            </div>
        );
    }

    const topicTitle = stripHtml(
        language === 'ku' ? topic.title_ku : 
        language === 'ar' ? topic.title_ar : 
        (topic.title_en || topic.title_ar || topic.title_ku)
    );
    const rawTopicDescription = 
        language === 'ku' ? topic.description_ku : 
        language === 'ar' ? topic.description_ar : 
        (topic.description_en || topic.description_ar || topic.description_ku);
    
    // Process HTML to convert fixed buttons to regular buttons
    const topicDescription = processFixedButtons(rawTopicDescription || '');
    const categoryIcon = category ? getIconByName(category.icon_name) : null;
    const categoryColor = category?.color || 'bg-indigo-600';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-8" style={{ overflowX: 'hidden' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 px-5 py-4">
                    <button
                        onClick={handleBack}
                        className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                        aria-label="Back"
                    >
                        <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight flex-1 line-clamp-2">
                        {topicTitle}
                    </h1>
                    <button
                        onClick={handleToggleTopicFavorite}
                        disabled={togglingTopicFavorite}
                        className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0 ${
                            isTopicFavorited
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500'
                        }`}
                        aria-label={isTopicFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Star 
                            size={20} 
                            strokeWidth={2.5} 
                            fill={isTopicFavorited ? 'currentColor' : 'none'}
                            className={togglingTopicFavorite ? 'animate-pulse' : ''}
                        />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 pt-6">
                {/* Description */}
                {topicDescription && (
                    <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50 overflow-visible relative">
                        <div 
                            className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: topicDescription }}
                            style={{
                                direction: isRTL ? 'rtl' : 'ltr',
                            }}
                        />
                    </div>
                )}

                {/* Resources List - Always show topic items/resources */}
                {resources.length > 0 && (
                    <div className="space-y-3 mt-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                            {language === 'ku' ? 'سەرچاوەکان' : language === 'ar' ? 'الموارد' : 'Resources'}
                            <span className="text-sm font-normal text-slate-500">
                                ({resources.length})
                            </span>
                        </h2>
                        
                        {resources.map((resource) => {
                            const hasHtmlContent = resource.html_content && resource.html_content.trim().length > 0;
                            const hasSlug = resource.slug && resource.slug.trim().length > 0;
                            const isFavorited = favoriteStatuses[resource.id] || false;
                            const isToggling = togglingFavorites[resource.id] || false;
                            
                            return (
                                <div
                                    key={resource.id}
                                    className="group bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 hover:shadow-lg hover:shadow-black/10 hover:border-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2.5">
                                        <h3 className="font-bold text-slate-900 text-base leading-tight flex-1">
                                            {resource.title}
                                        </h3>
                                        <button
                                            onClick={() => handleToggleFavorite(resource)}
                                            disabled={isToggling}
                                            className={`p-2 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0 ${
                                                isFavorited
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
                                        {(hasHtmlContent || resource.external_link) && (
                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    if (hasHtmlContent && hasSlug) {
                                                        navigate(`/category/${categoryId}/resource/${resource.slug}`);
                                                    } else if (resource.external_link) {
                                                        await openLink(resource.external_link, resource.title);
                                                    }
                                                }}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-indigo-500/10"
                                            >
                                                <span>{language === 'ku' ? 'زیاتر بخوێنەوە' : language === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
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
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                                            >
                                                <span className="text-lg">📞</span>
                                                <span>{resource.phone}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicDetail;

