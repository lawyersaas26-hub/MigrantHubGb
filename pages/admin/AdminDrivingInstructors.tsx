import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDrivingInstructors, deleteDrivingInstructor, updateDrivingInstructor, type DrivingInstructor } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, Car, ArrowLeft, Star, CheckCircle, XCircle } from 'lucide-react';

const AdminDrivingInstructors: React.FC = () => {
    const [instructors, setInstructors] = useState<DrivingInstructor[]>([]);
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
        loadInstructors();
    };

    const loadInstructors = async () => {
        setLoading(true);
        try {
            const data = await getAllDrivingInstructors();
            setInstructors(data);
        } catch (error) {
            console.error('Error loading instructors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this instructor?')) return;
        
        try {
            await deleteDrivingInstructor(id);
            setInstructors(instructors.filter(i => i.id !== id));
        } catch (error) {
            alert('Failed to delete instructor');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await updateDrivingInstructor(id, { is_active: true });
            setInstructors(instructors.map(i => i.id === id ? { ...i, is_active: true } : i));
        } catch (error) {
            alert('Failed to approve instructor');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateDrivingInstructor(id, { is_active: false });
            setInstructors(instructors.map(i => i.id === id ? { ...i, is_active: false } : i));
        } catch (error) {
            alert('Failed to reject instructor');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
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
                                <h1 className="text-2xl font-bold text-slate-900">Driving Instructors</h1>
                                <p className="text-sm text-slate-600">Manage driving instructors</p>
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
                {/* Filters and Actions */}
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
                            All ({instructors.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'pending' 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Pending ({instructors.filter(i => !i.is_active).length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'active' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Active ({instructors.filter(i => i.is_active).length})
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/admin/driving-instructors/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={20} />
                            New Instructor
                        </button>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-600">Loading instructors...</p>
                    </div>
                ) : instructors.filter(i => {
                    if (filter === 'active') return i.is_active;
                    if (filter === 'pending') return !i.is_active;
                    return true;
                }).length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <Car size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600 mb-4">No instructors found</p>
                        <button
                            onClick={() => navigate('/admin/driving-instructors/new')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Add First Instructor
                        </button>
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
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Price
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
                                    {instructors.filter(i => {
                                        if (filter === 'active') return i.is_active;
                                        if (filter === 'pending') return !i.is_active;
                                        return true;
                                    }).map((instructor) => (
                                        <tr key={instructor.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-slate-900">{instructor.name}</div>
                                                    {instructor.is_verified && (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {instructor.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {instructor.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {instructor.rating > 0 ? (
                                                    <span className="font-semibold">{instructor.rating.toFixed(1)}</span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {instructor.price_per_hour ? (
                                                    <span className="font-semibold">£{instructor.price_per_hour}</span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {instructor.is_active ? (
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
                                                    {!instructor.is_active && (
                                                        <button
                                                            onClick={() => handleApprove(instructor.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {instructor.is_active && (
                                                        <button
                                                            onClick={() => handleReject(instructor.id)}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/admin/driving-instructors/${instructor.id}/edit`)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/instructor-reviews/${instructor.id}`)}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="View Reviews"
                                                    >
                                                        <Star size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(instructor.id)}
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

export default AdminDrivingInstructors;

