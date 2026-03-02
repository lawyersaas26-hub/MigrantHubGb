import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHomes, deleteHome, approveHome, rejectHome, type Home } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Edit, Trash2, LogOut, Eye, EyeOff, Home as HomeIcon, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AdminHomes: React.FC = () => {
    const [homes, setHomes] = useState<Home[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');
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
        loadHomes();
    };

    const loadHomes = async () => {
        setLoading(true);
        try {
            const data = await getAllHomes();
            setHomes(data);
        } catch (error) {
            console.error('Error loading homes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this home listing?')) return;
        
        try {
            await deleteHome(id);
            setHomes(homes.filter(h => h.id !== id));
        } catch (error) {
            alert('Failed to delete home');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveHome(id);
            setHomes(homes.map(h => h.id === id ? { ...h, is_active: true } : h));
        } catch (error) {
            alert('Failed to approve home');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectHome(id);
            setHomes(homes.map(h => h.id === id ? { ...h, is_active: false } : h));
        } catch (error) {
            alert('Failed to reject home');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
    };

    const filteredHomes = homes.filter(home => {
        if (filter === 'active') return home.is_active;
        if (filter === 'pending') return !home.is_active;
        return true;
    });

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
                                <h1 className="text-2xl font-bold text-slate-900">Home Listings</h1>
                                <p className="text-sm text-slate-600">Manage home rental listings and approvals</p>
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
                {/* Filters */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'all' 
                                    ? 'bg-rose-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            All ({homes.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'pending' 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Pending ({homes.filter(h => !h.is_active).length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'active' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Active ({homes.filter(h => h.is_active).length})
                        </button>
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
                        <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-600">Loading homes...</p>
                    </div>
                ) : filteredHomes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <HomeIcon size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600 mb-4">No homes found</p>
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
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            City
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Property Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Bedrooms
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Rent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Created
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
                                    {filteredHomes.map((home) => (
                                        <tr key={home.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{home.title}</div>
                                                {home.address && (
                                                    <div className="text-xs text-slate-500 mt-1">{home.address}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {home.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {home.city}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {home.property_type ? (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded capitalize">
                                                        {home.property_type}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {home.bedrooms !== undefined && home.bedrooms !== null ? (
                                                    <span className="font-semibold">{home.bedrooms}</span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <span className="font-semibold text-rose-600">£{home.rent_amount.toLocaleString()}</span>
                                                <span className="text-xs text-slate-500">/month</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <div>
                                                    <div className="font-medium">{home.contact_name}</div>
                                                    {home.contact_phone && (
                                                        <div className="text-xs text-slate-500">{home.contact_phone}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {new Date(home.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {home.is_active ? (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                        <Eye size={14} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                                                        <EyeOff size={14} />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    {!home.is_active && (
                                                        <button
                                                            onClick={() => handleApprove(home.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {home.is_active && (
                                                        <button
                                                            onClick={() => handleReject(home.id)}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(home.id)}
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

export default AdminHomes;






