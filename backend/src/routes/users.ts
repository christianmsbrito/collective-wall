import express from 'express';
import prisma from '../db';

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json({
        message: 'List of all users',
        data: users,
    });
});

usersRouter.post('/', async (req, res) => {
    const { name, email } = req.body;
    const user = await prisma.user.create({
        data: {
            name,
            email,
        },
    });
    res.json({
        message: 'User created successfully',
        data: user,
    });
});
  

export default usersRouter; 