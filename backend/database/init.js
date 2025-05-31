const mysql = require('mysql2/promise');

async function initializeDatabase() {
    let connection;
    try {
        // First connect without database
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Surjo@14'
        });

        // Create database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS gym_management');
        console.log('Database created or already exists');

        // Use the database
        await connection.query('USE gym_management');

        // Drop existing tables if they exist
        await connection.query('DROP TABLE IF EXISTS members');
        await connection.query('DROP TABLE IF EXISTS trainers');
        await connection.query('DROP TABLE IF EXISTS workouts');
        console.log('Dropped existing tables');

        // Create trainers table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS trainers (
                trainer_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                specialization VARCHAR(100),
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Trainers table created');

        // Create members table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS members (
                member_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                assigned_trainer INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (assigned_trainer) REFERENCES trainers(trainer_id)
            )
        `);
        console.log('Members table created');

        // Create workouts table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS workouts (
                workout_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                duration INT,
                difficulty VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Workouts table created');

        // Insert sample trainers
        const trainers = [
            ['John Smith', 'john@example.com', 'Weight Training', '555-0001'],
            ['Sarah Johnson', 'sarah@example.com', 'Cardio', '555-0002'],
            ['Mike Wilson', 'mike@example.com', 'CrossFit', '555-0003']
        ];

        await connection.query('INSERT INTO trainers (name, email, specialization, phone) VALUES ?', [trainers]);
        console.log('Sample trainers inserted');

        // Insert sample members
        const members = [
            ['Alice Brown', 'alice@example.com', '555-0001', 1],
            ['Bob Davis', 'bob@example.com', '555-0002', 1],
            ['Carol Evans', 'carol@example.com', '555-0003', 2],
            ['David Foster', 'david@example.com', '555-0004', 3]
        ];

        await connection.query('INSERT INTO members (name, email, phone, assigned_trainer) VALUES ?', [members]);
        console.log('Sample members inserted');

        // Insert sample workouts
        const workouts = [
            ['Full Body Workout', 'Complete body workout focusing on all major muscle groups', 60, 'Intermediate'],
            ['Cardio Blast', 'High-intensity cardio workout', 45, 'Advanced'],
            ['Beginner Strength', 'Basic strength training for beginners', 45, 'Beginner']
        ];

        await connection.query('INSERT INTO workouts (name, description, duration, difficulty) VALUES ?', [workouts]);
        console.log('Sample workouts inserted');

        console.log('Database initialization completed successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

initializeDatabase();