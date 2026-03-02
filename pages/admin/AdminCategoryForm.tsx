import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory, type CategoryData } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, Save } from 'lucide-react';
import { getAvailableIcons, getIconByName } from '../../utils/iconMapper';

const COLOR_OPTIONS = [
    'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-rose-600',
    'bg-red-600', 'bg-orange-600', 'bg-amber-600', 'bg-yellow-600', 'bg-lime-600',
    'bg-green-600', 'bg-emerald-600', 'bg-teal-600', 'bg-cyan-600', 'bg-sky-600'
];

const AdminCategoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        id: '',
        name_ku: '',
        name_ar: '',
        name_en: '',
        color: 'bg-indigo-600',
        icon_name: 'FileText',
        display_order: 0,
        is_active: true,
        description_ku: '',
        description_ar: '',
        description_en: '',
        topics_section_title_ku: '',
        topics_section_title_ar: '',
        topics_section_title_en: '',
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const availableIcons = getAvailableIcons();

    useEffect(() => {
        checkAuth();
        if (isEdit) {
            loadCategory();
        }
    }, [id]);

    const checkAuth = async () => {
        const admin = await isAdmin();
        if (!admin) {
            navigate('/admin/login');
        }
    };

    const loadCategory = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const category = await getCategoryById(id);
            if (category) {
                setFormData({
                    id: category.id,
                    name_ku: category.name_ku,
                    name_ar: category.name_ar,
                    name_en: category.name_en || '',
                    color: category.color,
                    icon_name: category.icon_name,
                    display_order: category.display_order,
                    is_active: category.is_active,
                    description_ku: category.description_ku || '',
                    description_ar: category.description_ar || '',
                    description_en: category.description_en || '',
                    topics_section_title_ku: category.topics_section_title_ku || '',
                    topics_section_title_ar: category.topics_section_title_ar || '',
                    topics_section_title_en: category.topics_section_title_en || '',
                });
            }
        } catch (error) {
            console.error('Error loading category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (isEdit && id) {
                const { id: _, ...updates } = formData;
                await updateCategory(id, updates);
            } else {
                const { id: categoryId, ...categoryData } = formData;
                if (!categoryId) {
                    alert('Category ID is required');
                    setSaving(false);
                    return;
                }
                await createCategory({
                    ...categoryData,
                    id: categoryId,
                    name_en: categoryData.name_en || null,
                    description_ku: categoryData.description_ku || null,
                    description_ar: categoryData.description_ar || null,
                    description_en: categoryData.description_en || null,
                    topics_section_title_ku: categoryData.topics_section_title_ku || null,
                    topics_section_title_ar: categoryData.topics_section_title_ar || null,
                    topics_section_title_en: categoryData.topics_section_title_en || null,
                } as CategoryData);
            }
            navigate('/admin/categories');
        } catch (error: any) {
            alert(error.message || 'Failed to save category');
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

    const Icon = getIconByName(formData.icon_name);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/categories')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEdit ? 'Edit Category' : 'New Category'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Category ID (only for new categories) */}
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => handleChange('id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                required
                                placeholder="e.g., transportation"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-slate-500">Lowercase letters, numbers, and hyphens only. Cannot be changed after creation.</p>
                        </div>
                    )}

                    {/* Names */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Kurdish Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name_ku}
                                onChange={(e) => handleChange('name_ku', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Arabic Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name_ar}
                                onChange={(e) => handleChange('name_ar', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                English Name
                            </label>
                            <input
                                type="text"
                                value={formData.name_en}
                                onChange={(e) => handleChange('name_en', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Icon and Color Preview */}
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm font-semibold text-slate-700">Preview:</div>
                        <div className={`w-16 h-16 ${formData.color} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon size={32} color="white" />
                        </div>
                        <div>
                            <div className="font-medium text-slate-900">{formData.name_ku || 'Category Name'}</div>
                            <div className="text-xs text-slate-500">{formData.id || 'category-id'}</div>
                        </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Icon <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.icon_name}
                            onChange={(e) => handleChange('icon_name', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {availableIcons.map(iconName => (
                                <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 mb-3">
                            Color <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {COLOR_OPTIONS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleChange('color', color)}
                                    className={`h-12 rounded-lg border-2 transition-all ${
                                        formData.color === color
                                            ? 'border-indigo-600 ring-2 ring-indigo-200'
                                            : 'border-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <div className={`w-full h-full ${color} rounded-lg`}></div>
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={formData.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                            className="mt-3 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                            placeholder="or enter custom Tailwind class"
                        />
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

                    {/* Descriptions */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Kurdish)</label>
                            <textarea
                                value={formData.description_ku}
                                onChange={(e) => handleChange('description_ku', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Arabic)</label>
                            <textarea
                                value={formData.description_ar}
                                onChange={(e) => handleChange('description_ar', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (English)</label>
                            <textarea
                                value={formData.description_en}
                                onChange={(e) => handleChange('description_en', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Topics Section Titles */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Topics Section Titles</h3>
                        <p className="text-sm text-slate-600">Customize the section title that appears above topics list (e.g., "Settling in the UK"). Leave empty to use default "بابەتەکان" / "المواضيع"</p>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Topics Section Title (Kurdish)</label>
                            <input
                                type="text"
                                value={formData.topics_section_title_ku}
                                onChange={(e) => handleChange('topics_section_title_ku', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Settling in the UK (in Kurdish)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Topics Section Title (Arabic)</label>
                            <input
                                type="text"
                                value={formData.topics_section_title_ar}
                                onChange={(e) => handleChange('topics_section_title_ar', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Settling in the UK (in Arabic)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Topics Section Title (English)</label>
                            <input
                                type="text"
                                value={formData.topics_section_title_en}
                                onChange={(e) => handleChange('topics_section_title_en', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Settling in the UK"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/categories')}
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
                            {saving ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCategoryForm;

