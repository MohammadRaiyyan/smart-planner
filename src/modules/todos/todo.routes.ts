import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
    completeTodoController,
    createTodoController,
    dashboardController,
    getTodosController,
    updateTodoController,
} from "./todo.controller.ts";
import { completeTodoSchema, createTodoSchema, todoQuerySchema, updateTodoSchema } from "./todo.schema.ts";

const router = Router();

router.use(requireAuth);

router.get("/", validate({ query: todoQuerySchema }), getTodosController);
router.get("/dashboard", dashboardController);
router.post("/", validate({ body: createTodoSchema }), createTodoController);
router.patch("/:id", validate({ body: updateTodoSchema }), updateTodoController);
router.post("/:id/complete", validate({ body: completeTodoSchema }), completeTodoController);

export default router;