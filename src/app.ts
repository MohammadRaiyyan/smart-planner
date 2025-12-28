import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Hello, Smart Planner!');
});

export { app };
export default app;