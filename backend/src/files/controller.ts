import { Request, Response } from 'express';
import { drive } from './driveClient';

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

export const getFiles = async (req: Request, res: Response) => {
    const { modifiedAfter, modifiedBefore } = req.query as {
        modifiedAfter?: string;
        modifiedBefore?: string;
    };

    const files = await fetchFilesByModifiedDate(
        modifiedAfter,
        modifiedBefore
    );

    res.json(files);
};

export const getFileById = async (req: Request, res: Response) => {
    try {
        const file = await drive.files.get({
            fileId: req.params.id,
            fields: 'id,name,owners,createdTime,modifiedTime,webViewLink',
        });

        res.json(file.data);
    } catch {
        res.status(404).json({ error: 'File not found' });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        await drive.files.delete({ fileId: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

export const updateFile = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const updated = await drive.files.update({
            fileId: req.params.id,
            requestBody: { name },
            fields: 'id,name,modifiedTime',
        });

        res.json(updated.data);
    } catch {
        res.status(500).json({ error: 'Failed to update file' });
    }
};
