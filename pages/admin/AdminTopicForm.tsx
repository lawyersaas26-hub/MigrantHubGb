import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getTopicByIdAdmin, createTopic, updateTopic, getAllCategories, type Topic, type CategoryData } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, Save } from 'lucide-react';

const AdminTopicForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const defaultCategory = searchParams.get('category') || '';

    const [formData, setFormData] = useState({
        category_id: defaultCategory,
        title_ku: '',
        title_ar: '',
        title_en: '',
        description_ku: '',
        description_ar: '',
        description_en: '',
        slug: '',
        display_order: 0,
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        checkAuth();
        loadCategories();
        if (isEdit) {
            loadTopic();
        }
    }, [id]);

    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await getAllCategories();
            const activeCategories = data.filter(cat => cat.is_active);
            setCategories(activeCategories);
            
            if (!isEdit && activeCategories.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: activeCategories[0].id }));
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const checkAuth = async () => {
        const admin = await isAdmin();
        if (!admin) {
            navigate('/admin/login');
        }
    };

    const loadTopic = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const topic = await getTopicByIdAdmin(id);
            if (topic) {
                setFormData({
                    category_id: topic.category_id,
                    title_ku: topic.title_ku,
                    title_ar: topic.title_ar,
                    title_en: topic.title_en || '',
                    description_ku: topic.description_ku || '',
                    description_ar: topic.description_ar || '',
                    description_en: topic.description_en || '',
                    slug: topic.slug,
                    display_order: topic.display_order || 0,
                    is_active: topic.is_active,
                });
            }
        } catch (error) {
            console.error('Error loading topic:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit && id) {
                await updateTopic(id, formData);
            } else {
                await createTopic(formData);
            }
            navigate('/admin/topics');
        } catch (error: any) {
            alert(error.message || 'Failed to save topic');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Auto-generate slug from title
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
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
                            onClick={() => navigate('/admin/topics')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEdit ? 'Edit Topic' : 'New Topic'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                        {loadingCategories ? (
                            <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-slate-600">Loading categories...</span>
                            </div>
                        ) : (
                            <select
                                value={formData.category_id}
                                onChange={(e) => handleChange('category_id', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name_ku} / {cat.name_ar} ({cat.id})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Title Kurdish */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Title (Kurdish) *</label>
                        <input
                            type="text"
                            value={formData.title_ku}
                            onChange={(e) => {
                                handleChange('title_ku', e.target.value);
                                if (!isEdit && !formData.slug) {
                                    handleChange('slug', generateSlug(e.target.value));
                                }
                            }}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Title Arabic */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Title (Arabic) *</label>
                        <input
                            type="text"
                            value={formData.title_ar}
                            onChange={(e) => handleChange('title_ar', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Title English */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Title (English)</label>
                        <input
                            type="text"
                            value={formData.title_en}
                            onChange={(e) => handleChange('title_en', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleChange('slug', generateSlug(e.target.value))}
                            required
                            placeholder="e.g., settling-in-the-uk"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-slate-500">URL-friendly identifier (auto-generated from title)</p>
                    </div>

                    {/* Description Kurdish */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Kurdish)</label>
                        <textarea
                            value={formData.description_ku}
                            onChange={(e) => handleChange('description_ku', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description Arabic */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Arabic)</label>
                        <textarea
                            value={formData.description_ar}
                            onChange={(e) => handleChange('description_ar', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description English */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description (English)</label>
                        <textarea
                            value={formData.description_en}
                            onChange={(e) => handleChange('description_en', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Display Order */}
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

                    {/* Is Active */}
                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => handleChange('is_active', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm font-semibold text-slate-700">Active (visible in app)</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : isEdit ? 'Update Topic' : 'Create Topic'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/topics')}
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

export default AdminTopicForm;


