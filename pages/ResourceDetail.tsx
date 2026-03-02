import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ExternalLink, Phone, Mail, Star } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getResourceById, getResourceBySlug, getCategoryById, type Resource, type CategoryData } from '../lib/supabase';
import { getIconByName } from '../utils/iconMapper';
import { openLink } from '../utils/browser';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { processFixedButtons } from '../utils/htmlUtils';
import type { CategoryKey } from '../types';

const ResourceDetail: React.FC = () => {
    const { resourceId, categoryId, slug } = useParams<{ 
        resourceId?: string; 
        categoryId?: CategoryKey;
        slug?: string;
    }>();
    const navigate = useNavigate();
    const { translations, language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;
    
    const [resource, setResource] = useState<Resource | null>(null);
    const [category, setCategory] = useState<CategoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let data: Resource | null = null;
                
                if (resourceId) {
                    // Fetch by ID
                    data = await getResourceById(resourceId);
                } else if (categoryId && slug) {
                    // Fetch by category, language, and slug
                    data = await getResourceBySlug(categoryId, language, slug);
                }
                
                if (data) {
                    setResource(data);
                    // Fetch category data if we have a categoryId
                    if (data.category_id) {
                        const categoryData = await getCategoryById(data.category_id);
                        setCategory(categoryData);
                    } else if (categoryId) {
                        const categoryData = await getCategoryById(categoryId);
                        setCategory(categoryData);
                    }
                    
                    // Check if resource is favorited
                    const favorited = await isFavorite(data.id);
                    setIsFavorited(favorited);
                } else {
                    setError(language === 'ku' ? 'سەرچاوەکە نەدۆزرایەوە' : language === 'ar' ? 'الموارد غير موجودة' : 'Resource not found');
                }
            } catch (err) {
                console.error('Error loading resource:', err);
                setError(language === 'ku' ? 'هەڵەیەک ڕوویدا' : language === 'ar' ? 'حدث خطأ' : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resourceId, categoryId, slug, language]);

    const handleToggleFavorite = async () => {
        if (!resource || isTogglingFavorite) return;
        
        setIsTogglingFavorite(true);
        try {
            const newFavoriteStatus = await toggleFavorite(resource);
            setIsFavorited(newFavoriteStatus);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleBack = () => {
        if (categoryId) {
            navigate(`/category/${categoryId}`);
        } else {
            navigate(-1);
        }
    };

    const Icon = category ? getIconByName(category.icon_name) : null;

    if (loading) {
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

    if (error || !resource) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center p-5">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-slate-700 font-semibold mb-2">{error || (language === 'ku' ? 'سەرچاوەکە نەدۆزرایەوە' : language === 'ar' ? 'الموارد غير موجودة' : 'Resource not found')}</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-8">
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
                    {category && Icon && (
                        <div className={`w-12 h-12 rounded-2xl ${category.color || 'bg-indigo-600'} flex items-center justify-center shadow-lg shadow-black/10 ring-2 ring-white`}>
                            <Icon size={24} color="white" strokeWidth={2.5} />
                        </div>
                    )}
                    <h1 className="text-xl font-bold text-slate-900 leading-tight flex-1 line-clamp-2">
                        {resource.title}
                    </h1>
                    <button
                        onClick={handleToggleFavorite}
                        disabled={isTogglingFavorite}
                        className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                            isFavorited
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500'
                        }`}
                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Star 
                            size={20} 
                            strokeWidth={2.5} 
                            fill={isFavorited ? 'currentColor' : 'none'}
                            className={isTogglingFavorite ? 'animate-pulse' : ''}
                        />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 pt-6">
                {/* Description */}
                {resource.description && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50">
                        <p className="text-slate-700 leading-relaxed font-medium">
                            {resource.description}
                        </p>
                    </div>
                )}

                {/* HTML Content */}
                {resource.html_content && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                        <div 
                            className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: processFixedButtons(resource.html_content) }}
                            style={{
                                direction: isRTL ? 'rtl' : 'ltr',
                            }}
                        />
                    </div>
                )}

                {/* Contact Information - Phone and Email */}
                {(resource.phone || resource.email) && (
                    <div className="space-y-3 mb-6">
                        {resource.phone && (
                            <a
                                href={`tel:${resource.phone}`}
                                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-blue-500/10 border border-blue-200/50"
                            >
                                <Phone size={20} strokeWidth={2.5} />
                                <span>{resource.phone}</span>
                            </a>
                        )}
                        
                        {resource.email && (
                            <a
                                href={`mailto:${resource.email}`}
                                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-green-500/10 border border-green-200/50"
                            >
                                <Mail size={20} strokeWidth={2.5} />
                                <span>{resource.email}</span>
                            </a>
                        )}
                    </div>
                )}

                {/* Source */}
                {resource.source && (
                    <div className="mb-6 pt-6 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200/50 inline-block">
                            {language === 'ku' ? 'سەرچاوە: ' : 'المصدر: '}
                            {resource.source}
                        </p>
                    </div>
                )}

                {/* External Link Button - Only at the end of content */}
                {resource.external_link && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                await openLink(resource.external_link!, resource.title);
                            }}
                            className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-500/20 border border-indigo-700/50"
                        >
                            <ExternalLink size={20} strokeWidth={2.5} />
                            <span>{language === 'ku' ? 'زیاتر بخوێنەوە' : language === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceDetail;
