const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    let connection;
    
    try {
        // Create connection without database
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Surjo@14', // Your MySQL password
        });

        console.log('Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS gym_management');
        console.log('Database created or already exists');

        // Use the database
        await connection.query('USE gym_management');
        console.log('Using gym_management database');

        // Read and execute schema.sql file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = await fs.readFile(schemaPath, 'utf8');
        
        // Split statements by semicolon and execute each one
        const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
            if (statement) {
                await connection.query(statement);
            }
        }
        console.log('Executed schema.sql');

        // Add sample trainers
        const sampleTrainers = [
            ['John Smith', 'Weight Training', '1234567890', 'john@ironpulse.com'],
            ['Sarah Johnson', 'Yoga', '2345678901', 'sarah@ironpulse.com'],
            ['Mike Wilson', 'CrossFit', '3456789012', 'mike@ironpulse.com']
        ];

        for (const trainer of sampleTrainers) {
            await connection.query(
                'INSERT INTO trainers (name, specialization, phone, email) VALUES (?, ?, ?, ?)',
                trainer
            );
        }
        console.log('Added sample trainers');

        // Add sample equipment (if you still want this)
        // const sampleEquipment = [
        //     ['Dumbbells', 50, 'Good', '2023-10-01'],
        //     ['Treadmill', 10, 'Excellent', '2023-10-15'],
        //     ['Barbell', 30, 'Good', '2023-10-05']
        // ];

        // for (const item of sampleEquipment) {
        //     await connection.query(
        //         'INSERT INTO equipment (name, quantity, condition_status, last_maintenance_date) VALUES (?, ?, ?, ?)',
        //         item
        //     );
        // }
        // console.log('Added sample equipment');

        // Add sample workouts (if you still want this)
        const sampleWorkouts = [
            ['Morning Strength', 'Full body strength workout', 1, 60, 15],
            ['Evening Yoga', 'Relaxing yoga session', 2, 75, 20],
            ['CrossFit Basics', 'Introduction to CrossFit movements', 3, 90, 10]
        ];

        for (const workout of sampleWorkouts) {
            await connection.query(
                'INSERT INTO workouts (name, description, trainer_id, duration, capacity) VALUES (?, ?, ?, ?, ?)',
                workout
            );
        }
        console.log('Added sample workouts');

        console.log('Database initialized successfully with sample data');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the initialization
initializeDatabase().catch(console.error);