import { z } from "zod";

export const createGroupSchema = z.object({
    name: z.string().min(1),
    favorite: z.boolean().optional().default(false),
});

export const updateGroupSchema = createGroupSchema.partial();

export const favoriteSchema = z.object({
    favorite: z.boolean(),
});

export type CreateGroup = z.infer<typeof createGroupSchema>;
export type UpdateGroup = z.infer<typeof updateGroupSchema>;
export type FavoriteBody = z.infer<typeof favoriteSchema>;
