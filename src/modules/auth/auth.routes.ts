import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
} from "./auth.controller.ts";
import {
    loginSchema,
    registerSchema,
} from "./auth.schema.ts";

const router = Router();

router.post("/login", validate({ body: loginSchema }), loginController);
router.post("/register", validate({ body: registerSchema }), registerController);
router.post("/logout", logoutController);
router.post("/refresh", refreshTokenController);

export default router;