import { and, desc, eq } from "drizzle-orm";
import db from "../../db/client.ts";
import { groups, todos } from "../../db/schema.ts";
import { BadRequestError, NotFoundError } from "../../utils/appError.ts";
import type { CreateGroup, UpdateGroup } from "./group.schema.ts";

export async function createGroup(userId: string, input: CreateGroup) {
    const [group] = await db.insert(groups).values({ userId, ...input }).returning();
    return group;
}

export async function getGroups(userId: string) {
    return db.query.groups.findMany({
        where: eq(groups.userId, userId),
        orderBy: (g) => [desc(g.favorite), g.name],
    });
}

export async function updateGroup(userId: string, groupId: string, data: UpdateGroup) {
    const [group] = await db.update(groups).set(data).where(and(eq(groups.id, groupId), eq(groups.userId, userId))).returning();
    if (!group) throw new NotFoundError("Group not found");
    return group;
}

export async function deleteGroup(userId: string, groupId: string) {
    const group = await db.query.groups.findFirst({ where: and(eq(groups.id, groupId), eq(groups.userId, userId)) });
    if (!group) throw new NotFoundError("Group not found");

    const existing = await db.query.todos.findFirst({ where: and(eq(todos.groupId, groupId), eq(todos.userId, userId)) });
    if (existing) throw new BadRequestError("Group has todos. Remove or reassign them before deletion.");

    await db.delete(groups).where(and(eq(groups.id, groupId), eq(groups.userId, userId)));
}

export async function setFavorite(userId: string, groupId: string, favorite: boolean) {
    const [group] = await db.update(groups).set({ favorite }).where(and(eq(groups.id, groupId), eq(groups.userId, userId))).returning();
    if (!group) throw new NotFoundError("Group not found");
    return group;
}
