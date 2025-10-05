import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    avatar: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    settings: v.object({
      aiEnabled: v.boolean(),
    }),
  }).index("by_owner", ["ownerId"]),

  boards: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("kanban"),
      v.literal("sprint"),
      v.literal("calendar")
    ),
  }).index("by_workspace", ["workspaceId"]),

  tasks: defineTable({
    boardId: v.id("boards"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    assigneeId: v.optional(v.id("users")),
    position: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_assignee", ["assigneeId"]),
});