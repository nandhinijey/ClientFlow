import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET all clients
app.get('/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Clients');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET client by ID
app.get('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Clients WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new client
app.post('/clients', async (req, res) => {
  try {
    const { name, email, phone, address, clientCategory, businessName, startDate, endDate, fee, paymentStatus, clientStatus } = req.body;
    const result = await pool.query(
      `INSERT INTO Clients (name, email, phone, address, clientCategory, businessName, startDate, endDate, fee, paymentStatus, clientStatus)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, email, phone, address, clientCategory, businessName, startDate, endDate, fee, paymentStatus, clientStatus]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a client
app.put('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, clientCategory, businessName, startDate, endDate, fee, paymentStatus,clientStatus } = req.body;
    const result = await pool.query(
      `UPDATE Clients SET name=$1, email=$2, phone=$3, address=$4, clientCategory=$5, businessName=$6, startDate=$7, endDate=$8, fee=$9, paymentStatus=$10, clientStatus=$11
       WHERE id=$12 RETURNING *`,
      [name, email, phone, address, clientCategory, businessName, startDate, endDate, fee, paymentStatus, clientStatus, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a client
app.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Clients WHERE id = $1', [id]);
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
    res.send('API is running');
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
