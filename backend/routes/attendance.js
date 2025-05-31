const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all attendance records
router.get('/', async (req, res) => {
    try {
        const [attendance] = await pool.query('SELECT * FROM attendance');
        res.json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Error fetching attendance' });
    }
});

// Get attendance by member ID
router.get('/member/:memberId', async (req, res) => {
    try {
        const [attendance] = await pool.query(
            'SELECT * FROM attendance WHERE member_id = ? ORDER BY check_in DESC',
            [req.params.memberId]
        );
        res.json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error fetching member attendance:', error);
        res.status(500).json({ success: false, message: 'Error fetching member attendance' });
    }
});

// Check in member
router.post('/check-in', async (req, res) => {
    try {
        const { member_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO attendance (member_id) VALUES (?)',
            [member_id]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Check-in recorded successfully',
            attendanceId: result.insertId 
        });
    } catch (error) {
        console.error('Error recording check-in:', error);
        res.status(500).json({ success: false, message: 'Error recording check-in' });
    }
});

// Check out member
router.put('/check-out/:attendanceId', async (req, res) => {
    try {
        await pool.query(
            'UPDATE attendance SET check_out = CURRENT_TIMESTAMP WHERE attendance_id = ? AND check_out IS NULL',
            [req.params.attendanceId]
        );
        res.json({ success: true, message: 'Check-out recorded successfully' });
    } catch (error) {
        console.error('Error recording check-out:', error);
        res.status(500).json({ success: false, message: 'Error recording check-out' });
    }
});

module.exports = router; 