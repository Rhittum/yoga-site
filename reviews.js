const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'rin',
	password: process.env.MARIADB_PASSWORD,
	database: 'clients'
});

app.get('/api/reviews', (req, res) => {
	connection.query('SELECT * FROM reviews ORDER BY created_at DESC', (err, result) => {
		if (err) res.status(500).json({ error: err.message });
		else {
			console.log('Data fetched from Database: ',result);
			res.json(result);
		}
	});
});

app.post('/api/reviews', (req, res) => {
	const { name, phone, review } = req.body;
	if (!name || !review) {
		return res.status(400).json({ error: 'Name and review are required' });
	}
	connection.query(
		'INSERT INTO reviews (name, phone, review) VALUES (?, ?, ?)',
		[name, phone || null, review],
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
	console.log('Backend server is running on http://localhost:3000');
});
