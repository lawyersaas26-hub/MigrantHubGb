import type { LucideProps } from 'lucide-react';
import type React from 'react';

export type Language = 'ku' | 'ar' | 'en';

export type CategoryKey = 'immigration' | 'housing' | 'employment' | 'education' | 'healthcare' | 'legal' | 'financial' | 'culture' | 'emergency';

export interface TranslationSet {
    welcomeUser: string;
    search: string;
    home: string;
    favorites: string;
    account: string;
    featuredServices: string;
    viewAll: string;
    available: string;
    categories: Record<CategoryKey, string>;
    services: {
        jobs: string;
        cars: string;
        lawyers: string;
        accountants: string;
        travelAgents: string;
        businesses: string;
        drivingInstructors: string;
        homes: string;
    };
}

export interface LanguageContextType {
    language: Language;
    translations: TranslationSet;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

export interface Category {
    id: CategoryKey;
    labelKey: CategoryKey;
    color: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export type NavItem = 'home' | 'favorites' | 'account';
