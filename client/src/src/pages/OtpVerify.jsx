import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext exists
import api from '../utils/api'; // Import the configured axios instance

const OtpVerify = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useAuth(); // Use the login function from AuthContext

    useEffect(() => {
        const storedEmail = localStorage.getItem('signupEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setMessage('No email found for OTP verification. Please sign up again.');
            // Optionally redirect to signup page
            // navigate('/signup');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const name = localStorage.getItem('signupName');
            const password = localStorage.getItem('signupPassword');

            const res = await api.post('/auth/verify-otp', { email, otp, name, password }); // Use api.post
            setMessage(res.data.message);
            authLogin(res.data.token, res.data.user); // Log in the user via AuthContext
            localStorage.removeItem('signupEmail'); // Clean up
            localStorage.removeItem('signupName');
            localStorage.removeItem('signupPassword');
            navigate('/'); // Redirect to home or dashboard
        } catch (error) {
            setMessage(error.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                        A 6-digit OTP has been sent to your email address.
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
                                readOnly
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 cursor-not-allowed rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                            />
                        </div>
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
                        >
                            Verify OTP
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

export default OtpVerify;
