import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:8000',         
  'https://client-flow-puce.vercel.app', // production frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifySupabaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing Authorization token' });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const email = data.user.email?.toLowerCase();

    if (!email) {
      return res.status(401).json({ error: 'User email not found' });
    }

    const allowed = await pool.query(
      'SELECT 1 FROM allowed_users WHERE email = $1',
      [email]
    );

    if (allowed.rowCount === 0) {
      return res.status(403).json({ error: 'User is not allowed' });
    }

    req.user = {
      id: data.user.id,
      email,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Auth verification failed' });
  }
}


app.use('/clients', verifySupabaseToken);

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
    const {
      name,
      email,
      phone,
      address,
      clientCategory,
      businessName,
      startDate,
      endDate,
      fee,
      paymentStatus,
      clientStatus,
      hourssigned,
      hoursused
    } = req.body;

    const result = await pool.query(
      `INSERT INTO Clients (
        name,
        email,
        phone,
        address,
        clientcategory,
        businessname,
        startdate,
        enddate,
        fee,
        paymentstatus,
        clientstatus,
        hourssigned,
        hoursused
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING *`,
      [
        name,
        email,
        phone,
        address,
        clientCategory,
        businessName,
        startDate,
        endDate,
        fee,
        paymentStatus,
        clientStatus,
        hourssigned,
        hoursused
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// PUT update a client
app.put('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      address,
      clientCategory,
      businessName,
      startDate,
      endDate,
      fee,
      paymentStatus,
      clientStatus,
      hourssigned,
      hoursused
    } = req.body;

    const result = await pool.query(
      `UPDATE Clients SET
        name = $1,
        email = $2,
        phone = $3,
        address = $4,
        clientcategory = $5,
        businessname = $6,
        startdate = $7,
        enddate = $8,
        fee = $9,
        paymentstatus = $10,
        clientstatus = $11,
        hourssigned = $12,
        hoursused = $13
      WHERE id = $14
      RETURNING *`,
      [
        name,
        email,
        phone,
        address,
        clientCategory,
        businessName,
        startDate,
        endDate,
        fee,
        paymentStatus,
        clientStatus,
        hourssigned,
        hoursused,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
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
