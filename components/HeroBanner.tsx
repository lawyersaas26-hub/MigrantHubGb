import React, { useState, FormEvent, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';

const HeroBanner: React.FC = React.memo(() => {
    const { translations } = useTranslations();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce search input for better performance
    const debouncedQuery = useDebounce(searchQuery, 300);

    const handleSearch = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }, [searchQuery, navigate]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    return (
        <section className="px-5 pt-6 pb-4">
            <form onSubmit={handleSearch} className="relative group">
                <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 dark:text-slate-500 pointer-events-none z-10">
                        <Search size={24} strokeWidth={2} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder={translations.search}
                        className="w-full h-16 pr-6 pl-14 rounded-2xl bg-white/98 dark:bg-slate-700/95 backdrop-blur-md border-2 border-slate-200 dark:border-slate-600/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:outline-none transition-all duration-300 text-left placeholder:text-slate-400 dark:placeholder:text-slate-400 text-slate-700 dark:text-slate-200 font-semibold text-base group-hover:shadow-xl group-hover:shadow-slate-300/50 dark:group-hover:shadow-slate-800/50"
                    />
                </div>
            </form>
        </section>
    );
});

HeroBanner.displayName = 'HeroBanner';

export default HeroBanner;