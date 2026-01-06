// src/controllers/ai.controller.ts
import { Request, Response } from 'express';
import { askAi } from './aiAsk';

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await askAi(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get answer from AI' });
  }
};
