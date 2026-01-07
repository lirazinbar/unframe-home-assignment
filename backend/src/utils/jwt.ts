import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1d';

export const generateToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET) as { userId: string };
