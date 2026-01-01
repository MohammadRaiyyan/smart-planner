import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import authRoutes from "./modules/auth/auth.routes.ts";
import groupsRoutes from "./modules/groups/group.routes.ts";
import todosRoutes from "./modules/todos/todo.routes.ts";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
	res.send("Hello, Smart Planner!");
});

app.use("/auth", authRoutes);
app.use("/todos", todosRoutes);
app.use("/groups", groupsRoutes);

app.use(errorMiddleware);
export { app };
export default app;
