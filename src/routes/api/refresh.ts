import express from "express";
import refreshTokenController from "../../controllers/refreshTokenController";

const router = express.Router();
router.get("/", refreshTokenController.refreshToken);

export default router;
