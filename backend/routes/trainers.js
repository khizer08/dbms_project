const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all trainers
router.get('/', async (req, res) => {
    try {
        const [trainers] = await pool.query('SELECT * FROM trainers');
        res.json({ success: true, data: trainers });
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ success: false, message: 'Error fetching trainers' });
    }
});

// Get trainer by ID
router.get('/:id', async (req, res) => {
    try {
        const [trainers] = await pool.query('SELECT * FROM trainers WHERE trainer_id = ?', [req.params.id]);
        if (trainers.length === 0) {
            return res.status(404).json({ success: false, message: 'Trainer not found' });
        }
        res.json({ success: true, data: trainers[0] });
    } catch (error) {
        console.error('Error fetching trainer:', error);
        res.status(500).json({ success: false, message: 'Error fetching trainer' });
    }
});

// Add new trainer
router.post('/', async (req, res) => {
    try {
        const { name, specialization, phone, email } = req.body;
        const [result] = await pool.query(
            'INSERT INTO trainers (name, specialization, phone, email) VALUES (?, ?, ?, ?)',
            [name, specialization, phone, email]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Trainer added successfully',
            trainerId: result.insertId 
        });
    } catch (error) {
        console.error('Error adding trainer:', error);
        res.status(500).json({ success: false, message: 'Error adding trainer' });
    }
});

// Update trainer
router.put('/:id', async (req, res) => {
    try {
        const { name, specialization, phone, email } = req.body;
        await pool.query(
            'UPDATE trainers SET name = ?, specialization = ?, phone = ?, email = ? WHERE trainer_id = ?',
            [name, specialization, phone, email, req.params.id]
        );
        res.json({ success: true, message: 'Trainer updated successfully' });
    } catch (error) {
        console.error('Error updating trainer:', error);
        res.status(500).json({ success: false, message: 'Error updating trainer' });
    }
});

// Delete trainer
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM trainers WHERE trainer_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Trainer deleted successfully' });
    } catch (error) {
        console.error('Error deleting trainer:', error);
        res.status(500).json({ success: false, message: 'Error deleting trainer' });
    }
});

module.exports = router; 