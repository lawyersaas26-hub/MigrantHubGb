import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllInstructorReviews, updateInstructorReview, deleteInstructorReview, type InstructorReview } from '../../lib/supabase';
import { getCurrentAdmin, signOutAdmin, isAdmin } from '../../lib/adminAuth';
import { Edit, Trash2, LogOut, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Star } from 'lucide-react';

const AdminInstructorReviews: React.FC = () => {
    const { instructorId } = useParams<{ instructorId?: string }>();
    const [reviews, setReviews] = useState<InstructorReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, [instructorId]);

    const checkAuth = async () => {
        const adminUser = await isAdmin();
        if (!adminUser) {
            navigate('/admin/login');
            return;
        }
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
        loadReviews();
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await getAllInstructorReviews(instructorId);
            setReviews(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleApproval = async (review: InstructorReview) => {
        try {
            await updateInstructorReview(review.id, {
                ...review,
                is_approved: !review.is_approved,
            });
            loadReviews();
        } catch (error) {
            alert('Failed to update review');
        }
    };

    const handleToggleActive = async (review: InstructorReview) => {
        try {
            await updateInstructorReview(review.id, {
                ...review,
                is_active: !review.is_active,
            });
            loadReviews();
        } catch (error) {
            alert('Failed to update review');
        }
    };

    const handleToggleVerified = async (review: InstructorReview) => {
        try {
            await updateInstructorReview(review.id, {
                ...review,
                is_verified: !review.is_verified,
            });
            loadReviews();
        } catch (error) {
            alert('Failed to update review');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        
        try {
            await deleteInstructorReview(id);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            alert('Failed to delete review');
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
                                onClick={() => navigate('/admin/driving-instructors')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Instructor Reviews
                                    {instructorId && ' (Filtered)'}
                                </h1>
                                <p className="text-sm text-slate-600">Manage and moderate reviews</p>
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
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Total Reviews</p>
                        <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Approved</p>
                        <p className="text-2xl font-bold text-green-600">
                            {reviews.filter(r => r.is_approved && r.is_active).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {reviews.filter(r => !r.is_approved && r.is_active).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Verified</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {reviews.filter(r => r.is_verified).length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-600">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <p className="text-slate-600 mb-4">No reviews found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Reviewer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Review
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Date
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
                                    {reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="font-medium text-slate-900">{review.reviewer_name}</div>
                                                    {review.reviewer_email && (
                                                        <div className="text-sm text-slate-500">{review.reviewer_email}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < review.rating
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-slate-300'
                                                            }
                                                        />
                                                    ))}
                                                    <span className="ml-2 font-semibold text-slate-700">{review.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-700 max-w-md line-clamp-2">
                                                    {review.review_text || <span className="text-slate-400">No text</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    {review.is_approved ? (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded w-fit">
                                                            <CheckCircle size={12} />
                                                            Approved
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded w-fit">
                                                            <XCircle size={12} />
                                                            Pending
                                                        </span>
                                                    )}
                                                    {review.is_active ? (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded w-fit">
                                                            <Eye size={12} />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded w-fit">
                                                            <EyeOff size={12} />
                                                            Inactive
                                                        </span>
                                                    )}
                                                    {review.is_verified && (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded w-fit">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleApproval(review)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title={review.is_approved ? 'Unapprove' : 'Approve'}
                                                    >
                                                        {review.is_approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleVerified(review)}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title={review.is_verified ? 'Unverify' : 'Verify'}
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleActive(review)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title={review.is_active ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {review.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
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

export default AdminInstructorReviews;


