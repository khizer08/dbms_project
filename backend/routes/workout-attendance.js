const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all workout attendance records
router.get('/', async (req, res) => {
    try {
        const [records] = await pool.query(`
            SELECT wa.*, m.name as member_name, w.name as workout_name 
            FROM workout_attendance wa
            JOIN members m ON wa.member_id = m.member_id
            JOIN workouts w ON wa.workout_id = w.workout_id
            ORDER BY wa.date DESC
        `);
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching workout attendance:', error);
        res.status(500).json({ success: false, message: 'Error fetching workout attendance' });
    }
});

// Get workout attendance by member ID
router.get('/member/:memberId', async (req, res) => {
    try {
        const [records] = await pool.query(`
            SELECT wa.*, w.name as workout_name 
            FROM workout_attendance wa
            JOIN workouts w ON wa.workout_id = w.workout_id
            WHERE wa.member_id = ?
            ORDER BY wa.date DESC
        `, [req.params.memberId]);
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching member workout attendance:', error);
        res.status(500).json({ success: false, message: 'Error fetching member workout attendance' });
    }
});

// Record workout attendance
router.post('/', async (req, res) => {
    try {
        const { member_id, workout_id, date } = req.body;
        const [result] = await pool.query(
            'INSERT INTO workout_attendance (member_id, workout_id, date) VALUES (?, ?, ?)',
            [member_id, workout_id, date]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Workout attendance recorded successfully',
            recordId: result.insertId 
        });
    } catch (error) {
        console.error('Error recording workout attendance:', error);
        res.status(500).json({ success: false, message: 'Error recording workout attendance' });
    }
});

// Update workout attendance
router.put('/:id', async (req, res) => {
    try {
        const { workout_id, date } = req.body;
        await pool.query(
            'UPDATE workout_attendance SET workout_id = ?, date = ? WHERE record_id = ?',
            [workout_id, date, req.params.id]
        );
        res.json({ success: true, message: 'Workout attendance updated successfully' });
    } catch (error) {
        console.error('Error updating workout attendance:', error);
        res.status(500).json({ success: false, message: 'Error updating workout attendance' });
    }
});

// Delete workout attendance
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM workout_attendance WHERE record_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Workout attendance deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout attendance:', error);
        res.status(500).json({ success: false, message: 'Error deleting workout attendance' });
    }
});

module.exports = router; 