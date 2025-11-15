import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext exists
import api from '../utils/api'; // Import the configured axios instance
import { useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useAuth(); // Use the login function from AuthContext

        useEffect(() => {
            // if user navigated here from admin, show admin option
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
                        // Quick local admin login (static credentials) — bypass backend for dev convenience
                        if (email === 'nexbyte.dev' && password === '123456') {
                            const fakeUser = { id: 'admin', name: 'Admin', email: 'nexbyte.dev', role: 'admin' };
                              authLogin('local-admin-token', fakeUser);
                              localStorage.setItem('isAdmin', 'true');
                              setMessage('Logged in as admin (local)');
                              navigate('/admin/dashboard');
                            return;
                        }

                        const endpoint = asAdmin ? '/admin/login' : '/auth/login';
                        const res = await api.post(endpoint, { email, password }); // Use api.post
                        setMessage(res.data.message);
                        authLogin(res.data.token, res.data.user); // Log in the user via AuthContext
                        // Mark admin flag locally if server indicates admin role or user opted in
                        if (asAdmin || res.data.user?.role === 'admin') {
                            localStorage.setItem('isAdmin', 'true');
                        } else {
                            localStorage.removeItem('isAdmin');
                        }
                        navigate('/'); // Redirect to home or dashboard
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div style={{ position: 'absolute', left: 16, top: 18 }}>
                <button onClick={() => navigate(-1)} aria-label="Go back" className="px-3 py-1 rounded bg-white/5">← Back</button>
            </div>
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                        Or <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            create a new account
                        </a>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate('/admin/login')}
                                                            className="group relative w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                                        >
                                                            Admin login
                                                        </button>
                                                </div>
                                                <Button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
                        >
                            Sign in
                        </Button>
                    </div>
                    {message && (
                        <p className={`mt-2 text-center text-sm ${message.includes('failed') || message.includes('error') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
