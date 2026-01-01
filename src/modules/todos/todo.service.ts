import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import db from "../../db/client.ts";
import { todos } from "../../db/schema.ts";
import {
    NotFoundError
} from "../../utils/appError.ts";
import type { CreateTodo, TodoQuery, UpdateTodo } from "./todo.schema.ts";

export async function createTodo(userId: string, input: CreateTodo) {
    const updatedInput = { ...input } as Omit<typeof todos.$inferSelect, "userId">
    if (input.status === "completed") {
        updatedInput.isCompleted = true
    }
    const [todo] = await db
        .insert(todos)
        .values({ userId, ...updatedInput })
        .returning();
    return todo;
}


export async function getTodos(userId: string, query: TodoQuery) {
    const filters = [];
    if(query.groupId){
        filters.push(eq(todos.groupId, query.groupId));
    }
    if (query.status) {
        filters.push(eq(todos.status, query.status));
    }
    if (query.priority) {
        filters.push(eq(todos.priority, query.priority))
    }
    if (query.startDate) {
        filters.push(gte(todos.createdAt, query.startDate))
    }
    if (query.endDate) {
        filters.push(lte(todos.createdAt, query.endDate))
    }

    const orderFn = query.order === "asc" ? asc : desc;


    return db.query.todos.findMany({
        where: and(eq(todos.userId, userId), ...filters),
        limit: query.limit,
        offset: query.limit * query.page,
        orderBy: (t) => {
            switch (query.orderBy) {
                case "priority":
                    return orderFn(t.priority);
                case "status":
                    return orderFn(t.status);
                case "title":
                    return orderFn(t.title)
                default:
                    return orderFn(t.createdAt);
            }
        },
    });
}

export async function updateTodo(
    userId: string,
    todoId: string,
    data: UpdateTodo
) {
    const [todo] = await db
        .update(todos)
        .set(data)
        .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
        .returning();

    if (!todo) throw new NotFoundError("Todo not found");
    return todo;
}
export async function deleteTodo(
    userId: string,
    todoId: string,
) {
    await db
        .delete(todos)
        .where(and(eq(todos.userId, userId), eq(todos.id, todoId)))
}
export async function completeTodo(
    userId: string,
    todoId: string,
) {
    const todo = await db.query.todos.findFirst({
        where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
    });

    if (!todo) throw new NotFoundError("Todo not found");

    const [updated] = await db
        .update(todos)
        .set({
            status: "completed",
            completedAt: new Date(),
            isCompleted: true,
        })
        .where(eq(todos.id, todoId))
        .returning();

    return updated;
}