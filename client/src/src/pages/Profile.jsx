import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [offers, setOffers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                try {
                    const res = await api.get('/user/profile');
                    setProfileData(res.data.user);
                    setRewardPoints(res.data.rewardPoints);
                    setOffers(res.data.personalizedOffers);
                } catch (err) {
                    console.error('Error fetching profile data:', err);
                    setError('Failed to fetch profile data.');
                    if (err.response && err.response.status === 401) {
                        logout(); // Log out if token is invalid
                    }
                }
            }
        };

        fetchProfileData();
    }, [user, logout]);

    if (loading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        User Profile
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                        View your personal details, rewards, and exclusive offers.
                    </p>
                </div>

                {profileData && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</p>
                                <p className="text-base text-gray-900 dark:text-white">{profileData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</p>
                                <p className="text-base text-gray-900 dark:text-white">{profileData.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Role:</p>
                                <p className="text-base text-gray-900 dark:text-white">{profileData.role}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified:</p>
                                <p className="text-base text-gray-900 dark:text-white">{profileData.verified ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Reward Points</h3>
                    <p className="text-base text-gray-900 dark:text-white">
                        You have <span className="font-bold text-indigo-600 dark:text-indigo-400">{rewardPoints}</span> reward points.
                    </p>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Available Offers</h3>
                    {offers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {offers.map((offer, index) => (
                                <div key={index} className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-700">
                                    <p className="font-semibold text-indigo-700 dark:text-indigo-300">{offer.title || 'Special Offer'}</p>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{offer.description || 'No description available.'}</p>
                                    {offer.discountPercentage && (
                                        <p className="text-green-700 dark:text-green-400 font-bold mt-2">{offer.discountPercentage}% OFF!</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-base text-gray-600 dark:text-gray-300">No personalized offers available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
