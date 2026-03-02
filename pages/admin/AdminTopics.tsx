import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllTopics, deleteTopic, getAllCategories, type Topic, type CategoryData } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, FolderTree, ArrowLeft } from 'lucide-react';

const AdminTopics: React.FC = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || '');
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadTopics();
        } else {
            loadTopics();
        }
    }, [selectedCategory]);

    const checkAuth = async () => {
        const adminUser = await isAdmin();
        if (!adminUser) {
            navigate('/admin/login');
            return;
        }
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
    };

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
            if (categoryId && !selectedCategory) {
                setSelectedCategory(categoryId);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadTopics = async () => {
        setLoading(true);
        try {
            const data = await getAllTopics(selectedCategory || undefined);
            setTopics(data);
        } catch (error) {
            console.error('Error loading topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this topic?')) return;
        
        try {
            await deleteTopic(id);
            setTopics(topics.filter(t => t.id !== id));
        } catch (error) {
            alert('Failed to delete topic');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
    };

    const getCategoryName = (catId: string) => {
        const cat = categories.find(c => c.id === catId);
        if (!cat) return catId;
        return `${cat.name_ku} / ${cat.name_ar}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Topics / Subcategories</h1>
                                <p className="text-sm text-slate-600">Manage topics and subcategories</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {admin && (
                                <span className="text-sm text-slate-600">Logged in as: {admin.email}</span>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/topics/new' + (selectedCategory ? `?category=${selectedCategory}` : ''))}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={20} />
                            New Topic
                        </button>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name_ku} / {cat.name_ar}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-600">Loading topics...</p>
                    </div>
                ) : topics.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <FolderTree size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600 mb-4">No topics found</p>
                        <button
                            onClick={() => navigate('/admin/topics/new' + (selectedCategory ? `?category=${selectedCategory}` : ''))}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Add First Topic
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Title (Kurdish)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Title (Arabic)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {topics.map((topic) => (
                                        <tr key={topic.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {getCategoryName(topic.category_id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900">{topic.title_ku}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900">{topic.title_ar}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {topic.slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {topic.is_active ? (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                        <Eye size={14} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">
                                                        <EyeOff size={14} />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/topics/${topic.id}/edit`)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/topics/${topic.id}/resources`)}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Manage Resources"
                                                    >
                                                        <FolderTree size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(topic.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTopics;


