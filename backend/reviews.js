const express = require('express')
// const mysql = require('mysql2')
const { Pool } = require('pg')
const cors = require('cors')
const path = require('path')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/resources', express.static(path.join(__dirname, '../resources')));

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

app.get('/api/reviews', (req, res) => {
	pool.query('SELECT * FROM reviews ORDER BY created_at DESC', (err, result) => {
		if (err) {
			console.error("Connection error at get:",err);
			res.status(500).json({ error: err.message });
		}
		else {
			console.log('Data fetched from Database: ',result);
			res.json(result.rows);
		}
	});
});

app.get('/api/reviews/rating', (req, res) => {
	pool.query('SELECT ROUND(AVG(rating), 1) AS average, COUNT(*) AS count FROM reviews WHERE rating IS NOT NULL', (err, result) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			res.json(result.rows[0]);
		}
	});
});

app.post('/api/reviews', (req, res) => {
	const { name, phone, review, rating } = req.body;
	if (!name || !review) {
		return res.status(400).json({ error: 'Name and review are required' });
	}
	const ratingValue = rating && rating >= 1 && rating <= 5 ? rating : null;
	pool.query(
		'INSERT INTO reviews (name, phone, review, rating) VALUES ($1, $2, $3, $4)',
		[name, phone || null, review, ratingValue],
		(err, result) => {
			if (err) res.status(500).json({ error: err.message });
			else {
				console.log('Review inserted:', result.insertId);
				res.status(201).json({ id: result.insertId, message: 'Review submitted' });
			}
		}
	);
});

app.listen(3000, () => {
	console.log('Backend server is running on http://localhost-socket:3000');
});
