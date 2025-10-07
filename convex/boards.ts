import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("kanban"),
      v.literal("sprint"),
      v.literal("calendar")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("boards", args);
  },
});

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("boards"),
    name: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("kanban"),
      v.literal("sprint"),
      v.literal("calendar")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    // First, delete all tasks in this board
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();
    
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Then delete the board
    await ctx.db.delete(args.id);
  },
});

export const getWithTasks = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);
    if (!board) return null;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .order("asc")
      .collect();

    return {
      ...board,
      tasks,
    };
  },
});