import React from 'react';

interface PasswordProtectionProps {
    children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
    // Password protection disabled - always allow access
    return <>{children}</>;
    
    /* DISABLED PASSWORD PROTECTION - Original code below
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Get password from environment variable
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'changeme123';

    // Check if current route is admin route (skip password protection for admin)
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/welcome';

    useEffect(() => {
        // Skip password protection for admin routes and auth routes
        if (isAdminRoute || isAuthRoute) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
        }

        // Check if user is already authenticated
        const storedAuth = localStorage.getItem('app_authenticated');
        const storedPassword = localStorage.getItem('app_password_hash');
        
        // Simple hash check (not cryptographically secure, but good enough for basic protection)
        const expectedHash = btoa(correctPassword).split('').reverse().join('');
        
        if (storedAuth === 'true' && storedPassword === expectedHash) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [correctPassword, isAdminRoute, isAuthRoute]);
    */

    /* DISABLED - Original password protection code below
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password === correctPassword) {
            // Store authentication
            const passwordHash = btoa(correctPassword).split('').reverse().join('');
            localStorage.setItem('app_authenticated', 'true');
            localStorage.setItem('app_password_hash', passwordHash);
            setIsAuthenticated(true);
        } else {
            setError('Invalid password. Please try again.');
            setPassword('');
        }
    };

    // Skip password protection for admin routes and auth routes
    if (isAdminRoute || isAuthRoute) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 px-5">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Lock size={40} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Access Required
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Please enter the password to access this app
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all"
                                autoFocus
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 active:scale-[0.98]"
                        >
                            Access App
                        </button>
                    </form>

                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">
                        This app is private. Only authorized users can access it.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
    */
};

export default PasswordProtection;

