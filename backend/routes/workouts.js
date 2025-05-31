const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all workouts
router.get('/', async (req, res) => {
    try {
        const [workouts] = await pool.query(`
            SELECT w.*, t.name as trainer_name 
            FROM workouts w
            LEFT JOIN trainers t ON w.trainer_id = t.trainer_id
            ORDER BY w.name
        `);
        res.json({ success: true, data: workouts });
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ success: false, message: 'Error fetching workouts' });
    }
});

// Get workout by ID
router.get('/:id', async (req, res) => {
    try {
        const [workouts] = await pool.query(`
            SELECT w.*, t.name as trainer_name 
            FROM workouts w
            LEFT JOIN trainers t ON w.trainer_id = t.trainer_id
            WHERE w.workout_id = ?
        `, [req.params.id]);
        
        if (workouts.length === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }
        
        res.json({ success: true, data: workouts[0] });
    } catch (error) {
        console.error('Error fetching workout:', error);
        res.status(500).json({ success: false, message: 'Error fetching workout' });
    }
});

// Create new workout
router.post('/', async (req, res) => {
    try {
        const { name, description, trainer_id, duration, capacity } = req.body;
        const [result] = await pool.query(
            'INSERT INTO workouts (name, description, trainer_id, duration, capacity) VALUES (?, ?, ?, ?, ?)',
            [name, description, trainer_id, duration, capacity]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Workout created successfully',
            workoutId: result.insertId 
        });
    } catch (error) {
        console.error('Error creating workout:', error);
        res.status(500).json({ success: false, message: 'Error creating workout' });
    }
});

// Update workout
router.put('/:id', async (req, res) => {
    try {
        const { name, description, trainer_id, duration, capacity } = req.body;
        await pool.query(
            'UPDATE workouts SET name = ?, description = ?, trainer_id = ?, duration = ?, capacity = ? WHERE workout_id = ?',
            [name, description, trainer_id, duration, capacity, req.params.id]
        );
        res.json({ success: true, message: 'Workout updated successfully' });
    } catch (error) {
        console.error('Error updating workout:', error);
        res.status(500).json({ success: false, message: 'Error updating workout' });
    }
});

// Delete workout
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM workouts WHERE workout_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ success: false, message: 'Error deleting workout' });
    }
});

module.exports = router; 