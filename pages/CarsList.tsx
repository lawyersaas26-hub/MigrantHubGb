import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, Car as CarIcon, MapPin, Calendar, Gauge, DollarSign, Filter, X, Phone, Mail, Plus } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getActiveCars, type Car } from '../lib/supabase';
import CarSubmissionForm from '../components/CarSubmissionForm';

const CarsList: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [cars, setCars] = useState<Car[]>([]);
    const [allCars, setAllCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        fuel_type: '',
        transmission: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        setLoading(true);
        try {
            const activeCars = await getActiveCars();
            setAllCars(activeCars);
            setCars(activeCars);
        } catch (error) {
            console.error('Error loading cars:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filteredCars = [...allCars];

        if (searchQuery) {
            filteredCars = filteredCars.filter(car =>
                car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.location) {
            filteredCars = filteredCars.filter(car =>
                car.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.fuel_type) {
            filteredCars = filteredCars.filter(car => car.fuel_type === filters.fuel_type);
        }

        if (filters.transmission) {
            filteredCars = filteredCars.filter(car => car.transmission === filters.transmission);
        }

        if (filters.condition) {
            filteredCars = filteredCars.filter(car => car.condition === filters.condition);
        }

        if (filters.minPrice) {
            filteredCars = filteredCars.filter(car => car.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            filteredCars = filteredCars.filter(car => car.price <= parseFloat(filters.maxPrice));
        }

        setCars(filteredCars);
    }, [searchQuery, filters, allCars]);

    const handleBack = () => {
        navigate(-1);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            fuel_type: '',
            transmission: '',
            condition: '',
            minPrice: '',
            maxPrice: '',
        });
        setSearchQuery('');
    };

    const hasActiveFilters = filters.location || filters.fuel_type || filters.transmission || filters.condition || filters.minPrice || filters.maxPrice;

    return (
        <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6">
                <button
                    onClick={handleBack}
                    className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                    aria-label="Back"
                >
                    <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {language === 'ku' ? 'ئۆتۆمبێل بۆ فرۆشتن' : language === 'ar' ? 'سيارات للبيع' : 'Cars for Sale'}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        {language === 'ku' 
                            ? `${cars.length} ئۆتۆمبێل دۆزرایەوە`
                            : language === 'ar'
                            ? `${cars.length} سيارة متاحة`
                            : `${cars.length} cars found`
                        }
                    </p>
                </div>
                <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span className="font-bold text-sm">
                        {language === 'ku' ? 'زیادکردنی ئۆتۆمبێل' : language === 'ar' ? 'إضافة سيارة' : 'Add Car'}
                    </span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'ku' ? 'گەڕان بە دوای ئۆتۆمبێل...' : language === 'ar' ? 'البحث عن سيارة...' : 'Search for cars...'}
                        className="w-full h-14 pr-14 pl-5 rounded-2xl bg-white border-2 border-slate-200 shadow-lg shadow-slate-200/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-right placeholder:text-slate-400 text-slate-700 font-medium"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-400">
                        <Search size={22} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Filter Button */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        showFilters || hasActiveFilters
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    <Filter size={18} strokeWidth={2.5} />
                    {language === 'ku' ? 'فلتەر' : language === 'ar' ? 'تصفية' : 'Filter'}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-semibold text-sm transition-all"
                    >
                        <X size={16} />
                        {language === 'ku' ? 'پاککردنەوە' : language === 'ar' ? 'مسح' : 'Clear'}
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'شوێن' : language === 'ar' ? 'الموقع' : 'Location'}
                            </label>
                            <input
                                type="text"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                placeholder={language === 'ku' ? 'وەک: London' : language === 'ar' ? 'مثل: London' : 'e.g.: London'}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'جۆری سووتەمەنی' : language === 'ar' ? 'نوع الوقود' : 'Fuel Type'}
                            </label>
                            <select
                                value={filters.fuel_type}
                                onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="petrol">{language === 'ku' ? 'بەنزین' : language === 'ar' ? 'بنزين' : 'Petrol'}</option>
                                <option value="diesel">{language === 'ku' ? 'دیزڵ' : language === 'ar' ? 'ديزل' : 'Diesel'}</option>
                                <option value="electric">{language === 'ku' ? 'کارەبایی' : language === 'ar' ? 'كهربائي' : 'Electric'}</option>
                                <option value="hybrid">{language === 'ku' ? 'هايبرید' : language === 'ar' ? 'هجين' : 'Hybrid'}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'جۆری بۆکس' : language === 'ar' ? 'نوع ناقل الحركة' : 'Transmission'}
                            </label>
                            <select
                                value={filters.transmission}
                                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="manual">{language === 'ku' ? 'دەستی' : language === 'ar' ? 'يدوي' : 'Manual'}</option>
                                <option value="automatic">{language === 'ku' ? 'ئۆتۆماتیک' : language === 'ar' ? 'أوتوماتيكي' : 'Automatic'}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'دۆخ' : language === 'ar' ? 'الحالة' : 'Condition'}
                            </label>
                            <select
                                value={filters.condition}
                                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none text-slate-700"
                            >
                                <option value="">{language === 'ku' ? 'هەموو' : language === 'ar' ? 'الكل' : 'All'}</option>
                                <option value="new">{language === 'ku' ? 'نوێ' : language === 'ar' ? 'جديد' : 'New'}</option>
                                <option value="used">{language === 'ku' ? 'بەکارهاتوو' : language === 'ar' ? 'مستعمل' : 'Used'}</option>
                                <option value="certified-pre-owned">{language === 'ku' ? 'پشتڕاستکراوە' : language === 'ar' ? 'معتمد' : 'Certified Pre-owned'}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'کەمترین نرخ' : language === 'ar' ? 'أقل سعر' : 'Min Price'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                placeholder="0"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {language === 'ku' ? 'زۆرترین نرخ' : language === 'ar' ? 'أعلى سعر' : 'Max Price'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                placeholder="100000"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none text-slate-700"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Cars List */}
            {!loading && (
                <div className="space-y-4">
                    {cars.length === 0 ? (
                        <div className="text-center py-12 text-slate-600">
                            <p className="font-semibold text-lg mb-2">
                                {language === 'ku' ? 'هیچ ئۆتۆمبێلێک نەدۆزرایەوە' : language === 'ar' ? 'لم يتم العثور على سيارات' : 'No cars found'}
                            </p>
                            <p className="text-sm">
                                {language === 'ku' 
                                    ? 'تکایە فلتەرەکان بگۆڕە یان گەڕان بکە'
                                    : language === 'ar'
                                    ? 'يرجى تغيير المرشحات أو البحث'
                                    : 'Please change filters or search'
                                }
                            </p>
                        </div>
                    ) : (
                        cars.map((car) => (
                            <div
                                key={car.id}
                                onClick={() => navigate(`/cars/${car.id}`)}
                                className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 border border-slate-100 hover:shadow-lg hover:shadow-black/10 hover:border-orange-200/50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CarIcon size={32} className="text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                {car.make} {car.model}
                                            </h3>
                                            {car.year && (
                                                <span className="text-sm text-slate-500">({car.year})</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <DollarSign size={16} />
                                                <span className="text-sm font-bold text-green-600">£{car.price.toLocaleString()}</span>
                                            </div>
                                            {car.location && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{car.location}</span>
                                                </div>
                                            )}
                                            {car.mileage && (
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Gauge size={16} />
                                                    <span className="text-sm">{car.mileage.toLocaleString()} mi</span>
                                                </div>
                                            )}
                                        </div>

                                        {car.description && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {car.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {car.fuel_type && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                    {car.fuel_type}
                                                </span>
                                            )}
                                            {car.transmission && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                                                    {car.transmission}
                                                </span>
                                            )}
                                            {car.condition && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                    {car.condition}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-sm">
                                        {car.contact_phone && (
                                            <a
                                                href={`tel:${car.contact_phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Phone size={16} />
                                                <span>{car.contact_phone}</span>
                                            </a>
                                        )}
                                        {car.contact_email && (
                                            <a
                                                href={`mailto:${car.contact_email}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Mail size={16} />
                                                <span>{car.contact_email}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Car Submission Form Modal */}
            {showSubmissionForm && (
                <CarSubmissionForm
                    onClose={() => setShowSubmissionForm(false)}
                    onSuccess={() => {
                        setShowSubmissionForm(false);
                        loadCars();
                    }}
                />
            )}
        </div>
    );
};

export default CarsList;
