import { eq } from "drizzle-orm";
import db from "../../db/client.ts";
import { todos } from "../../db/schema.ts";

export async function getDashboardStats(userId: string) {
    const today = new Date().toISOString().split("T")[0]!;

    const all = await db.query.todos.findMany({
        where: eq(todos.userId, userId),
    });

    const pending = all.filter(t => t.status === "pending").length;

    const overdue = all.filter(
        t => !t.isCompleted && new Date(`${t.dueOn}`).toISOString().split("T")[0]! < today
    ).length;

    const completedToday = all.filter(
        t =>
            t.status === "completed" &&
            t.completedAt?.toISOString().startsWith(today)
    ).length;

    const highPriorityOverdue = all.filter(
        t =>
            t.priority === "high" && !t.isCompleted &&
            new Date(`${t.dueOn}`).toISOString().split("T")[0]! < today
    ).length;

    return {
        pending,
        overdue,
        completedToday,
        highPriorityOverdue,
    };
}