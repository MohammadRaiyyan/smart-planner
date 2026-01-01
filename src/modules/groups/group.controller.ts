import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.ts";
import type { CreateGroup, FavoriteBody, UpdateGroup } from "./group.schema.ts";
import * as groupService from "./group.service.ts";

export async function createGroupController(req: AuthRequest, res: Response) {
    res.status(201).json(await groupService.createGroup(req.userId!, req.body as CreateGroup));
}

export async function getGroupsController(req: AuthRequest, res: Response) {
    res.json(await groupService.getGroups(req.userId!));
}

export async function updateGroupController(req: AuthRequest, res: Response) {
    res.json(await groupService.updateGroup(req.userId!, req.params.id!, req.body as UpdateGroup));
}

export async function deleteGroupController(req: AuthRequest, res: Response) {
    await groupService.deleteGroup(req.userId!, req.params.id!);
    res.status(204).send(null);
}

export async function setFavoriteController(req: AuthRequest, res: Response) {
    const body = req.body as FavoriteBody;
    res.json(await groupService.setFavorite(req.userId!, req.params.id!, body.favorite));
}
