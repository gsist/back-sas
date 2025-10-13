// src/routes/Ad.ts
import { Router } from "express";
import LoginAdmController from "../controller/LoginAdmController";

const router = Router();
const loginAdmController = new LoginAdmController();

// Rotas de autenticação AD e 2FA
router.post("/login", loginAdmController.login.bind(loginAdmController));
router.post("/setup-2fa", loginAdmController.setup2FA.bind(loginAdmController));
router.post("/verify-2fa", loginAdmController.verify2FA.bind(loginAdmController));
router.post("/check-2fa-status", loginAdmController.check2FARequired.bind(loginAdmController));
router.post("/logout", loginAdmController.logout.bind(loginAdmController));
router.post("/checkUser/admin", loginAdmController.checkUserAdmin.bind(loginAdmController));

export default router;
