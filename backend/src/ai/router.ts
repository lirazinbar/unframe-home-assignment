// src/routes/ai.router.ts
import { Router } from 'express';
import { askQuestion } from './controller';

const aiRouter = Router();

aiRouter.post('/ask', askQuestion);

export default aiRouter;
