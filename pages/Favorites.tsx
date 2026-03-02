import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ExternalLink, FileText, Trash2 } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getFavorites, removeFavorite, removeTopicFavorite, type FavoriteItem } from '../utils/favorites';
import { getCategoryById, type CategoryData } from '../lib/supabase';
import { getIconByName } from '../utils/iconMapper';
import { stripHtml } from '../utils/htmlUtils';

const Favorites: React.FC = () => {
    const { translations, language } = useTranslations();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Record<string, CategoryData>>({});
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const favs = await getFavorites();
            setFavorites(favs);

            // Load category data for each favorite
            const categoryIds = [...new Set(favs.map(fav => fav.category_id))];
            const categoryPromises = categoryIds.map(id => getCategoryById(id));
            const categoryResults = await Promise.all(categoryPromises);

            const categoryMap: Record<string, CategoryData> = {};
            categoryResults.forEach((cat, index) => {
                if (cat) {
                    categoryMap[categoryIds[index]] = cat;
                }
            });
            setCategories(categoryMap);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (favorite: FavoriteItem) => {
        const idToRemove = favorite.item_id || favorite.resource_id || favorite.topic_id;
        if (!idToRemove || removingIds.has(idToRemove)) return;

        setRemovingIds(prev => new Set(prev).add(idToRemove));
        try {
            if (favorite.type === 'topic' && favorite.topic_id) {
                await removeTopicFavorite(favorite.topic_id);
                setFavorites(prev => prev.filter(fav => fav.topic_id !== favorite.topic_id));
            } else if (favorite.type === 'resource' && favorite.resource_id) {
                await removeFavorite(favorite.resource_id);
                setFavorites(prev => prev.filter(fav => fav.resource_id !== favorite.resource_id));
            } else if (idToRemove) {
                const { removeItemFavorite } = await import('../utils/favorites');
                await removeItemFavorite(idToRemove);
                setFavorites(prev => prev.filter(fav => fav.item_id !== idToRemove));
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        } finally {
            setRemovingIds(prev => {
                const newSet = new Set(prev);
                if (idToRemove) newSet.delete(idToRemove);
                return newSet;
            });
        }
    };

    const handleNavigateToResource = (favorite: FavoriteItem) => {
        if (favorite.type === 'topic' && favorite.topic_id && favorite.slug) {
            navigate(`/category/${favorite.category_id}/topic/${favorite.slug}`);
        } else if (favorite.type === 'resource') {
            if (favorite.slug) {
                navigate(`/category/${favorite.category_id}/resource/${favorite.slug}`);
            } else if (favorite.resource_id) {
                navigate(`/resource/${favorite.resource_id}`);
            }
        } else if (favorite.type === 'job' && favorite.item_id) {
            navigate(`/jobs/${favorite.item_id}`);
        } else if (favorite.type === 'car' && favorite.item_id) {
            navigate(`/cars/${favorite.item_id}`);
        }
        // Add other types here
    };

    const isRTL = language === 'ku' || language === 'ar';

    // Helper to get icon for generic types
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'job': return { Icon: require('lucide-react').Briefcase, color: 'bg-blue-600' };
            case 'car': return { Icon: require('lucide-react').Car, color: 'bg-cyan-600' };
            case 'lawyer': return { Icon: require('lucide-react').Scale, color: 'bg-purple-600' };
            case 'accountant': return { Icon: require('lucide-react').Calculator, color: 'bg-indigo-600' };
            case 'travel_agent': return { Icon: require('lucide-react').Plane, color: 'bg-sky-600' };
            case 'business': return { Icon: require('lucide-react').Store, color: 'bg-amber-600' };
            case 'driving_instructor': return { Icon: require('lucide-react').User, color: 'bg-green-600' };
            case 'home': return { Icon: require('lucide-react').Home, color: 'bg-rose-600' };
            default: return { Icon: Star, color: 'bg-slate-600' };
        }
    };

    if (loading) {
        return (
            <div className="px-5 py-12">
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">
                        {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="px-5 py-12">
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/15 ring-4 ring-indigo-50/80 dark:ring-slate-700/50">
                        <Star size={48} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {translations.favorites}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xs leading-relaxed">
                        {language === 'ku'
                            ? 'هیچ شتێکی دڵخوازت نەدۆزرایەوە'
                            : language === 'ar'
                                ? 'لا توجد مفضلات حتى الآن'
                                : 'No favorites yet'
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-5 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {translations.favorites}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {language === 'ku'
                        ? `${favorites.length} ${favorites.length === 1 ? 'دڵخواز' : 'دڵخواز'}`
                        : language === 'ar'
                            ? `${favorites.length} ${favorites.length === 1 ? 'مفضل' : 'مفضلات'}`
                            : `${favorites.length} ${favorites.length === 1 ? 'favorite' : 'favorites'}`
                    }
                </p>
            </div>

            <div className="space-y-3">
                {favorites.map((favorite) => {
                    let Icon, categoryColor;

                    if (favorite.category_id && categories[favorite.category_id]) {
                        // Resource or Topic with known category
                        const category = categories[favorite.category_id];
                        Icon = getIconByName(category.icon_name);
                        categoryColor = category.color;
                    } else if (favorite.type !== 'resource' && favorite.type !== 'topic') {
                        // Generic item
                        const typeInfo = getTypeIcon(favorite.type);
                        Icon = typeInfo.Icon;
                        categoryColor = typeInfo.color;
                    } else {
                        // Fallback
                        Icon = Star;
                        categoryColor = 'bg-slate-400';
                    }

                    const favoriteId = favorite.item_id || favorite.resource_id || favorite.topic_id;
                    const isRemoving = favoriteId ? removingIds.has(favoriteId) : false;
                    const hasSlug = favorite.slug && favorite.slug.trim().length > 0;

                    return (
                        <div
                            key={favorite.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200"
                        >
                            <div className="flex items-start gap-4">
                                {Icon && (
                                    <div className={`w-12 h-12 rounded-xl ${categoryColor} flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10 ring-2 ring-white dark:ring-slate-700`}>
                                        <Icon size={24} color="white" strokeWidth={2.5} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1.5 leading-tight">
                                        {stripHtml(favorite.title || '')}
                                    </h3>
                                    {/* Show description for resources/items, not topics */}
                                    {favorite.type !== 'topic' && favorite.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                                            {stripHtml(favorite.description)}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleNavigateToResource(favorite)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-indigo-500/10"
                                        >
                                            <span>
                                                {language === 'ku' ? 'بینین' : language === 'ar' ? 'عرض' : 'View'}
                                            </span>
                                            {hasSlug || favorite.type === 'resource' ? (
                                                <FileText size={16} strokeWidth={2.5} />
                                            ) : (
                                                <ExternalLink size={16} strokeWidth={2.5} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFavorite(favorite)}
                                            disabled={isRemoving}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-red-500/10 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                            <span>
                                                {language === 'ku' ? 'سڕینەوە' : language === 'ar' ? 'حذف' : 'Remove'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Favorites;
