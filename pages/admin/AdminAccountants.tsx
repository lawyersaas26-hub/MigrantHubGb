import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAccountants, deleteAccountant, approveAccountant, rejectAccountant, type Accountant } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, Calculator, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AdminAccountants: React.FC = () => {
    const [accountants, setAccountants] = useState<Accountant[]>([]);
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
        loadAccountants();
    };

    const loadAccountants = async () => {
        setLoading(true);
        try {
            const data = await getAllAccountants();
            setAccountants(data);
        } catch (error) {
            console.error('Error loading accountants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this accountant?')) return;
        
        try {
            await deleteAccountant(id);
            setAccountants(accountants.filter(a => a.id !== id));
        } catch (error) {
            alert('Failed to delete accountant');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveAccountant(id);
            setAccountants(accountants.map(a => a.id === id ? { ...a, is_active: true } : a));
        } catch (error) {
            alert('Failed to approve accountant');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectAccountant(id);
            setAccountants(accountants.map(a => a.id === id ? { ...a, is_active: false } : a));
        } catch (error) {
            alert('Failed to reject accountant');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
    };

    const filteredAccountants = accountants.filter(accountant => {
        if (filter === 'active') return accountant.is_active;
        if (filter === 'pending') return !accountant.is_active;
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
                                <h1 className="text-2xl font-bold text-slate-900">Accountants Management</h1>
                                <p className="text-sm text-slate-600">Manage accountant submissions and approvals</p>
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
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            All ({accountants.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'pending' 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Pending ({accountants.filter(a => !a.is_active).length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'active' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Active ({accountants.filter(a => a.is_active).length})
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
                        <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-600">Loading accountants...</p>
                    </div>
                ) : filteredAccountants.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <Calculator size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600 mb-4">No accountants found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Firm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Specialization
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Submitted Date
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
                                    {filteredAccountants.map((accountant) => (
                                        <tr key={accountant.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{accountant.name}</div>
                                                {accountant.email && (
                                                    <div className="text-xs text-slate-500 mt-1">{accountant.email}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {accountant.firm_name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {accountant.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {accountant.specialization ? (
                                                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded">
                                                        {accountant.specialization}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {accountant.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {new Date(accountant.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {accountant.is_active ? (
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
                                                    {!accountant.is_active && (
                                                        <button
                                                            onClick={() => handleApprove(accountant.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {accountant.is_active && (
                                                        <button
                                                            onClick={() => handleReject(accountant.id)}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/admin/accountants/${accountant.id}/edit`)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(accountant.id)}
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

export default AdminAccountants;










