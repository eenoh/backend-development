import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

/**
 * Register a new user
 * Endpoint: /auth/register
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await prisma.user.create({
      data: {
        usernmane,
        password: hashedPassword
      }
    })

    const defaultTodo = 'Hello - Add your first todo!';
    
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id
      }
    })

    const token = jwt.sign(
      { id: user.id },
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

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

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
