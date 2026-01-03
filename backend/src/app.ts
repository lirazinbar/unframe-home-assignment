import express, { Request, Response } from "express";
import cors from 'cors';
import { drive } from './google/driveClient';

export async function listFiles() {
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'files(id, name, mimeType, owners, modifiedTime, createdTime, webViewLink)',
  });

  return res.data.files;
}

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// fetch all files
app.get("/files", async (req: Request, res: Response) => {
    const files = await listFiles();
    res.json(files);
});

export default app;
