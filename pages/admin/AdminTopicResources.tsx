import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTopicByIdAdmin, getTopicResourcesAdmin, getAllResources, addResourceToTopic, removeResourceFromTopic, type Topic, type Resource } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, Plus, Trash2, LogOut, X } from 'lucide-react';

const AdminTopicResources: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [topicResources, setTopicResources] = useState<Array<{ id: string; resource: Resource; display_order: number }>>([]);
    const [allResources, setAllResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        if (id) {
            loadData();
        }
    }, [id]);

    const checkAuth = async () => {
        const adminUser = await isAdmin();
        if (!adminUser) {
            navigate('/admin/login');
            return;
        }
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
    };

    const loadData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const topicData = await getTopicByIdAdmin(id);
            setTopic(topicData);
            
            if (topicData) {
                const [resourcesData, categoryResources] = await Promise.all([
                    getTopicResourcesAdmin(id),
                    getAllResources(topicData.category_id),
                ]);
                
                setTopicResources(resourcesData.map(tr => ({
                    id: tr.id,
                    resource: tr.resource,
                    display_order: tr.display_order,
                })));
                setAllResources(categoryResources);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async (resourceId: string) => {
        if (!id) return;
        try {
            await addResourceToTopic(id, resourceId);
            loadData();
            setShowAddModal(false);
        } catch (error) {
            alert('Failed to add resource');
        }
    };

    const handleRemoveResource = async (resourceId: string) => {
        if (!id) return;
        if (!confirm('Remove this resource from topic?')) return;
        try {
            await removeResourceFromTopic(id, resourceId);
            loadData();
        } catch (error) {
            alert('Failed to remove resource');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
    };

    const availableResources = allResources.filter(
        r => !topicResources.some(tr => tr.resource.id === r.id)
    );

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

    if (!topic) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600">Topic not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/topics')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Manage Resources: {topic.title_ku} / {topic.title_ar}
                                </h1>
                                <p className="text-sm text-slate-600">Add or remove resources from this topic</p>
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
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Resource
                    </button>
                </div>

                {/* Resources List */}
                {topicResources.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <p className="text-slate-600 mb-4">No resources in this topic</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Add First Resource
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Language
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {topicResources.map((tr) => (
                                        <tr key={tr.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900">{tr.resource.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {tr.resource.language}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleRemoveResource(tr.resource.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Resource Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Add Resource to Topic</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            {availableResources.length === 0 ? (
                                <p className="text-slate-600">No available resources to add</p>
                            ) : (
                                <div className="space-y-2">
                                    {availableResources.map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                                        >
                                            <div>
                                                <div className="font-medium text-slate-900">{resource.title}</div>
                                                <div className="text-sm text-slate-500">{resource.language}</div>
                                            </div>
                                            <button
                                                onClick={() => handleAddResource(resource.id)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTopicResources;

