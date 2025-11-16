import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const RewardPoints = ({ userId }) => {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchPoints();
    }
  }, [userId]);

  const fetchPoints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reward-points/${userId}`);
      setPoints(response.data);
    } catch (error) {
      console.error('Error fetching reward points:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !points) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <div className="animate-pulse h-4 bg-yellow-200 rounded w-32 mb-2" />
        <div className="animate-pulse h-3 bg-yellow-200 rounded w-24" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Reward Points</p>
          <p className="text-2xl font-bold text-yellow-600">{points.availablePoints || 0}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Earned</p>
          <p className="text-sm font-medium">{points.totalEarned || 0}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        100 points = $1 discount
      </p>
    </div>
  );
};

export default RewardPoints;

