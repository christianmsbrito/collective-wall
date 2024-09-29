import express, { Request } from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import wallsRouter from './routes/walls';
import { isAuthorized } from './middlewares/isAuthorized';

const corsOptions = {
  origin: '*',
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to check authorization for walls routes


app.use('/api/v1/users', usersRouter);
app.use('/api/v1/walls', isAuthorized, wallsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on <http://localhost:${PORT}> 🚀`);
});

// Extend the Request interface to include the user property
export interface CustomRequest extends Request {
  user?: any;
}