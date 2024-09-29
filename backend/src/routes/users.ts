import express from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '..';
import { isAuthorized } from '../middlewares/isAuthorized';

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json({
        message: 'List of all users',
        data: users,
    });
});

usersRouter.get('/me', isAuthorized, async (req: CustomRequest, res) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.user.userId) },
    });
    res.json({
        message: 'User details by id',
        data: user,
    });
});

usersRouter.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    res.json({
        message: 'User signed up successfully',
        token: jwt.sign({ userId: user.id}, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: '1h' }),
        data: { user },
    });
});

usersRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: '1h' });
    res.json({
        message: 'Login successful',
        token,
    });
});  

export default usersRouter; 