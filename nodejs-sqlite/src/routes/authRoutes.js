import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

/**
 * Register a new user
 * Endpoint: /auth/register
 */
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);

    const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
    const result = insertUser.run(username, hashedPassword);

    const defaultTodo = 'Hello - Add your first todo!';
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(503).json({ message: 'Service Unavailable', error: error.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const query = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const user = query.get(username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Successful login',
      token
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(503).json({ message: 'Service Unavailable', error: error.message });
  }
});

export default router;
