const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all members
router.get('/', async (req, res) => {
    try {
        const { trainer_id } = req.query;
        let query = 'SELECT * FROM members';
        const queryParams = [];

        if (trainer_id) {
            query += ' WHERE assigned_trainer = ?';
            queryParams.push(trainer_id);
        }

        const [members] = await pool.query(query, queryParams);
        res.json({ success: true, data: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, message: 'Error fetching members' });
    }
});

// Get member by ID
router.get('/:id', async (req, res) => {
    try {
        const [members] = await pool.query('SELECT * FROM members WHERE member_id = ?', [req.params.id]);
        if (members.length === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.json({ success: true, data: members[0] });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ success: false, message: 'Error fetching member' });
    }
});

// Add new member
router.post('/', async (req, res) => {
    try {
        const { name, age, gender, phone, email, membership_plan, assigned_trainer } = req.body;
        const [result] = await pool.query(
            'INSERT INTO members (name, age, gender, phone, email, membership_plan, assigned_trainer) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, phone, email, membership_plan, assigned_trainer]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Member added successfully',
            memberId: result.insertId 
        });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ success: false, message: 'Error adding member' });
    }
});

// Update member
router.put('/:id', async (req, res) => {
    try {
        const { name, age, gender, phone, email, membership_plan, assigned_trainer, assigned_workout_id } = req.body;
        await pool.query(
            'UPDATE members SET name = ?, age = ?, gender = ?, phone = ?, email = ?, membership_plan = ?, assigned_trainer = ?, assigned_workout_id = ? WHERE member_id = ?',
            [name, age, gender, phone, email, membership_plan, assigned_trainer, assigned_workout_id, req.params.id]
        );
        res.json({ success: true, message: 'Member updated successfully' });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ success: false, message: 'Error updating member' });
    }
});

// Delete member
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM members WHERE member_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ success: false, message: 'Error deleting member' });
    }
});

module.exports = router; 