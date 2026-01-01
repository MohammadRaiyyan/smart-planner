import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.ts";
import { streamCSV } from "../../utils/csv.ts";
import { getDashboardStats } from "./dashboard.service.ts";
import { getTodosForExport } from "./export.service.ts";
import type { ExportTodoQuery, TodoQuery } from "./todo.schema.ts";
import * as todoService from "./todo.service.ts";

export async function createTodoController(req: AuthRequest, res: Response) {
    res.status(201).json(
        await todoService.createTodo(req.userId!, req.body)
    );
}

export async function getTodosController(req: AuthRequest, res: Response) {
    res.json(
        await todoService.getTodos(req.userId!, req.query as unknown as TodoQuery)
    );
}

export async function updateTodoController(req: AuthRequest, res: Response) {
    res.json(
        await todoService.updateTodo(
            req.userId!,
            req.params.id!,
            req.body
        )
    );
}

export async function deleteTodoController(req: AuthRequest, res: Response) {
    res.json(
        await todoService.deleteTodo(
            req.userId!,
            req.params.id!,
        )
    );
}

export async function completeTodoController(req: AuthRequest, res: Response) {
    res.json(
        await todoService.completeTodo(
            req.userId!,
            req.params.id!,
        )
    );
}

export async function dashboardController(req: AuthRequest, res: Response) {
    res.json(await getDashboardStats(req.userId!));
}

export async function exportTodosController(
    req: AuthRequest,
    res: Response
) {
    const { startDate, endDate } = req.query as unknown as ExportTodoQuery;

    const rows = await getTodosForExport(req.userId!, startDate, endDate);
    streamCSV(res, rows);
}