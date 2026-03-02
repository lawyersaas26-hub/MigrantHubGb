import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getCategories, type CategoryData } from '../lib/supabase';
import { getIconByName } from '../utils/iconMapper';
import { useTranslations } from '../context/LanguageContext';
import CategoryItem from './CategoryItem';
import type { Category } from '../types';

// Map CategoryData from Supabase to Category type for the component
const mapCategoryDataToCategory = (categoryData: CategoryData, language: 'ku' | 'ar' | 'en'): Category => {
    const Icon = getIconByName(categoryData.icon_name);
    return {
        id: categoryData.id as any, // Type assertion needed due to CategoryKey type
        labelKey: categoryData.id as any, // For backward compatibility
        color: categoryData.color,
        icon: Icon,
        // Add name fields for direct access
        name: language === 'ku' 
            ? categoryData.name_ku 
            : language === 'ar' 
            ? categoryData.name_ar 
            : (categoryData.name_en || categoryData.name_ar || categoryData.name_ku),
    } as Category & { name: string };
};

const CategoryGrid: React.FC = React.memo(() => {
    const { language } = useTranslations();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const categoryData = await getCategories(language);
            const mappedCategories = categoryData.map(cat => 
                mapCategoryDataToCategory(cat, language)
            );
            setCategories(mappedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Memoize mapped categories to prevent unnecessary recalculations
    const memoizedCategories = useMemo(() => categories, [categories]);

    if (loading) {
        return (
            <section className="mt-8 px-5 pb-6">
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return (
            <section className="mt-8 px-5 pb-6">
                <p className="text-center text-slate-500 dark:text-slate-400">No categories available</p>
            </section>
        );
    }

    return (
        <section className="mt-6 px-5 pb-6">
            <div className="grid grid-cols-3 gap-5">
                {memoizedCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
});

CategoryGrid.displayName = 'CategoryGrid';

export default CategoryGrid;
