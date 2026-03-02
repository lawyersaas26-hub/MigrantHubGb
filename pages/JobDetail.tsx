import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MapPin, Building, Clock, DollarSign, Mail, Phone, ExternalLink, Calendar } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { getJobById, type Job } from '../lib/supabase';
import { openLink } from '../utils/browser';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadJob();
        }
    }, [id]);

    const loadJob = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const jobData = await getJobById(id);
            if (jobData && jobData.is_active) {
                setJob(jobData);
            } else {
                // Job not found or not active
                navigate('/jobs', { replace: true });
            }
        } catch (error) {
            console.error('Error loading job:', error);
            navigate('/jobs', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleApply = async () => {
        if (!job) return;
        
        if (job.apply_url) {
            await openLink(job.apply_url, job.title);
        } else if (job.apply_email) {
            window.location.href = `mailto:${job.apply_email}?subject=Application for ${job.title}`;
        }
    };

    const jobTypeNames: Record<string, string> = {
        'full-time': language === 'ku' ? 'کاتێکی تەواو' : language === 'ar' ? 'دوام كامل' : 'Full-time',
        'part-time': language === 'ku' ? 'کاتێکی بەشێک' : language === 'ar' ? 'دوام جزئي' : 'Part-time',
        'contract': language === 'ku' ? 'گرێبەست' : language === 'ar' ? 'عقد' : 'Contract',
        'temporary': language === 'ku' ? 'کاتی' : language === 'ar' ? 'مؤقت' : 'Temporary',
    };

    const categoryNames: Record<string, string> = {
        'retail': language === 'ku' ? 'فرۆشگا' : language === 'ar' ? 'بيع بالتجزئة' : 'Retail',
        'warehouse': language === 'ku' ? 'کۆگا' : language === 'ar' ? 'مستودع' : 'Warehouse',
        'hospitality': language === 'ku' ? 'خواردن' : language === 'ar' ? 'ضيافة' : 'Hospitality',
        'cleaning': language === 'ku' ? 'پاککردنەوە' : language === 'ar' ? 'تنظيف' : 'Cleaning',
        'security': language === 'ku' ? 'ئاسایش' : language === 'ar' ? 'أمن' : 'Security',
        'office': language === 'ku' ? 'ئۆفیس' : language === 'ar' ? 'مكتب' : 'Office',
        'other': language === 'ku' ? 'ئەویتر' : language === 'ar' ? 'أخرى' : 'Other',
    };

    if (loading) {
        return (
            <div className="px-5 pb-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">
                            {language === 'ku' ? 'بارکردن...' : language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return null;
    }

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
                        {language === 'ku' ? 'وردەکاریەکانی کار' : language === 'ar' ? 'تفاصيل الوظيفة' : 'Job Details'}
                    </h1>
                </div>
            </div>

            {/* Job Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-slate-100 mb-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {job.title}
                </h2>

                {/* Company and Location */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-700">
                        <Building size={20} className="text-slate-500" />
                        <span className="font-semibold">{job.company}</span>
                    </div>
                    {job.location && (
                        <div className="flex items-center gap-2 text-slate-700">
                            <MapPin size={20} className="text-slate-500" />
                            <span>{job.location}</span>
                        </div>
                    )}
                </div>

                {/* Job Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {job.type && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <Clock size={18} className="text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">
                                    {language === 'ku' ? 'جۆری کار' : language === 'ar' ? 'نوع الوظيفة' : 'Job Type'}
                                </p>
                                <p className="font-semibold text-slate-900 text-sm">
                                    {jobTypeNames[job.type] || job.type}
                                </p>
                            </div>
                        </div>
                    )}
                    {job.salary && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                            <DollarSign size={18} className="text-green-600" />
                            <div>
                                <p className="text-xs text-green-600 mb-0.5">
                                    {language === 'ku' ? 'مووچە' : language === 'ar' ? 'الراتب' : 'Salary'}
                                </p>
                                <p className="font-semibold text-green-700 text-sm">
                                    {job.salary}
                                </p>
                            </div>
                        </div>
                    )}
                    {job.category && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                            <Building size={18} className="text-blue-600" />
                            <div>
                                <p className="text-xs text-blue-600 mb-0.5">
                                    {language === 'ku' ? 'بەش' : language === 'ar' ? 'الفئة' : 'Category'}
                                </p>
                                <p className="font-semibold text-blue-700 text-sm">
                                    {categoryNames[job.category] || job.category}
                                </p>
                            </div>
                        </div>
                    )}
                    {job.posted_date && (
                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                            <Calendar size={18} className="text-purple-600" />
                            <div>
                                <p className="text-xs text-purple-600 mb-0.5">
                                    {language === 'ku' ? 'بڵاوکراوە' : language === 'ar' ? 'تاريخ النشر' : 'Posted'}
                                </p>
                                <p className="font-semibold text-purple-700 text-sm">
                                    {new Date(job.posted_date).toLocaleDateString(language === 'ku' ? 'ku' : language === 'ar' ? 'ar' : 'en-GB')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {job.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                            {language === 'ku' ? 'وەسف' : language === 'ar' ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </p>
                    </div>
                )}

                {/* Requirements */}
                {job.requirements && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                            {language === 'ku' ? 'پێویستیەکان' : language === 'ar' ? 'المتطلبات' : 'Requirements'}
                        </h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {job.requirements}
                        </p>
                    </div>
                )}

                {/* Contact Information */}
                {(job.contact_phone || job.apply_email) && (
                    <div className="mb-6 pt-6 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                            {language === 'ku' ? 'زانیاری پەیوەندی' : language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                        </h3>
                        <div className="space-y-2">
                            {job.contact_phone && (
                                <a
                                    href={`tel:${job.contact_phone}`}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    <Phone size={18} />
                                    <span>{job.contact_phone}</span>
                                </a>
                            )}
                            {job.apply_email && (
                                <a
                                    href={`mailto:${job.apply_email}`}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    <Mail size={18} />
                                    <span>{job.apply_email}</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Apply Button */}
                {(job.apply_url || job.apply_email) && (
                    <div className="pt-6 border-t border-slate-200">
                        <button
                            onClick={handleApply}
                            className="w-full px-6 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-500/25"
                        >
                            <span>
                                {language === 'ku' 
                                    ? 'داوای کار' 
                                    : language === 'ar'
                                    ? 'التقدم للوظيفة'
                                    : 'Apply for Job'
                                }
                            </span>
                            <ExternalLink size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetail;











