import User from '../models/User.js';
import RewardPoint from '../models/RewardPoint.js';

// @desc    Get user profile data, offers, and rewards
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // User is available from req.user due to protect middleware
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch reward points for the user
        const rewardPoints = await RewardPoint.findOne({ user: req.user.id });

        // Personalized offers are fetched via a separate endpoint (/api/personalized-offers/:userId)
        // For now, we'll return an empty array or a placeholder.
        const personalizedOffers = []; // Placeholder

        res.status(200).json({
            user,
            rewardPoints: rewardPoints ? rewardPoints.points : 0,
            personalizedOffers,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getUserProfile };
