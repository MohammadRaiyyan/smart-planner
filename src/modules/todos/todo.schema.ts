import { z } from "zod";

export const priorityEnum = z.enum(["low", "medium", "high"]);
export const statusEnum = z.enum(["todo", "pending", "completed", "skipped"]);
export const orderBy = z.enum(["title", "status", "priority", "createdAt"]);

export const createTodoSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueOn: z.string().optional(),
    groupId: z.uuid().optional(),
    status: statusEnum.optional().default("todo"),
    priority: priorityEnum.optional().default("low"),
    notify: z.boolean().optional(),
});

export const updateTodoSchema = createTodoSchema.partial();

export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

export const completeTodoSchema = z.object({
    completionNote: z.string().optional(),
});


export const exportTodosQuerySchema = z.object({
    from: z.string(),
    to: z.string(),
});

export const todoQuerySchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    page: z.coerce.number().positive().default(0),
    limit: z.coerce.number().positive().default(10),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    orderBy: orderBy.optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).default("asc")

})

export type TodoQuery = z.infer<typeof todoQuerySchema>

export const exportTodoQuerySchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
})

export type ExportTodoQuery = z.infer<typeof exportTodoQuerySchema>