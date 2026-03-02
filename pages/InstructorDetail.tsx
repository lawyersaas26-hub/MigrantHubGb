import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Phone, Mail, MapPin, Star, CheckCircle, Clock, Car, Languages } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getDrivingInstructorById, getInstructorReviews, submitInstructorReview, type DrivingInstructor, type InstructorReview } from '../lib/supabase';
import { openLink } from '../utils/browser';

const InstructorDetail: React.FC = () => {
    const { instructorId } = useParams<{ instructorId: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [instructor, setInstructor] = useState<DrivingInstructor | null>(null);
    const [reviews, setReviews] = useState<InstructorReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        reviewer_name: '',
        rating: 5,
        review_text: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!instructorId) return;
            
            setLoading(true);
            setLoadingReviews(true);
            try {
                const [instructorData, reviewsData] = await Promise.all([
                    getDrivingInstructorById(instructorId),
                    getInstructorReviews(instructorId),
                ]);
                setInstructor(instructorData);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                setLoadingReviews(false);
            }
        };

        fetchData();
    }, [instructorId]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!instructorId || !reviewForm.reviewer_name.trim()) return;

        setSubmittingReview(true);
        try {
            await submitInstructorReview({
                instructor_id: instructorId,
                reviewer_name: reviewForm.reviewer_name.trim(),
                rating: reviewForm.rating,
                review_text: reviewForm.review_text.trim() || undefined,
            });
            
            // Refresh reviews and instructor data
            const [updatedInstructor, updatedReviews] = await Promise.all([
                getDrivingInstructorById(instructorId),
                getInstructorReviews(instructorId),
            ]);
            setInstructor(updatedInstructor);
            setReviews(updatedReviews);
            
            // Reset form
            setReviewForm({
                reviewer_name: '',
                rating: 5,
                review_text: '',
            });
            setShowReviewForm(false);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(language === 'ku' ? 'هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەوە.' : 'حدث خطأ. يرجى المحاولة مرة أخرى.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handlePhoneClick = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const handleEmailClick = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">
                        {language === 'ku' ? 'بارکردن...' : 'جارٍ التحميل...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center p-5">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-slate-700 font-semibold mb-2">
                        {language === 'ku' ? 'مامۆستاکە نەدۆزرایەوە' : 'المدرس غير موجود'}
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        {language === 'ku' ? 'گەڕانەوە' : 'رجوع'}
                    </button>
                </div>
            </div>
        );
    }

    const langNames: Record<string, string> = {
        ku: language === 'ku' ? 'کوردی' : 'الكردية',
        ar: language === 'ku' ? 'عەرەبی' : 'العربية',
        en: language === 'ku' ? 'ئینگلیزی' : 'الإنجليزية',
    };

    const vehicleTypeNames: Record<string, string> = {
        manual: language === 'ku' ? 'دەستی' : 'يدوي',
        automatic: language === 'ku' ? 'ئۆتۆماتیک' : 'أوتوماتيكي',
        both: language === 'ku' ? 'هەردووکیان' : 'كلاهما',
    };

    const availabilityNames: Record<string, string> = {
        'full-time': language === 'ku' ? 'کاتێکی تەواو' : 'دوام كامل',
        'part-time': language === 'ku' ? 'کاتێکی بەشێک' : 'دوام جزئي',
        'weekends-only': language === 'ku' ? 'تەنها کۆتایی هەفتە' : 'عطلات نهاية الأسبوع فقط',
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-8">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 px-5 py-4">
                    <button
                        onClick={handleBack}
                        className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all duration-200 active:scale-95"
                        aria-label="Back"
                    >
                        <BackIcon size={22} className="text-slate-700" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight flex-1 line-clamp-2">
                        {instructor.name}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 pt-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {instructor.name}
                                </h2>
                                {instructor.is_verified && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                                        <CheckCircle size={16} />
                                        <span className="text-xs font-semibold">
                                            {language === 'ku' ? 'پشتڕاستکراوە' : 'موثق'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {instructor.rating > 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                className={i < Math.floor(instructor.rating) 
                                                    ? 'text-yellow-500 fill-yellow-500' 
                                                    : 'text-slate-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-bold text-slate-700">
                                        {instructor.rating.toFixed(1)}
                                    </span>
                                    {instructor.total_reviews > 0 && (
                                        <span className="text-sm text-slate-500">
                                            ({instructor.total_reviews} {language === 'ku' ? 'پێداچوونەوە' : 'مراجعة'})
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {instructor.bio && (
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {instructor.bio}
                        </p>
                    )}

                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                        {instructor.experience_years > 0 && (
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-indigo-600" />
                                <div>
                                    <p className="text-xs text-slate-500">
                                        {language === 'ku' ? 'ئەزموون' : 'الخبرة'}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {instructor.experience_years} {language === 'ku' ? 'ساڵ' : 'سنة'}
                                    </p>
                                </div>
                            </div>
                        )}
                        {instructor.price_per_hour && (
                            <div className="flex items-center gap-2">
                                <span className="text-lg">💰</span>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        {language === 'ku' ? 'نرخ' : 'السعر'}
                                    </p>
                                    <p className="text-sm font-bold text-indigo-600">
                                        £{instructor.price_per_hour}/hr
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                        {language === 'ku' ? 'زانیاری پەیوەندی' : 'معلومات الاتصال'}
                    </h3>
                    <div className="space-y-3">
                        {instructor.phone && (
                            <button
                                onClick={() => handlePhoneClick(instructor.phone)}
                                className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all active:scale-95"
                            >
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                    <Phone size={24} color="white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-xs text-slate-500 mb-1">
                                        {language === 'ku' ? 'تەلەفۆن' : 'الهاتف'}
                                    </p>
                                    <p className="font-bold text-slate-900">{instructor.phone}</p>
                                </div>
                            </button>
                        )}
                        {instructor.email && (
                            <button
                                onClick={() => handleEmailClick(instructor.email!)}
                                className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                            >
                                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                                    <Mail size={24} color="white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-xs text-slate-500 mb-1">
                                        {language === 'ku' ? 'ئیمەیڵ' : 'البريد الإلكتروني'}
                                    </p>
                                    <p className="font-semibold text-slate-700">{instructor.email}</p>
                                </div>
                            </button>
                        )}
                        {instructor.location && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                                    <MapPin size={24} color="white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-xs text-slate-500 mb-1">
                                        {language === 'ku' ? 'شوێن' : 'الموقع'}
                                    </p>
                                    <p className="font-semibold text-slate-700">{instructor.location}</p>
                                    {instructor.postcode && (
                                        <p className="text-sm text-slate-500">{instructor.postcode}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                        {language === 'ku' ? 'زانیاری زیاتر' : 'معلومات إضافية'}
                    </h3>
                    <div className="space-y-4">
                        {instructor.vehicle_type && (
                            <div className="flex items-center gap-3">
                                <Car size={20} className="text-indigo-600" />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-1">
                                        {language === 'ku' ? 'جۆری ئۆتۆمبێل' : 'نوع السيارة'}
                                    </p>
                                    <p className="font-semibold text-slate-700">
                                        {vehicleTypeNames[instructor.vehicle_type] || instructor.vehicle_type}
                                    </p>
                                </div>
                            </div>
                        )}
                        {instructor.availability && (
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-indigo-600" />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-1">
                                        {language === 'ku' ? 'بەردەستی' : 'التوفر'}
                                    </p>
                                    <p className="font-semibold text-slate-700">
                                        {availabilityNames[instructor.availability] || instructor.availability}
                                    </p>
                                </div>
                            </div>
                        )}
                        {instructor.languages_spoken && instructor.languages_spoken.length > 0 && (
                            <div className="flex items-start gap-3">
                                <Languages size={20} className="text-indigo-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-2">
                                        {language === 'ku' ? 'زمانەکان' : 'اللغات'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {instructor.languages_spoken.map((lang) => (
                                            <span
                                                key={lang}
                                                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold"
                                            >
                                                {langNames[lang] || lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {instructor.specialties && instructor.specialties.length > 0 && (
                            <div className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-indigo-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-2">
                                        {language === 'ku' ? 'تایبەتمەندیەکان' : 'التخصصات'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {instructor.specialties.map((specialty) => (
                                            <span
                                                key={specialty}
                                                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                            {language === 'ku' ? 'پێداچوونەوەکان' : 'المراجعات'}
                            {reviews.length > 0 && (
                                <span className="text-sm font-normal text-slate-500">
                                    ({reviews.length})
                                </span>
                            )}
                        </h3>
                        {!showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                {language === 'ku' ? '+ پێداچوونەوە بنووسە' : '+ اكتب مراجعة'}
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-semibold text-slate-900 mb-4">
                                {language === 'ku' ? 'پێداچوونەوەیەک بنووسە' : 'اكتب مراجعة'}
                            </h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {language === 'ku' ? 'ناو' : 'الاسم'} *
                                    </label>
                                    <input
                                        type="text"
                                        value={reviewForm.reviewer_name}
                                        onChange={(e) => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder={language === 'ku' ? 'ناوی خۆت بنووسە' : 'أدخل اسمك'}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {language === 'ku' ? 'پێوانە' : 'التقييم'} *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => setReviewForm({ ...reviewForm, rating })}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={32}
                                                    className={rating <= reviewForm.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-slate-300'
                                                    }
                                                />
                                            </button>
                                        ))}
                                        <span className="text-sm font-semibold text-slate-700 mr-2">
                                            {reviewForm.rating} / 5
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {language === 'ku' ? 'پێداچوونەوە' : 'المراجعة'}
                                    </label>
                                    <textarea
                                        value={reviewForm.review_text}
                                        onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder={language === 'ku' ? 'پێداچوونەوەکەت بنووسە...' : 'اكتب مراجعتك...'}
                                    />
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submittingReview 
                                            ? (language === 'ku' ? 'نێردراوە...' : 'جارٍ الإرسال...')
                                            : (language === 'ku' ? 'ناردن' : 'إرسال')
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setReviewForm({
                                                reviewer_name: '',
                                                rating: 5,
                                                review_text: '',
                                            });
                                        }}
                                        className="px-6 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
                                    >
                                        {language === 'ku' ? 'هەڵوەشاندنەوە' : 'إلغاء'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Reviews List */}
                    {loadingReviews ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p className="text-sm">
                                {language === 'ku' 
                                    ? 'هیچ پێداچوونەوەیەک نەدۆزرایەوە. یەکەم کەس بن بیت!'
                                    : 'لا توجد مراجعات. كن أول من يكتب!'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-slate-900">
                                                    {review.reviewer_name}
                                                </h4>
                                                {review.is_verified && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                        {language === 'ku' ? 'پشتڕاست' : 'موثق'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < review.rating
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-slate-300'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(review.created_at).toLocaleDateString(language === 'ku' ? 'ku' : 'ar')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.review_text && (
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            {review.review_text}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorDetail;

