import express from "express";
import {
  searchUser,
  userLogin,
  userRegister,
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/search", verifyToken, searchUser);

export default router;
