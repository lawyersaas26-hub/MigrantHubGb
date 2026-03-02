import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob, type Job } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, LogOut, Save, X } from 'lucide-react';

const AdminJobForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [formData, setFormData] = useState<Partial<Job>>({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: '',
        description: '',
        requirements: '',
        apply_url: '',
        apply_email: '',
        category: '',
        contact_phone: '',
        is_active: false,
    });

    useEffect(() => {
        checkAuth();
    }, [id]);

    const checkAuth = async () => {
        const adminUser = await isAdmin();
        if (!adminUser) {
            navigate('/admin/login');
            return;
        }
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
        if (id) {
            loadJob();
        } else {
            setLoading(false);
        }
    };

    const loadJob = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const job = await getJobById(id);
            if (job) {
                setFormData({
                    title: job.title || '',
                    company: job.company || '',
                    location: job.location || '',
                    salary: job.salary || '',
                    type: job.type || '',
                    description: job.description || '',
                    requirements: job.requirements || '',
                    apply_url: job.apply_url || '',
                    apply_email: job.apply_email || '',
                    category: job.category || '',
                    contact_phone: job.contact_phone || '',
                    is_active: job.is_active || false,
                });
            }
        } catch (error) {
            console.error('Error loading job:', error);
            alert('Failed to load job');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSaving(true);
        try {
            await updateJob(id, formData);
            alert('Job updated successfully!');
            navigate('/admin/jobs');
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Failed to update job');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await signOutAdmin();
        navigate('/admin/login');
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/jobs')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Edit Job</h1>
                                <p className="text-sm text-slate-600">Update job details</p>
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

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Company and Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Company *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Type and Salary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Job Type
                            </label>
                            <select
                                value={formData.type || ''}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select type</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="temporary">Temporary</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Salary
                            </label>
                            <input
                                type="text"
                                value={formData.salary || ''}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="e.g.: £10-12/hour"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select category</option>
                            <option value="retail">Retail</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="hospitality">Hospitality</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="security">Security</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Requirements
                        </label>
                        <textarea
                            value={formData.requirements || ''}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Contact Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.contact_phone || ''}
                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                            placeholder="e.g.: +44 7700 900000"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Apply URL and Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Apply URL
                            </label>
                            <input
                                type="url"
                                value={formData.apply_url || ''}
                                onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Apply Email
                            </label>
                            <input
                                type="email"
                                value={formData.apply_email || ''}
                                onChange={(e) => setFormData({ ...formData, apply_email: e.target.value })}
                                placeholder="email@example.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active || false}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">
                            Active (visible to users)
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/jobs')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminJobForm;











