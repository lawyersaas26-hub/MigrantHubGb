import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResourceByIdAdmin, createResource, updateResource, getAllCategories, type Resource, type CategoryData } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, Save } from 'lucide-react';

const AdminResourceForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        category_id: 'healthcare',
        language: 'ku' as 'ku' | 'ar' | 'en',
        title: '',
        slug: '',
        html_content: '',
        description: '',
        external_link: '',
        phone: '',
        email: '',
        source: '',
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
            loadResource();
        }
    }, [id]);

    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await getAllCategories();
            // Filter to only active categories for dropdown
            const activeCategories = data.filter(cat => cat.is_active);
            setCategories(activeCategories);
            
            // Set default category_id to first active category if none selected
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

    const loadResource = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const resource = await getResourceByIdAdmin(id);
            if (resource) {
                setFormData({
                    category_id: resource.category_id,
                    language: resource.language,
                    title: resource.title,
                    slug: resource.slug || '',
                    html_content: resource.html_content,
                    description: resource.description || '',
                    external_link: resource.external_link || '',
                    phone: resource.phone || '',
                    email: resource.email || '',
                    source: resource.source || '',
                    display_order: resource.display_order,
                    is_active: resource.is_active,
                });
            }
        } catch (error) {
            console.error('Error loading resource:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (isEdit && id) {
                await updateResource(id, formData);
            } else {
                await createResource(formData);
            }
            navigate('/admin/dashboard');
        } catch (error: any) {
            alert(error.message || 'Failed to save resource');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEdit ? 'Edit Resource' : 'New Resource'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                        {loadingCategories ? (
                            <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-slate-600">Loading categories...</span>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-yellow-50">
                                <p className="text-sm text-yellow-700">No active categories found. <a href="/admin/categories/new" className="text-indigo-600 hover:underline">Create one first</a>.</p>
                            </div>
                        ) : (
                            <select
                                value={formData.category_id}
                                onChange={(e) => handleChange('category_id', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name_ku} / {cat.name_ar} ({cat.id})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                        <select
                            value={formData.language}
                            onChange={(e) => handleChange('language', e.target.value as 'ku' | 'ar' | 'en')}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="ku">Kurdish (ku)</option>
                            <option value="ar">Arabic (ar)</option>
                            <option value="en">English (en)</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            maxLength={500}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Slug (URL-friendly identifier)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleChange('slug', e.target.value)}
                            maxLength={500}
                            placeholder="e.g., how-to-register-with-gp"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* HTML Content */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">HTML Content</label>
                        <textarea
                            value={formData.html_content}
                            onChange={(e) => handleChange('html_content', e.target.value)}
                            required
                            rows={20}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="<div>Your HTML content here...</div>"
                        />
                        <p className="mt-2 text-xs text-slate-500">Enter the full HTML content for this resource</p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                maxLength={50}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                maxLength={255}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* External Link & Source */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">External Link</label>
                            <input
                                type="url"
                                value={formData.external_link}
                                onChange={(e) => handleChange('external_link', e.target.value)}
                                maxLength={1000}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Source</label>
                            <input
                                type="text"
                                value={formData.source}
                                onChange={(e) => handleChange('source', e.target.value)}
                                maxLength={255}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Display Order & Active */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Display Order</label>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleChange('is_active', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Active</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminResourceForm;

