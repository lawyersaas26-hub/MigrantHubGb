import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources, deleteResource, type Resource } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, FolderTree, Car, Briefcase, Car as CarIcon, Scale, Calculator, Plane, Home } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const adminUser = await isAdmin();
        if (!adminUser) {
            navigate('/admin/login');
            return;
        }
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
        loadResources();
    };

    const loadResources = async () => {
        setLoading(true);
        try {
            const data = await getAllResources();
            setResources(data);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        
        try {
            await deleteResource(id);
            setResources(resources.filter(r => r.id !== id));
        } catch (error) {
            alert('Failed to delete resource');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
    };

    if (loading && !admin) {
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
                            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                            <p className="text-sm text-slate-600 mt-1">{admin?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/admin/resources/new')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={20} />
                                New Resource
                            </button>
                            <button
                                onClick={() => navigate('/admin/categories')}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <FolderTree size={20} />
                                Categories
                            </button>
                            <button
                                onClick={() => navigate('/admin/driving-instructors')}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <Car size={20} />
                                Driving Instructors
                            </button>
                            <button
                                onClick={() => navigate('/admin/jobs')}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <Briefcase size={20} />
                                Jobs
                            </button>
                            <button
                                onClick={() => navigate('/admin/cars')}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                <CarIcon size={20} />
                                Cars
                            </button>
                            <button
                                onClick={() => navigate('/admin/lawyers')}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                            >
                                <Scale size={20} />
                                Lawyers
                            </button>
                            <button
                                onClick={() => navigate('/admin/accountants')}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                            >
                                <Calculator size={20} />
                                Accountants
                            </button>
                            <button
                                onClick={() => navigate('/admin/travel-agents')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plane size={20} />
                                Travel Agents
                            </button>
                            <button
                                onClick={() => navigate('/admin/homes')}
                                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                            >
                                <Home size={20} />
                                Homes
                            </button>
                            <button
                                onClick={() => navigate('/admin/topics')}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                <FolderTree size={20} />
                                Topics
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Resources ({resources.length})</h2>
                    </div>
                    
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-600">Loading resources...</p>
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-600 mb-4">No resources found.</p>
                            <button
                                onClick={() => navigate('/admin/resources/new')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={20} />
                                Create Your First Resource
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Language</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {resources.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{resource.title}</div>
                                                {resource.slug && (
                                                    <div className="text-sm text-slate-500">{resource.slug}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{resource.category_id}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 uppercase">{resource.language}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                                    resource.is_active 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {resource.is_active ? (
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
                                                        onClick={() => navigate(`/admin/resources/${resource.id}/edit`)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(resource.id)}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

