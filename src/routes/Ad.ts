// src/routes/Ad.ts
import { Router } from "express";
import LoginAdmController from "../controller/LoginAdmController";

const router = Router();
const controller = new LoginAdmController();

router.post("/login", controller.login.bind(controller));
router.post("/setup-2fa", controller.setup2FA.bind(controller));
router.post("/verify-2fa", controller.verify2FA.bind(controller));
router.post("/check-2fa-status", controller.check2FARequired.bind(controller));
router.post("/logout", controller.logout.bind(controller));
router.post("/checkUser/admin", controller.checkUserAdmin.bind(controller));

export default router;
