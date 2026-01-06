// src/routes/files.router.ts
import { Router } from 'express';
import {
  getFiles,
  getFileById,
  deleteFile,
  updateFile,
} from './controller';

const filesRouter = Router();

filesRouter.get('/', getFiles);
filesRouter.get('/:id', getFileById);
filesRouter.delete('/:id', deleteFile);
filesRouter.patch('/:id', updateFile);

export default filesRouter;
