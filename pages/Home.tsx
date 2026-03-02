import React, { useMemo } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedServices from '../components/FeaturedServices';
import { useTranslations } from '../context/LanguageContext';

const Home: React.FC = React.memo(() => {
    const { language } = useTranslations();
    
    return (
        <div key={language} className="animate-fadeIn">
            <HeroBanner />
            {/* Show FeaturedServices to ALL users - access control happens on click */}
            <FeaturedServices />
            <CategoryGrid />
        </div>
    );
});

Home.displayName = 'Home';

export default Home;
