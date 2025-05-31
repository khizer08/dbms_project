const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

const authController = {
    // Member login
    async memberLogin(req, res) {
        try {
            const { id } = req.body;
            
            // Check if member exists
            const [members] = await pool.execute(
                'SELECT * FROM members WHERE member_id = ?',
                [id]
            );

            if (members.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid member ID'
                });
            }

            const member = members[0];

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: member.member_id,
                    role: 'member',
                    name: member.name
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: member.member_id,
                    name: member.name,
                    role: 'member'
                }
            });

        } catch (error) {
            console.error('Error in member login:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }
    },

    // Trainer login
    async trainerLogin(req, res) {
        try {
            const { id } = req.body;
            
            // Check if trainer exists
            const [trainers] = await pool.execute(
                'SELECT * FROM trainers WHERE trainer_id = ?',
                [id]
            );

            if (trainers.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid trainer ID'
                });
            }

            const trainer = trainers[0];

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: trainer.trainer_id,
                    role: 'trainer',
                    name: trainer.name
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: trainer.trainer_id,
                    name: trainer.name,
                    role: 'trainer'
                }
            });

        } catch (error) {
            console.error('Error in trainer login:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }
    },

    // Owner login
    async ownerLogin(req, res) {
        try {
            const { username, password } = req.body;
            
            // In a real application, you would validate against a database
            // For now, we'll use a hardcoded check
            if (username === 'owner' && password === 'admin123') {
                const token = jwt.sign(
                    { 
                        role: 'owner',
                        name: 'Owner'
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        role: 'owner',
                        name: 'Owner'
                    }
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

        } catch (error) {
            console.error('Error in owner login:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }
    }
};

module.exports = authController; 