import React, { useMemo, useCallback } from 'react';
import { Home, Star, UserCircle } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import type { NavItem } from '../types';

interface BottomNavProps {
    activeItem: NavItem;
    setActiveItem: (item: NavItem) => void;
}

const BottomNav: React.FC<BottomNavProps> = React.memo(({ activeItem, setActiveItem }) => {
    const { translations } = useTranslations();

    const navItems = useMemo(() => [
        { id: 'account' as NavItem, label: translations.account, icon: UserCircle },
        { id: 'favorites' as NavItem, label: translations.favorites, icon: Star },
        { id: 'home' as NavItem, label: translations.home, icon: Home },
    ], [translations.account, translations.favorites, translations.home]);

    const handleNavClick = useCallback((item: NavItem) => {
        setActiveItem(item);
    }, [setActiveItem]);

    return (
        <nav
            className="w-full bg-white dark:bg-slate-800 border-t border-slate-200/50 dark:border-slate-700/50 z-50 transition-all duration-300 flex-shrink-0"
            data-bottom-nav="true"
            style={{
                width: '100%',
                maxWidth: '640px',
                margin: '0 auto',
                paddingBottom: 'env(safe-area-inset-bottom)',
                minHeight: 'calc(3rem + env(safe-area-inset-bottom))',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                contain: 'layout style paint',
            }}
        >
            <div
                className="max-w-[640px] mx-auto flex justify-around items-center px-2 h-12"
            >
                {navItems.map((item) => {
                    const isActive = activeItem === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 ease-out active:scale-95 ${isActive
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            <div className={`relative p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-900/30'
                                : ''
                                }`}>
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-all duration-200 ${isActive ? 'fill-current' : ''}`}
                                />
                            </div>
                            <span className={`text-[10px] font-medium transition-all duration-200 leading-tight ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;