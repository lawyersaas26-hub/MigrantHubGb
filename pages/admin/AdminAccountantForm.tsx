import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccountantById, updateAccountant, type Accountant } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { ArrowLeft, LogOut, Save, X } from 'lucide-react';

const AdminAccountantForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [formData, setFormData] = useState<Partial<Accountant>>({
        name: '',
        firm_name: '',
        specialization: '',
        location: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        languages: [],
        experience_years: null,
        consultation_fee: null,
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
            loadAccountant();
        } else {
            setLoading(false);
        }
    };

    const loadAccountant = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const accountant = await getAccountantById(id);
            if (accountant) {
                setFormData({
                    name: accountant.name || '',
                    firm_name: accountant.firm_name || '',
                    specialization: accountant.specialization || '',
                    location: accountant.location || '',
                    description: accountant.description || '',
                    phone: accountant.phone || '',
                    email: accountant.email || '',
                    website: accountant.website || '',
                    languages: accountant.languages || [],
                    experience_years: accountant.experience_years || null,
                    consultation_fee: accountant.consultation_fee || null,
                    is_active: accountant.is_active || false,
                });
            }
        } catch (error) {
            console.error('Error loading accountant:', error);
            alert('Failed to load accountant');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSaving(true);
        try {
            await updateAccountant(id, formData);
            alert('Accountant updated successfully!');
            navigate('/admin/accountants');
        } catch (error) {
            console.error('Error updating accountant:', error);
            alert('Failed to update accountant');
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
                                onClick={() => navigate('/admin/accountants')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Edit Accountant</h1>
                                <p className="text-sm text-slate-600">Update accountant details</p>
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Firm Name and Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Firm Name
                            </label>
                            <input
                                type="text"
                                value={formData.firm_name || ''}
                                onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
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

                    {/* Specialization */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Specialization
                        </label>
                        <select
                            value={formData.specialization || ''}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select specialization</option>
                            <option value="tax">Tax</option>
                            <option value="bookkeeping">Bookkeeping</option>
                            <option value="audit">Audit</option>
                            <option value="financial_planning">Financial Planning</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    {/* Experience and Consultation Fee */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Experience (Years)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.experience_years || ''}
                                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value ? parseInt(e.target.value) : null })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Consultation Fee (£)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.consultation_fee || ''}
                                onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value ? parseFloat(e.target.value) : null })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Languages (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={Array.isArray(formData.languages) ? formData.languages.join(', ') : ''}
                            onChange={(e) => {
                                const languages = e.target.value
                                    .split(',')
                                    .map(lang => lang.trim())
                                    .filter(lang => lang);
                                setFormData({ ...formData, languages: languages.length > 0 ? languages : null });
                            }}
                            placeholder="e.g.: English, Arabic, Kurdish"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Phone and Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g.: +44 7700 900000"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            value={formData.website || ''}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
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
                            onClick={() => navigate('/admin/accountants')}
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

export default AdminAccountantForm;










