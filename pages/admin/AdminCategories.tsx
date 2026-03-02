import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, deleteCategory, type CategoryData } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAuth';
import { Plus, Edit, Trash2, Eye, EyeOff, FolderTree } from 'lucide-react';
import { getIconByName } from '../../utils/iconMapper';

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const admin = await isAdmin();
        if (!admin) {
            navigate('/admin/login');
            return;
        }
        loadCategories();
    };

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? This will not delete associated resources, but they will be orphaned.')) return;
        
        try {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            alert('Failed to delete category');
        }
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <FolderTree size={28} />
                                Categories
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">Manage content categories</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/admin/categories/new')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={20} />
                                New Category
                            </button>
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">All Categories ({categories.length})</h2>
                    </div>
                    
                    {categories.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-600 mb-4">No categories found.</p>
                            <button
                                onClick={() => navigate('/admin/categories/new')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={20} />
                                Create Your First Category
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Icon</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Kurdish Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Arabic Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Color</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {categories.map((category) => {
                                        const Icon = getIconByName(category.icon_name);
                                        return (
                                            <tr key={category.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                                                        <Icon size={20} color="white" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{category.id}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{category.name_ku}</td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{category.name_ar}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 ${category.color} rounded border border-slate-300`}></div>
                                                        <span className="text-xs text-slate-600">{category.color}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{category.display_order}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                                        category.is_active 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {category.is_active ? (
                                                            <>
                                                                <Eye size={12} />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff size={12} />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;

