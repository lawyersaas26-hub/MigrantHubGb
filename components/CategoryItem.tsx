
import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';
import { useTranslations } from '../context/LanguageContext';

interface CategoryItemProps {
    category: Category & { name?: string }; // Extended to include name from database
}

const CategoryItem: React.FC<CategoryItemProps> = React.memo(({ category }) => {
    const { translations } = useTranslations();
    const navigate = useNavigate();
    const Icon = category.icon;

    const handleClick = useCallback(() => {
        // Allow viewing all categories - access restriction is at topic level
        navigate(`/category/${category.id}`);
    }, [category.id, navigate]);

    // Use name from database if available, otherwise fall back to translation
    const displayName = useMemo(() => 
        category.name || 
        (translations.categories[category.labelKey] || category.id),
        [category.name, category.labelKey, category.id, translations.categories]
    );

    return (
        <button
            onClick={handleClick}
            className="flex flex-col items-center gap-3 transform transition-all duration-200 ease-out active:scale-95"
        >
            <div className={`relative w-20 h-20 rounded-2xl ${category.color} flex items-center justify-center shadow-lg shadow-black/15 transition-all duration-200 active:scale-100 ring-2 ring-white/80`}>
                <Icon size={36} color="white" strokeWidth={2.5} className="drop-shadow-md" />
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center leading-tight transition-colors duration-200 px-1">
                {displayName}
            </p>
        </button>
    );
});

CategoryItem.displayName = 'CategoryItem';

export default CategoryItem;
