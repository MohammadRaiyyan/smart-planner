import { and, eq, gte, lte } from "drizzle-orm";
import db from "../../db/client.ts";
import { todos } from "../../db/schema.ts";

export async function getTodosForExport(
    userId: string,
    from: Date,
    to: Date
) {

    return db
        .select({
            title: todos.title,
            description: todos.description,
            priority: todos.priority,
            status: todos.status,
            completedAt: todos.completedAt,
        })
        .from(todos)
        .where(
            and(
                eq(todos.userId, userId),
                gte(todos.completedAt, from),
                lte(todos.completedAt, to)
            )
        )
}