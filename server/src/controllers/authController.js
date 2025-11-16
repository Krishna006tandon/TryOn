import User from '../models/User.js';
import OTP from '../models/OTP.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../config/emailService.js';
import crypto from 'crypto';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// @desc    Register user & send OTP
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate strong password (at least 6 characters for now, can be enhanced)
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            if (user.verified) {
                return res.status(400).json({ message: 'User already exists and is verified' });
            } else {
                // If user exists but not verified, allow re-sending OTP
                await OTP.deleteMany({ email }); // Clear old OTPs
            }
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Save OTP temporarily
        const newOtp = new OTP({ email, otp, expiresAt });
        await newOtp.save();

        // Send OTP to email
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email', email });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify OTP & register user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { email, otp, name, password } = req.body; // Include name and password for user creation

    if (!email || !otp || !name || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Find the latest OTP for the email
        const storedOtp = await OTP.findOne({ email, otp }).sort({ expiresAt: -1 });

        if (!storedOtp || storedOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (storedOtp.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: storedOtp._id }); // Clean up expired OTP
            return res.status(400).json({ message: 'OTP expired' });
        }

        // OTP is valid, create user
        let user = await User.findOne({ email });
        if (user) {
            // If user exists but not verified, update their details and verify
            user.name = name;
            user.password = password; // Password will be hashed by pre-save hook
            user.verified = true;
            await user.save();
        } else {
            // Create new user
            user = new User({ name, email, password, verified: true });
            await user.save();
        }

        // Delete the used OTP
        await OTP.deleteMany({ email });

        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is verified
        if (!user.verified) {
            return res.status(400).json({ message: 'Please verify your email with OTP first' });
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Logged in successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { signup, verifyOtp, login };
