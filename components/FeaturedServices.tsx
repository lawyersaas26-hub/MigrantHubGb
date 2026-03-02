import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Car, Scale, Calculator, Plane, Store, User, Home, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { checkRouteAccess } from '../utils/accessControl';

interface Service {
    id: string;
    icon: React.ComponentType<any>;
    route: string;
    gradient: string;
    gradientDark: string;
    shadowColor: string;
}

// Service Card Component - Memoized for performance
const ServiceCard: React.FC<{
    service: Service;
    serviceName: string;
    ArrowIcon: React.ComponentType<any>;
    viewAllText: string;
    onNavigate: (path: string) => void;
}> = React.memo(({ service, serviceName, ArrowIcon, viewAllText, onNavigate }) => {
    const Icon = service.icon;
    
    const handleServiceClick = useCallback(async () => {
        const access = await checkRouteAccess(service.route);
        if (access.hasAccess) {
            onNavigate(service.route);
        } else {
            onNavigate('/account');
        }
    }, [service.route, onNavigate]);

    return (
        <div
            className="group flex-shrink-0 w-40 h-48 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden flex flex-col"
        >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Main Card Button */}
            <button
                onClick={handleServiceClick}
                className="w-full h-full flex flex-col items-center justify-between relative z-0 active:scale-95 transition-transform duration-200 p-5"
            >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} dark:${service.gradientDark} flex items-center justify-center shadow-lg ${service.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} className="text-white" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-3">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1.5 leading-tight">
                        {serviceName}
                    </h3>
                </div>

                {/* View All Button */}
                <div className={`w-full flex items-center justify-center gap-1.5 mt-2 px-3 py-2 rounded-xl bg-gradient-to-r ${service.gradient} dark:${service.gradientDark} text-white text-xs font-bold shadow-md ${service.shadowColor} group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                    <span>{viewAllText}</span>
                    <ArrowIcon size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
            </button>
        </div>
    );
});

ServiceCard.displayName = 'ServiceCard';

const FeaturedServices: React.FC = React.memo(() => {
    const navigate = useNavigate();
    const { translations, language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const ArrowIcon = useMemo(() => isRTL ? ArrowRight : ChevronRight, [isRTL]);
    

    const services: Service[] = useMemo(() => [
        {
            id: 'jobs',
            icon: Briefcase,
            route: '/jobs',
            gradient: 'from-blue-500 to-blue-600',
            gradientDark: 'from-blue-600 to-blue-700',
            shadowColor: 'shadow-blue-500/20',
        },
        {
            id: 'cars',
            icon: Car,
            route: '/cars',
            gradient: 'from-cyan-500 to-cyan-600',
            gradientDark: 'from-cyan-600 to-cyan-700',
            shadowColor: 'shadow-cyan-500/20',
        },
        {
            id: 'lawyers',
            icon: Scale,
            route: '/lawyers',
            gradient: 'from-purple-500 to-purple-600',
            gradientDark: 'from-purple-600 to-purple-700',
            shadowColor: 'shadow-purple-500/20',
        },
        {
            id: 'accountants',
            icon: Calculator,
            route: '/accountants',
            gradient: 'from-indigo-500 to-indigo-600',
            gradientDark: 'from-indigo-600 to-indigo-700',
            shadowColor: 'shadow-indigo-500/20',
        },
        {
            id: 'travelAgents',
            icon: Plane,
            route: '/travel-agents',
            gradient: 'from-sky-500 to-sky-600',
            gradientDark: 'from-sky-600 to-sky-700',
            shadowColor: 'shadow-sky-500/20',
        },
        {
            id: 'businesses',
            icon: Store,
            route: '/businesses',
            gradient: 'from-amber-500 to-amber-600',
            gradientDark: 'from-amber-600 to-amber-700',
            shadowColor: 'shadow-amber-500/20',
        },
        {
            id: 'drivingInstructors',
            icon: User,
            route: '/driving-instructors',
            gradient: 'from-green-500 to-green-600',
            gradientDark: 'from-green-600 to-green-700',
            shadowColor: 'shadow-green-500/20',
        },
        {
            id: 'homes',
            icon: Home,
            route: '/homes',
            gradient: 'from-rose-500 to-rose-600',
            gradientDark: 'from-rose-600 to-rose-700',
            shadowColor: 'shadow-rose-500/20',
        },
    ], []);

    const getServiceName = useCallback((serviceId: string): string => {
        const serviceKey = serviceId as keyof typeof translations.services;
        return translations.services[serviceKey] || serviceId;
    }, [translations.services]);

    return (
        <section className="mt-8 px-5 pb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {translations.featuredServices}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {language === 'ku' 
                            ? 'دۆزینەوەی کار، خزمەتگوزاری و لیستەکان'
                            : language === 'ar'
                            ? 'ابحث عن الوظائف والخدمات والقوائم'
                            : 'Find jobs, services, and listings'
                        }
                    </p>
                </div>
            </div>

            {/* Horizontal Scrollable Cards */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 scroll-container">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        serviceName={getServiceName(service.id)}
                        ArrowIcon={ArrowIcon}
                        viewAllText={translations.viewAll}
                        onNavigate={navigate}
                    />
                ))}
            </div>


        </section>
    );
});

FeaturedServices.displayName = 'FeaturedServices';

export default FeaturedServices;
