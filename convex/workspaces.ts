import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    ownerId: v.id("users"),
    settings: v.optional(v.object({
      aiEnabled: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workspaces", {
      ...args,
      settings: args.settings || { aiEnabled: true },
    });
  },
});

export const list = query({
  args: { ownerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const { ownerId } = args;
    if (ownerId) {
      return await ctx.db
        .query("workspaces")
        .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
        .collect();
    }
    return await ctx.db.query("workspaces").collect();
  },
});

export const get = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.optional(v.string()),
    settings: v.optional(v.object({
      aiEnabled: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    // First, get all boards in this workspace
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.id))
      .collect();

    // Delete all tasks in all boards
    for (const board of boards) {
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_board", (q) => q.eq("boardId", board._id))
        .collect();
      
      for (const task of tasks) {
        await ctx.db.delete(task._id);
      }
      
      // Delete the board
      await ctx.db.delete(board._id);
    }

    // Finally, delete the workspace
    await ctx.db.delete(args.id);
  },
});