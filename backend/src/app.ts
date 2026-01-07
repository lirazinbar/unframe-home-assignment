import express from "express";
import cors from 'cors';
import { drive } from './files/driveClient';
import filesRouter from "./files/router";
import aiRouter from "./ai/router";
import { authMiddleware } from "./auth/middleware";

export async function fetchFilesByModifiedDate(modifiedAfter?: string,
  modifiedBefore?: string) {
  const qParts: string[] = [];

  if (modifiedAfter) {
    qParts.push(`modifiedTime > '${modifiedAfter}'`);
  }

  if (modifiedBefore) {
    qParts.push(`modifiedTime < '${modifiedBefore}'`);
  }

  const q = qParts.length ? qParts.join(' and ') : undefined;

  const res = await drive.files.list({
    q,
    pageSize: 10,
    fields: 'files(id, name, mimeType, owners, modifiedTime, createdTime, webViewLink)',
  });

  return res.data.files;
}

const app = express();
app.use(cors());
app.use(express.json());

app.use('/files', authMiddleware, filesRouter);
app.use('/ai', authMiddleware, aiRouter);

export default app;
