import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDrivingInstructorByIdAdmin, createDrivingInstructor, updateDrivingInstructor, type DrivingInstructor } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, Save } from 'lucide-react';

const AdminDrivingInstructorForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        location: '',
        postcode: '',
        languages_spoken: [] as string[],
        experience_years: 0,
        rating: 0,
        total_reviews: 0,
        price_per_hour: null as number | null,
        vehicle_type: '',
        availability: '',
        bio: '',
        specialties: [] as string[],
        is_active: true,
        is_verified: false,
        display_order: 0,
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        checkAuth();
        if (isEdit) {
            loadInstructor();
        }
    }, [id]);

    const checkAuth = async () => {
        const admin = await isAdmin();
        if (!admin) {
            navigate('/admin/login');
        }
    };

    const loadInstructor = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const instructor = await getDrivingInstructorByIdAdmin(id);
            if (instructor) {
                setFormData({
                    name: instructor.name,
                    phone: instructor.phone,
                    email: instructor.email || '',
                    location: instructor.location,
                    postcode: instructor.postcode || '',
                    languages_spoken: instructor.languages_spoken || [],
                    experience_years: instructor.experience_years || 0,
                    rating: instructor.rating || 0,
                    total_reviews: instructor.total_reviews || 0,
                    price_per_hour: instructor.price_per_hour,
                    vehicle_type: instructor.vehicle_type || '',
                    availability: instructor.availability || '',
                    bio: instructor.bio || '',
                    specialties: instructor.specialties || [],
                    is_active: instructor.is_active,
                    is_verified: instructor.is_verified,
                    display_order: instructor.display_order || 0,
                });
            }
        } catch (error) {
            console.error('Error loading instructor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit && id) {
                await updateDrivingInstructor(id, formData);
            } else {
                await createDrivingInstructor(formData);
            }
            navigate('/admin/driving-instructors');
        } catch (error: any) {
            alert(error.message || 'Failed to save instructor');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'languages_spoken' | 'specialties', value: string, checked: boolean) => {
        setFormData(prev => {
            const currentArray = prev[field] || [];
            if (checked) {
                return { ...prev, [field]: [...currentArray, value] };
            } else {
                return { ...prev, [field]: currentArray.filter(item => item !== value) };
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/driving-instructors')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEdit ? 'Edit Instructor' : 'New Instructor'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="border-b border-slate-200 pb-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    required
                                    placeholder="e.g., London, Manchester"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Postcode</label>
                                <input
                                    type="text"
                                    value={formData.postcode}
                                    onChange={(e) => handleChange('postcode', e.target.value)}
                                    placeholder="e.g., SW1A 1AA"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Languages Spoken */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Languages Spoken</label>
                        <div className="flex flex-wrap gap-4">
                            {['ku', 'ar', 'en'].map(lang => (
                                <label key={lang} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.languages_spoken.includes(lang)}
                                        onChange={(e) => handleArrayChange('languages_spoken', lang, e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-700">
                                        {lang === 'ku' ? 'Kurdish' : lang === 'ar' ? 'Arabic' : 'English'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Experience & Rating */}
                    <div className="border-b border-slate-200 pb-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Experience & Rating</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience (Years)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience_years}
                                    onChange={(e) => handleChange('experience_years', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Rating (0-5)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Reviews</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.total_reviews}
                                    onChange={(e) => handleChange('total_reviews', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Vehicle */}
                    <div className="border-b border-slate-200 pb-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing & Vehicle</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Hour (GBP)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price_per_hour || ''}
                                    onChange={(e) => handleChange('price_per_hour', e.target.value ? parseFloat(e.target.value) : null)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                                <select
                                    value={formData.vehicle_type}
                                    onChange={(e) => handleChange('vehicle_type', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select...</option>
                                    <option value="manual">Manual</option>
                                    <option value="automatic">Automatic</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Availability</label>
                                <select
                                    value={formData.availability}
                                    onChange={(e) => handleChange('availability', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select...</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="weekends-only">Weekends Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / Description</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter instructor bio or description..."
                        />
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Specialties</label>
                        <div className="flex flex-wrap gap-4">
                            {['beginner', 'advanced', 'test-prep', 'refresher', 'nervous-learners', 'intensive'].map(specialty => (
                                <label key={specialty} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.specialties.includes(specialty)}
                                        onChange={(e) => handleArrayChange('specialties', specialty, e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-700 capitalize">{specialty.replace('-', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="border-t border-slate-200 pt-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Status</h2>
                        
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleChange('is_active', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Active (visible in app)</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_verified}
                                    onChange={(e) => handleChange('is_verified', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Verified (show verified badge)</span>
                            </label>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Display Order</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.display_order}
                                    onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : isEdit ? 'Update Instructor' : 'Create Instructor'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/driving-instructors')}
                            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDrivingInstructorForm;

