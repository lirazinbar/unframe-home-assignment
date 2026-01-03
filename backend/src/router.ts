import { Router } from "express";
import healthRoutes from "./health.routes";

const router = Router();

router.get("/health", healthRoutes);

export default router;
