import { relations } from "drizzle-orm";
import {
    boolean,
    date,
    index,
    pgTable,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const sessions = pgTable(
    "sessions",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        refreshToken: text("refresh_token").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        revoked: boolean("revoked").default(false),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => [index("sessions_user_idx").on(table.userId)],
);

export const groups = pgTable(
    "groups",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        favorite: boolean("favorite").default(false),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [index("groups_user_idx").on(table.userId)],
);

export const todos = pgTable(
    "todos",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        groupId: uuid("group_id").references(() => groups.id),

        title: text("title").notNull(),
        description: text("description"),

        priority: text("priority").$type<"low" | "medium" | "high">().notNull(),
        status: text("status")
            .$type<"todo" | "pending" | "completed" | "skipped">()
            .default("todo"),

        dueOn: date("due_on"),

        notify: boolean("notify").default(false),
        isCompleted: boolean("is_completed"),
        completedAt: timestamp("completed_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        index("todos_user_priority_idx").on(table.userId, table.priority),
        index("todos_user_title_idx").on(table.userId, table.title),
        index("todos_status_idx").on(table.status),
        index("todos_group_idx").on(table.groupId),
    ],
);




export const userRelations = relations(users, ({ many }) => ({
    todos: many(todos),
    sessions: many(sessions),
    groups: many(groups),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const todoRelations = relations(todos, ({ one }) => ({
    user: one(users, {
        fields: [todos.userId],
        references: [users.id],
    }),
    group: one(groups, {
        fields: [todos.groupId],
        references: [groups.id],
    }),
}));

export const groupRelations = relations(groups, ({ one, many }) => ({
    user: one(users, {
        fields: [groups.userId],
        references: [users.id],
    }),
    todos: many(todos),
}));