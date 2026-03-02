import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs, deleteJob, approveJob, rejectJob, type Job } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, Briefcase, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AdminJobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
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
        loadJobs();
    };

    const loadJobs = async () => {
        setLoading(true);
        try {
            const data = await getAllJobs();
            setJobs(data);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        
        try {
            await deleteJob(id);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
            alert('Failed to delete job');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveJob(id);
            setJobs(jobs.map(j => j.id === id ? { ...j, is_active: true } : j));
        } catch (error) {
            alert('Failed to approve job');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectJob(id);
            setJobs(jobs.map(j => j.id === id ? { ...j, is_active: false } : j));
        } catch (error) {
            alert('Failed to reject job');
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
    };

    const filteredJobs = jobs.filter(job => {
        if (filter === 'active') return job.is_active;
        if (filter === 'pending') return !job.is_active;
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
                                <h1 className="text-2xl font-bold text-slate-900">Job Listings</h1>
                                <p className="text-sm text-slate-600">Manage job postings and approvals</p>
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
                            All ({jobs.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'pending' 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Pending ({jobs.filter(j => !j.is_active).length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filter === 'active' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            Active ({jobs.filter(j => j.is_active).length})
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
                        <p className="mt-4 text-slate-600">Loading jobs...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600 mb-4">No jobs found</p>
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
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Salary
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Posted Date
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
                                    {filteredJobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{job.title}</div>
                                                {job.category && (
                                                    <div className="text-xs text-slate-500 mt-1">{job.category}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {job.company}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {job.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {job.type ? (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                        {job.type}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {job.salary ? (
                                                    <span className="font-semibold">{job.salary}</span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {new Date(job.posted_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {job.is_active ? (
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
                                                    {!job.is_active && (
                                                        <button
                                                            onClick={() => handleApprove(job.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {job.is_active && (
                                                        <button
                                                            onClick={() => handleReject(job.id)}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job.id)}
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

export default AdminJobs;











