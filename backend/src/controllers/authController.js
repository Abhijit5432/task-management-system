const {
    validationResult,
} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');


// REGISTER USER
const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        // Check fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



// LOGIN USER
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        // Check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getMe = async(req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};