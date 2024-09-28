import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users';
import wallsRouter from './routes/walls';

const corsOptions = {
  origin: '*',
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/walls', wallsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on <http://localhost:${PORT}> 🚀`);
});