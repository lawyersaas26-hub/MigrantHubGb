import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ExternalLink, Search as SearchIcon } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { searchContent, type SearchResult } from '../utils/search';
import { getCategories, type CategoryData } from '../lib/supabase';
import { getIconByName } from '../utils/iconMapper';
import { openLink } from '../utils/browser';
import { useDebounce } from '../hooks/useDebounce';
import type { CategoryKey } from '../types';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { translations, language } = useTranslations();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Map<string, { icon: any; color: string; name: string }>>(new Map());
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    // Debounce search query to reduce API calls
    const debouncedQuery = useDebounce(query, 300);

    // Fetch categories for icon/color lookup (memoized)
    const fetchCategories = useCallback(async () => {
        try {
            const categoryData = await getCategories(language);
            const categoryMap = new Map();
            categoryData.forEach(cat => {
                const Icon = getIconByName(cat.icon_name);
                categoryMap.set(cat.id, {
                    icon: Icon,
                    color: cat.color,
                    name: language === 'ku' 
                        ? cat.name_ku 
                        : language === 'ar' 
                        ? cat.name_ar 
                        : (cat.name_en || cat.name_ar || cat.name_ku),
                });
            });
            setCategories(categoryMap);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, [language]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Perform search with debounced query
    useEffect(() => {
        if (debouncedQuery.trim()) {
            const performSearch = async () => {
                setIsLoading(true);
                try {
                    const searchResults = await searchContent(debouncedQuery, language);
                    setResults(searchResults);
                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            };
            performSearch();
        } else {
            setResults([]);
            setIsLoading(false);
        }
    }, [debouncedQuery, language]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleCategoryClick = useCallback((categoryId: CategoryKey) => {
        navigate(`/category/${categoryId}`);
    }, [navigate]);

    const highlightText = useCallback((text: string, query: string) => {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded text-slate-900 dark:text-yellow-200">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    }, []);

    const firstResultCategory = results[0]?.categoryId ? categories.get(results[0].categoryId) : null;
    const Icon = firstResultCategory?.icon;

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6">
                <button
                    onClick={handleBack}
                    className="p-2.5 active:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ku' ? 'ئەنجامەکانی گەڕان' : language === 'ar' ? 'نتائج البحث' : 'Search Results'}
                    </h1>
                    {query && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                            {language === 'ku' 
                                ? `${results.length} ئەنجام دۆزرایەوە بۆ "${query}"`
                                : language === 'ar'
                                ? `${results.length} نتيجة لـ "${query}"`
                                : `${results.length} results for "${query}"`
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            const newQuery = e.target.value;
                            navigate(`/search?q=${encodeURIComponent(newQuery)}`, { replace: true });
                        }}
                        placeholder={translations.search}
                        className="w-full h-14 pr-14 pl-5 rounded-2xl bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:outline-none transition-all duration-200 text-right placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200 font-medium"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-400">
                        <SearchIcon size={22} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/10 animate-pulse">
                        <SearchIcon size={40} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                        {language === 'ku' 
                            ? 'گەڕان...'
                            : language === 'ar'
                            ? 'جاري البحث...'
                            : 'Searching...'
                        }
                    </p>
                </div>
            ) : !query ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/10">
                        <SearchIcon size={40} className="text-indigo-600" strokeWidth={2.5} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                        {language === 'ku' 
                            ? 'تکایە وشەیەک بنووسە بۆ گەڕان'
                            : language === 'ar'
                            ? 'الرجاء إدخال كلمة للبحث'
                            : 'Please enter a word to search'
                        }
                    </p>
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-500/10 dark:shadow-slate-900/50">
                        <SearchIcon size={40} className="text-slate-400 dark:text-slate-500" strokeWidth={2.5} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-bold text-lg mb-2">
                        {language === 'ku' 
                            ? 'هیچ ئەنجامێک دۆزرایەوە'
                            : language === 'ar'
                            ? 'لم يتم العثور على نتائج'
                            : 'No results found'
                        }
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {language === 'ku' 
                            ? `هیچ شتێک دۆزرایەوە بۆ "${query}"`
                            : language === 'ar'
                            ? `لا توجد نتائج لـ "${query}"`
                            : `No results found for "${query}"`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((result, index) => {
                        const resultCategory = result.categoryId ? categories.get(result.categoryId) : null;
                        const ResultIcon = resultCategory?.icon;

                        const handleResultClick = () => {
                            if (result.type === 'resource' && result.resource) {
                                if (result.resource.slug && result.categoryId) {
                                    navigate(`/category/${result.categoryId}/resource/${result.resource.slug}`);
                                } else {
                                    navigate(`/resource/${result.resource.id}`);
                                }
                            } else if (result.type === 'topic' && result.topic) {
                                navigate(`/category/${result.categoryId}/topic/${result.topic.slug}`);
                            } else if (result.type === 'instructor' && result.instructor) {
                                navigate(`/driving-instructors/${result.instructor.id}`);
                            } else {
                                handleCategoryClick(result.categoryId as any);
                            }
                        };

                        return (
                            <div
                                key={index}
                                onClick={handleResultClick}
                                className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4">
                                    {ResultIcon && resultCategory && (
                                        <div className={`w-12 h-12 rounded-xl ${resultCategory.color} flex items-center justify-center shadow-md shadow-black/10 flex-shrink-0 ring-2 ring-white`}>
                                            <ResultIcon size={24} color="white" strokeWidth={2.5} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                                {result.categoryLabel}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500">
                                                {result.type === 'category' 
                                                    ? (language === 'ku' ? 'بەش' : language === 'ar' ? 'فئة' : 'Category')
                                                    : result.type === 'resource'
                                                    ? (language === 'ku' ? 'سەرچاوە' : language === 'ar' ? 'مورد' : 'Resource')
                                                    : result.type === 'topic'
                                                    ? (language === 'ku' ? 'بابەت' : language === 'ar' ? 'موضوع' : 'Topic')
                                                    : (language === 'ku' ? 'مامۆستای شۆفێری' : language === 'ar' ? 'مدرس قيادة' : 'Instructor')
                                                }
                                            </span>
                                        </div>
                                        {result.resource ? (
                                            <>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-base leading-tight">
                                                    {highlightText(result.resource.title, query)}
                                                </h3>
                                                {result.resource.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                                                        {highlightText(result.resource.description, query)}
                                                    </p>
                                                )}
                                                {result.resource.link && (
                                                    <button
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            await openLink(result.resource!.link!, result.resource!.title);
                                                        }}
                                                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm transition-colors"
                                                    >
                                                        <ExternalLink size={16} strokeWidth={2.5} />
                                                        <span>
                                                            {language === 'ku' ? 'زیاتر بخوێنەوە' : language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                                                        </span>
                                                    </button>
                                                )}
                                            </>
                                        ) : result.topic ? (
                                            <>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-base leading-tight">
                                                    {highlightText(result.topic.title, query)}
                                                </h3>
                                                {result.topic.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                                                        {highlightText(result.topic.description, query)}
                                                    </p>
                                                )}
                                            </>
                                        ) : result.instructor ? (
                                            <>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-base leading-tight">
                                                    {highlightText(result.instructor.name, query)}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                                    {result.instructor.location}
                                                </p>
                                                {result.instructor.bio && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                                                        {highlightText(result.instructor.bio, query)}
                                                    </p>
                                                )}
                                                {result.instructor.phone && (
                                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                                                        {result.instructor.phone}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-slate-900 dark:text-slate-100 font-semibold leading-relaxed">
                                                {highlightText(result.matchText.substring(0, 100), query)}
                                                {result.matchText.length > 100 ? '...' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchResults;

