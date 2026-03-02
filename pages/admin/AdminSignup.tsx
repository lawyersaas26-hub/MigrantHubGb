import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpAdmin } from '../../lib/adminAuth';
import { Lock, Mail, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';

const AdminSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await signUpAdmin(email, password);
            setSuccess(true);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <UserPlus size={32} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Signup</h1>
                    <p className="text-slate-600">Create an admin account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                        <div>
                            <p className="text-green-700 text-sm font-semibold">Account created successfully!</p>
                            <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="admin@example.com"
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="••••••••"
                                disabled={loading || success}
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="••••••••"
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : success ? 'Account Created!' : 'Create Admin Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/admin/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;



