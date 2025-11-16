import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import AuraBackground from '../components/AuraBackground';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true); // Set loading to true
        try {
            const res = await api.post('/auth/login', { email, password });
            setMessage(res.data.message);
            authLogin(res.data.token, res.data.user);
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background */}
            <AuraBackground className="absolute inset-0 z-0" />

            {/* CENTERED LOGIN CARD */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="
                    absolute 
                    top-1/2 left-1/2 
                    -translate-x-1/2 -translate-y-1/2
                    z-10 
                    w-full max-w-md 
                    bg-white dark:bg-gray-800 
                    p-10 
                    rounded-xl 
                    shadow-xl 
                    border border-gray-200 dark:border-gray-700
                "
            >
                <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
                    Welcome Back!
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    Sign in to continue your journey.
                </p>
                {message && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            message.includes('failed') || message.includes('error')
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                        }`}
                    >
                        {message}
                    </p>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-400 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3 text-base font-medium text-white 
                                   bg-indigo-600 hover:bg-indigo-700 
                                   dark:bg-indigo-500 dark:hover:bg-indigo-600 
                                   rounded-md"
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Logging in...' : 'Log in'} {/* Change text based on loading state */}
                    </Button>

                    {message && (
                        <p
                            className={`mt-2 text-center text-sm ${
                                message.includes('failed') || message.includes('error')
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <Link
                            to="/admin/login"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Admin Login
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
