const express = require('express');

const {
    registerUser,
    loginUser,
    getMe,
} = require('../controllers/authController');

const protect = require('../middleware/authMiddleware');

const {
    body,
} = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */
// REGISTER
router.post(
    '/register', [
        body('name')
        .notEmpty()
        .withMessage('Name is required'),

        body('email')
        .isEmail()
        .withMessage('Valid email required'),

        body('password')
        .isLength({ min: 6 })
        .withMessage(
            'Password must be at least 6 characters'
        ),
    ],
    registerUser
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 */
// LOGIN
router.post(
    '/login', [
        body('email')
        .isEmail()
        .withMessage('Valid email required'),

        body('password')
        .notEmpty()
        .withMessage('Password required'),
    ],
    loginUser
);


router.get('/me', protect, getMe);

module.exports = router;