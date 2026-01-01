import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
    createGroupController,
    deleteGroupController,
    getGroupsController,
    setFavoriteController,
    updateGroupController,
} from "./group.controller.ts";
import { createGroupSchema, favoriteSchema, updateGroupSchema } from "./group.schema.ts";

const router = Router();

router.use(requireAuth);

router.get("/", getGroupsController);
router.post("/", validate({ body: createGroupSchema }), createGroupController);
router.patch("/:id", validate({ body: updateGroupSchema }), updateGroupController);
router.delete("/:id", deleteGroupController);
router.post("/:id/favorite", validate({ body: favoriteSchema }), setFavoriteController);

export default router;
