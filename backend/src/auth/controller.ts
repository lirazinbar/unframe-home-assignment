import { Request, Response } from 'express';
import * as authService from './service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
