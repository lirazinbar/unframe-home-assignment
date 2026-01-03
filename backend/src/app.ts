import express, { Request, Response } from "express";
import cors from 'cors';
import { drive } from './google/driveClient';

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

// Middleware
app.use(express.json());

// fetch all files
app.get("/files", async (req: Request, res: Response) => {
  const { modifiedAfter, modifiedBefore } = req.query as {
    modifiedAfter?: string;
    modifiedBefore?: string;
  };

  const files = await fetchFilesByModifiedDate(
    modifiedAfter,
    modifiedBefore
  );

  res.json(files);
});

// Get file by ID
app.get('/files/:id', async (req, res) => {
  try {
    const file = await drive.files.get({
      fileId: req.params.id,
      fields: 'id,name,owners,createdTime,modifiedTime,webViewLink',
    });

    res.json(file.data);
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
});

// Delete file by ID
app.delete('/files/:id', async (req, res) => {
  try {
    await drive.files.delete({ fileId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file', err });
  }
});

// Edit file metadata
app.patch('/files/:id', async (req, res) => {
  try {
    const { name } = req.body;

    const updated = await drive.files.update({
      fileId: req.params.id,
      requestBody: { name },
      fields: 'id,name,modifiedTime',
    });

    res.json(updated.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update file' });
  }
});

export default app;
